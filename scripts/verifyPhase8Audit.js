import http from 'http';
import { app } from '../backend/dist/app.js';

let server;
const PORT = 5008;

function runRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
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

async function verifyPhase8Audit() {
  console.log('====================================================');
  console.log('🍵 SUJJU FOODS - Phase 8 Production Audit & Integrity Verification');
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

  // 1. Unified Multi-Channel Notification Engine
  console.log('--- 1. Testing Unified Notification Engine (WhatsApp, Email, SMS) ---');
  const notifRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/notifications/test',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      event: 'ORDER_CONFIRMATION',
      recipientName: 'K. Ramesh',
      recipientPhone: '+91 98480 99887',
      recipientEmail: 'ramesh@example.com',
      metadata: {
        orderId: 'SF-2026-894120',
        quantity: 8,
        totalAmount: 1440,
        pincode: '530016',
      },
    }
  );

  assert(notifRes.status === 201, 'Notification engine dispatches test notification (HTTP 201)');
  assert(notifRes.data?.notification?.channels?.includes('whatsapp'), 'Notification includes WhatsApp channel');
  assert(notifRes.data?.notification?.channels?.includes('email'), 'Notification includes Email channel');

  const historyRes = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/notifications/history',
    method: 'GET',
  });
  assert(historyRes.status === 200, 'Notification history endpoint returns HTTP 200');
  assert(historyRes.data?.total >= 1, 'Sent notifications recorded in persistent audit memory');

  // 2. Customer-Facing AI Chatbot
  console.log('\n--- 2. Testing Customer AI Chatbot ---');
  // 2A: Pricing & 0% GST inquiry
  const priceChat = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/chatbot/message',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { message: 'What is the price of your tea powder and is GST included?' }
  );

  assert(priceChat.status === 200, 'Chatbot returns HTTP 200 for pricing inquiry');
  assert(priceChat.data?.response?.category === 'product_info', 'Chatbot identifies product_info category');
  assert(priceChat.data?.response?.reply?.includes('₹180 per 250g pack'), 'Chatbot states authoritative ₹180 price');
  assert(priceChat.data?.response?.reply?.includes('0% GST'), 'Chatbot affirms 0% GST configuration');

  // 2B: Order Tracking inquiry (no PII leakage)
  const trackChat = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/chatbot/message',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { message: 'Where is my order SF-2026-894120?' }
  );

  assert(trackChat.status === 200, 'Chatbot tracks order by Order ID');
  assert(trackChat.data?.response?.category === 'order_status', 'Chatbot categorizes as order_status');
  assert(trackChat.data?.response?.reply?.includes('SF-2026-894120'), 'Chatbot cites order ID in reply');
  assert(trackChat.data?.response?.reply?.includes('24-Hour SLA'), 'Chatbot references 24-Hour SLA commitment');

  // 2C: Pincode Serviceability inquiry
  const pinChat = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/chatbot/message',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { message: 'Can you deliver to 530016?' }
  );

  assert(pinChat.status === 200, 'Chatbot answers pincode serviceability');
  assert(pinChat.data?.response?.reply?.includes('serviceable'), 'Chatbot confirms AP zone serviceability');

  // 3. Excel & CSV Reporting Downloads
  console.log('\n--- 3. Testing Excel / CSV Accounting Exports ---');
  const expOrders = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/export/orders',
    method: 'GET',
  });

  assert(expOrders.status === 200, 'Orders CSV export returns HTTP 200');
  assert(expOrders.headers['content-type']?.includes('text/csv'), 'Orders export sets Content-Type text/csv');
  assert(expOrders.raw?.includes('orderId,invoiceNumber,customerName'), 'Orders CSV has structured headers');

  const expCollections = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/export/collections',
    method: 'GET',
  });

  assert(expCollections.status === 200, 'Collections CSV export returns HTTP 200');
  assert(expCollections.raw?.includes('amountCollected,mode,collectionStatus'), 'Collections CSV has reconciliation headers');

  const expInventory = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/export/inventory',
    method: 'GET',
  });

  assert(expInventory.status === 200, 'Inventory valuation CSV export returns HTTP 200');
  assert(expInventory.raw?.includes('SF-TEA-250G'), 'Inventory CSV includes finished goods SF-TEA-250G');

  // 4. Immutable Administrative Audit Logging
  console.log('\n--- 4. Testing Immutable Admin Audit Logs ---');
  const auditRes = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/admin/audit-logs',
    method: 'GET',
  });

  assert(auditRes.status === 200, 'Audit logs endpoint returns HTTP 200');
  assert(auditRes.data?.total >= 2, 'Audit log records administrator mutations');
  const firstLog = auditRes.data?.logs?.[0];
  assert(Boolean(firstLog?.performedBy && firstLog?.oldValue && firstLog?.newValue), 'Audit record captures user, timestamp, old value and new value');

  // 5. Production Business Controls & Invariants Verification
  console.log('\n--- 5. Testing Production Business Invariants & Integrity Controls ---');
  // Control 1: Stock cannot become negative through excess production
  const excessProdRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/manufacturing/production/create',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { plannedQuantityPacks: 100000 } // Exceeds raw material inventory
  );

  assert(excessProdRes.status === 400, 'Invariant 1: System prevents negative raw stock on oversized production (HTTP 400)');
  console.log(`   Negative stock guard message: "${excessProdRes.data?.message}"`);

  // Control 2: QC-rejected batches cannot enter sellable inventory
  const qcRejectionRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/manufacturing/batches/SF-B26-101/qc',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      inspectedBy: 'Chemist',
      moisturePercentage: 9.5, // Fails standard
      liquorScoreOutOf10: 6.0,
      sealIntegrityPassed: false,
      approved: false,
    }
  );

  assert(qcRejectionRes.status === 200, 'Invariant 2: Rejection evaluation accepted');
  assert(qcRejectionRes.data?.batch?.isSellableInventory === false, 'Invariant 2: Quarantined batch blocked from sellable inventory');

  // Control 3: Collection reconciliation cannot double-approve already reconciled transaction
  const firstReconRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/finance/collections/SF-2026-894120/reconcile',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { notes: 'Settled' }
  );

  assert(firstReconRes.status === 200, 'Invariant 3: Initial collection reconciliation succeeds (HTTP 200)');

  // Duplicate reconciliation attempt
  const dupReconRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/finance/collections/SF-2026-894120/reconcile',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { notes: 'Duplicate try' }
  );

  assert(dupReconRes.status === 400, 'Invariant 3: Duplicate collection reconciliation blocked (HTTP 400)');
  console.log(`   Idempotency guard message: "${dupReconRes.data?.message}"`);

  // Control 4: Pricing formula strictly enforced
  const priceCheck = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/orders/calculate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { quantity: 8 }
  );

  assert(priceCheck.status === 200, 'Invariant 4: Price calculation endpoint functional');
  assert(priceCheck.data?.data?.totalAmount === 1440, 'Invariant 4: Strict price enforcement (8 × ₹180 = ₹1,440.00)');
  assert(priceCheck.data?.data?.gstAmount === 0, 'Invariant 4: 0% GST strictly enforced (₹0 GST)');

  console.log('\n====================================================');
  console.log(`Phase 8 Audit Verification Completed: ${passedTests} / ${totalTests} assertions passed (${Math.round((passedTests / totalTests) * 100)}%)`);
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
    await verifyPhase8Audit();
  } catch (err) {
    console.error('Fatal test runner error:', err);
    process.exit(1);
  } finally {
    server.close();
  }
});
