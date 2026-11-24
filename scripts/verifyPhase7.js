import http from 'http';
import { app } from '../backend/dist/app.js';

let server;
const PORT = 5007;

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

async function verifyPhase7() {
  console.log('====================================================');
  console.log('🍵 SUJJU FOODS - Phase 7 Advanced Modules Verification');
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

  // 1. QR Code Product Authentication
  console.log('--- 1. Testing QR Code Product Authentication ---');
  const qrValidRes = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/qr/SF-B26-101',
    method: 'GET',
  });

  assert(qrValidRes.status === 200, 'Valid QR code returns HTTP 200');
  assert(qrValidRes.data?.verification?.isAuthentic === true, 'Product verified as 100% genuine SUJJU FOODS');
  assert(qrValidRes.data?.verification?.mrp === 180, 'MRP strictly enforced at ₹180');
  assert(qrValidRes.data?.verification?.fssaiLicense === 'FSSAI Lic. No. 10123999000123', 'FSSAI license verified');
  assert(qrValidRes.data?.verification?.labTestReport?.moisturePercentage === 5.2, 'Lab report verifies moisture is 5.2% (< 6.5% standard)');

  // Test Counterfeit / Fraudulent Batch
  const qrFakeRes = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/qr/COUNTERFEIT-999',
    method: 'GET',
  });

  assert(qrFakeRes.status === 404, 'Invalid/unauthenticated QR code returns HTTP 404');
  assert(qrFakeRes.data?.isAuthentic === false, 'Product flagged as unverified counterfeit');

  // 2. Customer Subscriptions
  console.log('\n--- 2. Testing Customer Recurring Subscriptions ---');
  const subCreateRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/subscriptions',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      customerId: 'CUST-DEMO-001',
      customerName: 'Sujata Reddy',
      customerPhone: '+91 98480 12345',
      deliveryPincode: '530016',
      deliveryAddress: 'Flat 402, Dwaraka Nagar, Visakhapatnam',
      frequency: 'monthly',
      quantityPacks: 4,
      paymentMode: 'cash',
    }
  );

  assert(subCreateRes.status === 201, 'Recurring subscription created successfully (HTTP 201)');
  assert(subCreateRes.data?.subscription?.totalPerDelivery === 4 * 180, 'Subscription priced at ₹180/pack (4 * 180 = ₹720)');
  assert(subCreateRes.data?.subscription?.status === 'active', 'Subscription is active');
  const subId = subCreateRes.data?.subscription?.id;

  const subListRes = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/subscriptions',
    method: 'GET',
  });
  assert(subListRes.status === 200, 'Subscriptions list returns HTTP 200');
  assert(subListRes.data?.subscriptions?.length >= 2, 'Found at least 2 subscriptions in store');

  // Pause Subscription
  const subPauseRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: `/api/v1/subscriptions/${subId}/status`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { status: 'paused' }
  );
  assert(subPauseRes.status === 200, 'Subscription pause returns HTTP 200');
  assert(subPauseRes.data?.subscription?.status === 'paused', 'Subscription status successfully transitioned to paused');

  // 3. Customer Returns & Complaints
  console.log('\n--- 3. Testing Customer Returns & Complaints ---');
  const compCreateRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/complaints',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      orderId: 'SF-2026-894120',
      customerName: 'Anil Kumar',
      customerPhone: '+91 94401 22334',
      category: 'packaging_damaged',
      description: 'Outer carton creased during courier transit',
    }
  );

  assert(compCreateRes.status === 201, 'Complaint ticket logged successfully (HTTP 201)');
  const compId = compCreateRes.data?.complaint?.id;
  assert(compCreateRes.data?.complaint?.resolutionStatus === 'open', 'Complaint ticket initialized as open');

  // Resolve Complaint
  const compResolveRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: `/api/v1/complaints/${compId}/resolve`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      resolutionStatus: 'resolved',
      resolutionNotes: 'Dispatched fresh 250g replacement pack via Visakhapatnam distributor',
    }
  );
  assert(compResolveRes.status === 200, 'Complaint resolution returns HTTP 200');
  assert(compResolveRes.data?.complaint?.resolutionStatus === 'resolved', 'Complaint status updated to resolved');

  // 4. Employee Attendance & Task Management
  console.log('\n--- 4. Testing Employee Shift Attendance & Tasks ---');
  const attInRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/employee/attendance/check-in',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      employeeId: 'EMP-014',
      employeeName: 'Ravi Teja',
      role: 'Packaging Line Supervisor',
      location: 'Visakhapatnam Unit Floor B',
    }
  );

  assert(attInRes.status === 201, 'Employee shift check-in logged (HTTP 201)');
  assert(attInRes.data?.record?.status === 'present', 'Attendance status marked as present');

  const tasksRes = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/employee/tasks',
    method: 'GET',
  });
  assert(tasksRes.status === 200, 'Employee tasks list returns HTTP 200');
  assert(tasksRes.data?.tasks?.length >= 3, 'Found 3 daily tasks on checklist');

  // Complete a task
  const taskCompleteRes = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/employee/tasks/TSK-102/complete',
    method: 'POST',
  });
  assert(taskCompleteRes.status === 200, 'Employee task marked completed (HTTP 200)');
  assert(taskCompleteRes.data?.task?.isCompleted === true, 'Task isCompleted flag set to true');

  // Check-out
  const attOutRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/employee/attendance/check-out',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { employeeId: 'EMP-014' }
  );
  assert(attOutRes.status === 200, 'Employee shift checkout logged (HTTP 200)');
  assert(attOutRes.data?.record?.status === 'completed', 'Attendance status marked completed');

  // 5. Admin AI Business Intelligence & Reports
  console.log('\n--- 5. Testing AI Business Intelligence & Daily Reports ---');
  const aiRes = await runRequest(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/v1/admin/ai/insights',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { query: 'Predict CTC tea stock depletion and cash float risk' }
  );

  assert(aiRes.status === 200, 'AI Business Intelligence returns HTTP 200');
  assert(aiRes.data?.insights?.recommendations?.length >= 3, 'AI generated 3 actionable strategic recommendations');
  assert(aiRes.data?.insights?.salesVelocity?.averageDailyPacksSold === 28, 'AI analyzes 28 packs/day sales velocity');

  const reportRes = await runRequest({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/v1/admin/reports/daily',
    method: 'GET',
  });

  assert(reportRes.status === 200, 'Daily operational report returns HTTP 200');
  assert(reportRes.data?.report?.productPrice === 180, 'Report reflects ₹180 standard product price');
  assert(reportRes.data?.report?.gstRate === '0% (Standard Approved Configuration)', 'Report enforces 0% GST');
  assert(reportRes.data?.report?.collections?.reconciledAmount === 5040, 'Reconciled collections report ₹5,040');

  console.log('\n====================================================');
  console.log(`Phase 7 Verification Completed: ${passedTests} / ${totalTests} assertions passed (${Math.round((passedTests / totalTests) * 100)}%)`);
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
    await verifyPhase7();
  } catch (err) {
    console.error('Fatal test runner error:', err);
    process.exit(1);
  } finally {
    server.close();
  }
});
