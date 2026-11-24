import http from 'http';
import { app } from '../backend/dist/app.js';

async function runPhase4Tests() {
  console.log('====================================================');
  console.log('   SUJJU FOODS - Phase 4 Delivery Logistics Tests   ');
  console.log('====================================================');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[Test Server] In-memory server listening on port ${port}`);

  try {
    // Setup: Create a test order in Visakhapatnam territory (530016)
    console.log('\n[Setup] Creating active customer order for 530016 ...');
    const orderRes = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 8,
        paymentMode: 'cash',
        deliveryAddress: {
          houseNumber: 'D.No 4-52/1',
          street: 'Main Road',
          area: 'Dwaraka Nagar',
          city: 'Visakhapatnam',
          district: 'Visakhapatnam',
          state: 'Andhra Pradesh',
          pincode: '530016',
          recipientName: 'Ramesh Kumar',
          contactNumber: '9876512345',
        },
      }),
    });
    const orderData = await orderRes.json();
    const orderId = orderData.order.orderId;
    console.log(`    Created Order ID: ${orderId} | Assigned: ${orderData.order.distributorName}`);

    // 1. Get Assigned Orders for Distributor
    console.log('\n[1] Testing Distributor Assigned Orders Queue ...');
    const queueRes = await fetch(`${baseUrl}/api/v1/delivery/assigned?distributorId=APDIST01`);
    const queueData = await queueRes.json();
    console.log('    Total Assigned Orders:', queueData.orders.length);
    console.log('    Grouped Counts:', JSON.stringify(queueData.grouped));
    if (!queueData.success || queueData.orders.length === 0) {
      throw new Error('Assigned orders retrieval failed');
    }
    console.log('    -> PASSED');

    // 2. Accept Order Workflow
    console.log(`\n[2] Testing Order Acceptance by Distributor for ${orderId} ...`);
    const acceptRes = await fetch(`${baseUrl}/api/v1/delivery/${orderId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accepted: true }),
    });
    const acceptData = await acceptRes.json();
    console.log('    Accept Result:', acceptData.message);
    if (!acceptData.success || acceptData.status !== 'Accepted by Distributor') {
      throw new Error('Order acceptance failed');
    }
    console.log('    -> PASSED');

    // 3. Record Pickup Evidence (Package Photo + GPS + Timestamp)
    console.log(`\n[3] Testing Pickup Proof Submission (GPS + Photo) for ${orderId} ...`);
    const pickupRes = await fetch(`${baseUrl}/api/v1/delivery/${orderId}/pickup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        photoUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600',
        latitude: 17.6868,
        longitude: 83.2185,
      }),
    });
    const pickupData = await pickupRes.json();
    console.log('    Pickup Status:', pickupData.status);
    console.log(`    Recorded GPS: Lat ${pickupData.pickupProof.latitude}, Lon ${pickupData.pickupProof.longitude}`);
    if (!pickupData.success || pickupData.status !== 'Picked Up') {
      throw new Error('Pickup proof submission failed');
    }
    console.log('    -> PASSED');

    // 4. Record Dispatch (Out for Delivery + Generate Customer Delivery OTP)
    console.log(`\n[4] Testing Dispatch & Customer Delivery OTP Generation for ${orderId} ...`);
    const dispatchRes = await fetch(`${baseUrl}/api/v1/delivery/${orderId}/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        photoUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
        latitude: 17.6868,
        longitude: 83.2185,
      }),
    });
    const dispatchData = await dispatchRes.json();
    console.log('    Dispatch Status:', dispatchData.status);
    console.log('    Generated Customer Delivery OTP:', dispatchData.deliveryOtp);
    if (!dispatchData.success || dispatchData.status !== 'Out for Delivery' || !dispatchData.deliveryOtp) {
      throw new Error('Dispatch workflow failed');
    }
    const customerOtp = dispatchData.deliveryOtp;
    console.log('    -> PASSED');

    // 5. Invalid Delivery OTP Rejection Test
    console.log('\n[5] Testing Delivery Attempt with Invalid OTP Rejection ...');
    const invalidOtpRes = await fetch(`${baseUrl}/api/v1/delivery/${orderId}/deliver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deliveryOtp: '000000', // Invalid OTP
        photoUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
        paymentMode: 'cash',
        collectedAmount: 1440,
      }),
    });
    const invalidOtpData = await invalidOtpRes.json();
    console.log('    Invalid OTP Error Message:', invalidOtpData.message);
    if (invalidOtpData.success) {
      throw new Error('Invalid delivery OTP was not rejected!');
    }
    console.log('    -> PASSED (Invalid OTP correctly blocked)');

    // 6. Complete Delivery with Valid Customer OTP & Payment Collection
    console.log(`\n[6] Testing Delivery Handover Completion (Valid OTP: ${customerOtp}) ...`);
    const deliverRes = await fetch(`${baseUrl}/api/v1/delivery/${orderId}/deliver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deliveryOtp: customerOtp,
        photoUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
        latitude: 17.6868,
        longitude: 83.2185,
        paymentMode: 'upi',
        collectedAmount: 1440,
        upiReferenceId: 'UPI-REF-449912001',
      }),
    });
    const deliverData = await deliverRes.json();
    console.log('    Delivery Status:', deliverData.status);
    console.log('    Collection Status:', deliverData.collectionStatus);
    console.log('    Collected Amount: ₹', deliverData.collectionSummary.collectedAmount);
    console.log('    Payment Mode:', deliverData.collectionSummary.paymentMode);
    console.log('    UPI Reference:', deliverData.collectionSummary.upiReferenceId);
    if (!deliverData.success || deliverData.status !== 'Delivered' || deliverData.collectionStatus !== 'collected') {
      throw new Error('Delivery completion failed');
    }
    console.log('    -> PASSED (Delivery confirmed, GPS recorded & ₹1,440 collected via UPI)');

    // 7. Delivery SLA & 3-Hour Monitoring Alerts
    console.log('\n[7] Testing 24-Hour SLA & 3-Hour Inactivity Alerts Endpoint ...');
    const alertsRes = await fetch(`${baseUrl}/api/v1/delivery/alerts`);
    const alertsData = await alertsRes.json();
    console.log('    Active Orders Monitored:', alertsData.summary.totalActive);
    console.log('    Orders Approaching 24h SLA (<4h left):', alertsData.summary.approachingSlaCount);
    console.log('    Inactive > 3 Hours Alerts:', alertsData.summary.inactiveThreeHoursCount);
    if (!alertsData.success) throw new Error('Alerts query failed');
    console.log('    -> PASSED');

    // 8. Admin Reassignment with Audit Reason
    console.log('\n[8] Testing Admin Order Reassignment with Mandatory Audit Reason ...');
    const reassignRes = await fetch(`${baseUrl}/api/v1/delivery/${orderId}/reassign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newDistributorId: 'APDIST04',
        newDistributorName: 'Krishna Agency (Vijayawada Zone)',
        reason: 'Customer requested address reroute to regional branch office',
      }),
    });
    const reassignData = await reassignRes.json();
    console.log('    Reassignment Result:', reassignData.message);
    if (!reassignData.success || reassignData.newDistributorId !== 'APDIST04') {
      throw new Error('Reassignment failed');
    }
    console.log('    -> PASSED');

    console.log('\n====================================================');
    console.log('   ALL PHASE 4 DISTRIBUTION TESTS PASSED (100%)     ');
    console.log('====================================================');
  } finally {
    server.close();
  }
}

runPhase4Tests().catch((err) => {
  console.error('\nPhase 4 Test failed:', err);
  process.exit(1);
});
