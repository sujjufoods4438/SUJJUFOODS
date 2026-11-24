import http from 'http';
import { app } from '../backend/dist/app.js';

let server;
const PORT = 5006;

function runRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function verifyPhase6() {
  console.log('====================================================');
  console.log('🍵 SUJJU FOODS - Phase 6 Manufacturing & QC Verification');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // 1. Check Raw Materials Master
  console.log('--- 1. Testing Raw Materials Master Balances ---');
  const matRes = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/manufacturing/materials',
    method: 'GET',
  });

  assert(matRes.status === 200, 'Materials master endpoint returns HTTP 200');
  assert(matRes.data?.materials?.length >= 4, 'Materials list contains at least 4 items (CTC, BOP, Pouches, Boxes)');
  const initialCtc = matRes.data.materials.find((m) => m.code === 'RAW-TEA-CTC')?.currentStock || 0;
  console.log(`   Initial RAW-TEA-CTC Stock: ${initialCtc} kg`);

  // 2. Check Standard Bill of Materials (BOM) Formula
  console.log('\n--- 2. Testing Bill of Materials (BOM) Formula ---');
  const bomRes = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/manufacturing/bom',
    method: 'GET',
  });

  assert(bomRes.status === 200, 'BOM endpoint returns HTTP 200');
  assert(bomRes.data?.bom?.productId === 'SF-TEA-250G', 'BOM is calibrated for SF-TEA-250G standard tea product');
  assert(bomRes.data?.bom?.formula?.length === 4, 'BOM has 4 recipe components (CTC 70%, BOP 30%, Pouches, Boxes)');

  // 3. Create Production Batch Run
  console.log('\n--- 3. Testing Production Order Execution (400 packs = 100 kg) ---');
  const prodRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/manufacturing/production/create',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { plannedQuantityPacks: 400 }
  );

  assert(prodRes.status === 201, 'Production batch creation returns HTTP 201 Created');
  assert(prodRes.data?.batch?.batchNumber?.startsWith('SF-B26-'), `Generated unique batch number: ${prodRes.data?.batch?.batchNumber}`);
  assert(prodRes.data?.batch?.qcStatus === 'qc_pending', 'Mandatory rule: Batch begins with qc_pending status');
  assert(prodRes.data?.batch?.isSellableInventory === false, 'Mandatory rule: Batch is NOT sellable inventory before QC approval');
  assert(prodRes.data?.consumed?.ctcKg === 70, 'BOM consumption deduction: 70 kg CTC deducted');
  assert(prodRes.data?.consumed?.bopKg === 30, 'BOM consumption deduction: 30 kg BOP deducted');
  assert(prodRes.data?.consumed?.pouchesPieces === 400, 'BOM consumption deduction: 400 pouches deducted');

  const createdBatchNumber = prodRes.data?.batch?.batchNumber;

  // 4. Verify Raw Inventory was Deducted
  console.log('\n--- 4. Verifying Stock Balance Reduction ---');
  const matAfterRes = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/manufacturing/materials',
    method: 'GET',
  });
  const newCtc = matAfterRes.data.materials.find((m) => m.code === 'RAW-TEA-CTC')?.currentStock;
  assert(newCtc === initialCtc - 70, `CTC raw stock deducted accurately: ${initialCtc} -> ${newCtc} kg`);

  // 5. Test Quality Control (QC) Violation: Rejection on High Moisture
  console.log('\n--- 5. Testing QC Standards Gate (Enforcing <6.5% Moisture) ---');
  const qcViolationRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: `/api/v1/manufacturing/batches/${createdBatchNumber}/qc`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      inspectedBy: 'Chief QC Chemist',
      moisturePercentage: 8.2, // Exceeds 6.5% limit
      liquorScoreOutOf10: 8.0,
      sealIntegrityPassed: true,
      remarks: 'High moisture detected',
      approved: true, // Should be rejected by validation
    }
  );

  assert(qcViolationRes.status === 400, 'System rejects approval when moisture exceeds 6.5% benchmark (HTTP 400)');
  console.log(`   Validation message: "${qcViolationRes.data?.message}"`);

  // 6. Test Valid Quality Control Approval
  console.log('\n--- 6. Testing Valid QC Approval & Release to Sellable Stock ---');
  const qcValidRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: `/api/v1/manufacturing/batches/${createdBatchNumber}/qc`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      inspectedBy: 'Chief QC Chemist (K. Suresh)',
      moisturePercentage: 5.3,
      liquorScoreOutOf10: 9.0,
      sealIntegrityPassed: true,
      remarks: 'Golden-red cup, strong briskness, moisture well within FSSAI safety norms',
      approved: true,
    }
  );

  assert(qcValidRes.status === 200, 'Valid QC inspection returns HTTP 200');
  assert(qcValidRes.data?.batch?.qcStatus === 'qc_approved', 'Batch status updated to qc_approved');
  assert(qcValidRes.data?.batch?.isSellableInventory === true, 'Batch is now officially certified as sellable finished goods');

  // 7. Verify Inventory Overview
  console.log('\n--- 7. Testing Comprehensive Inventory Overview ---');
  const invRes = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/manufacturing/inventory',
    method: 'GET',
  });

  assert(invRes.status === 200, 'Inventory overview returns HTTP 200');
  assert(invRes.data?.finishedGoods?.sellableAvailablePacks >= 1200, `Sellable finished packs reflects newly approved batch: ${invRes.data?.finishedGoods?.sellableAvailablePacks} packs`);
  assert(invRes.data?.finishedGoods?.sku === 'SF-TEA-250G', 'Finished goods SKU is SF-TEA-250G');

  // 8. Test Suppliers & Purchase Order Creation
  console.log('\n--- 8. Testing Suppliers & Purchase Order Issuance ---');
  const supRes = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/manufacturing/suppliers',
    method: 'GET',
  });

  assert(supRes.status === 200, 'Suppliers endpoint returns HTTP 200');
  assert(supRes.data?.suppliers?.length >= 3, 'Found 3 registered suppliers (Assam Valley, Nilgiri, Supreme Flex)');

  const poRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/manufacturing/purchases',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      supplierId: 'SUP-001',
      materialCode: 'RAW-TEA-CTC',
      orderedQuantity: 500,
    }
  );

  assert(poRes.status === 201, 'Purchase Order issued successfully (HTTP 201)');
  const createdPoNumber = poRes.data?.po?.poNumber;
  assert(createdPoNumber?.startsWith('PO-2026-'), `Generated PO number: ${createdPoNumber}`);
  assert(poRes.data?.po?.totalAmount === 500 * 220, 'PO total calculated accurately at unit cost (500kg * ₹220 = ₹1,10,000)');

  // 9. Test Inward Goods Receipt (GRN) & Stock Balance Credit
  console.log('\n--- 9. Testing Goods Receipt (GRN) Inward & Stock Credit ---');
  const preGrnCtc = (await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/manufacturing/materials',
    method: 'GET',
  })).data.materials.find((m) => m.code === 'RAW-TEA-CTC')?.currentStock;

  const grnRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: `/api/v1/manufacturing/purchases/${createdPoNumber}/receive`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { acceptedQuantity: 500 }
  );

  assert(grnRes.status === 200, 'Goods Receipt (GRN) recorded successfully (HTTP 200)');
  assert(grnRes.data?.po?.status === 'completed', 'PO status marked as completed');
  assert(grnRes.data?.material?.currentStock === preGrnCtc + 500, `Stock credited: ${preGrnCtc} -> ${grnRes.data?.material?.currentStock} kg`);

  console.log('\n====================================================');
  console.log(`Phase 6 Verification Completed: ${passedTests} / ${totalTests} assertions passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('====================================================\n');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Start server and run tests
server = app.listen(PORT, async () => {
  try {
    await verifyPhase6();
  } catch (err) {
    console.error('Fatal test runner error:', err);
    process.exit(1);
  } finally {
    server.close();
  }
});
