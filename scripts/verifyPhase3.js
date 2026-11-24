import http from 'http';
import { app } from '../backend/dist/app.js';

async function runPhase3Tests() {
  console.log('====================================================');
  console.log('   SUJJU FOODS - Phase 3 Ordering & Invoicing Tests ');
  console.log('====================================================');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[Test Server] In-memory server listening on port ${port}`);

  try {
    // 1. Server-side Price Calculation Engine (Mandatory ₹180/pack & 0% GST)
    console.log('\n[1] Testing Pricing Engine (8 pieces × ₹180) ...');
    const calcRes = await fetch(`${baseUrl}/api/v1/orders/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: 8 }),
    });
    const calcData = await calcRes.json();
    console.log(`    Unit Price: ₹${calcData.data.unitPrice}`);
    console.log(`    Subtotal: ₹${calcData.data.subtotal}`);
    console.log(`    GST Amount: ₹${calcData.data.gstAmount}`);
    console.log(`    Total Amount: ₹${calcData.data.totalAmount}`);
    if (calcData.data.totalAmount !== 1440 || calcData.data.gstAmount !== 0) {
      throw new Error(`Pricing violation: expected ₹1,440 with ₹0 GST, got ₹${calcData.data.totalAmount}`);
    }
    console.log('    -> PASSED (8 × ₹180 = ₹1,440.00 with 0% GST verified)');

    // 2. Invalid Quantity Rejection
    console.log('\n[2] Testing Zero/Negative Quantity Rejection ...');
    const invalidQtyRes = await fetch(`${baseUrl}/api/v1/orders/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: 0 }),
    });
    const invalidQtyData = await invalidQtyRes.json();
    console.log('    Zero Quantity Error:', invalidQtyData.message);
    if (invalidQtyData.success) throw new Error('Zero quantity was not rejected!');
    console.log('    -> PASSED');

    // 3. Concurrency-Safe Order Submission & Automatic Distributor Assignment
    console.log('\n[3] Testing Order Submission & Pincode Distributor Routing ...');
    const orderPayload = {
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
    };

    const orderRes = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const orderData = await orderRes.json();
    console.log('    Order Response:', orderData.message);
    console.log('    Generated Order ID:', orderData.order.orderId);
    console.log('    Generated Invoice No:', orderData.invoiceNumber);
    console.log('    Assigned Territory Partner:', orderData.order.distributorName);
    console.log('    24-Hour SLA Due At:', orderData.order.slaDueAt);

    if (!orderData.success || !orderData.order.orderId.startsWith('SF-2026-')) {
      throw new Error('Order submission failed or invalid orderId format');
    }
    if (orderData.order.totalAmount !== 1440) {
      throw new Error(`Order amount mismatch: expected 1440, got ${orderData.order.totalAmount}`);
    }
    const createdOrderId = orderData.order.orderId;
    console.log('    -> PASSED');

    // 4. Retrieve Order Tracking & Timeline
    console.log(`\n[4] Testing Order Tracking Timeline for ${createdOrderId} ...`);
    const trackRes = await fetch(`${baseUrl}/api/v1/orders/${createdOrderId}`);
    const trackData = await trackRes.json();
    console.log('    Tracking Status:', trackData.order.status);
    console.log('    SLA Delivery Commitment:', trackData.slaTarget);
    console.log('    Timeline Events Count:', trackData.trackingTimeline.length);
    if (!trackData.success || trackData.trackingTimeline.length === 0) {
      throw new Error('Tracking timeline retrieval failed');
    }
    console.log('    -> PASSED');

    // 5. Customer Order History API
    console.log('\n[5] Testing Customer Order History Retrieval ...');
    const myOrdersRes = await fetch(`${baseUrl}/api/v1/orders/customer/my-orders`);
    const myOrdersData = await myOrdersRes.json();
    console.log('    Retrieved Orders Count:', myOrdersData.count);
    const found = myOrdersData.orders.some((o) => o.orderId === createdOrderId);
    if (!found) throw new Error('Submitted order not found in customer order list');
    console.log('    -> PASSED');

    // 6. A4 PDF Tax Invoice Generation & Streaming
    console.log(`\n[6] Testing A4 PDF Invoice Generation for ${createdOrderId} ...`);
    const invRes = await fetch(`${baseUrl}/api/v1/orders/${createdOrderId}/invoice`);
    const contentType = invRes.headers.get('content-type');
    const buffer = await invRes.arrayBuffer();
    const pdfHeader = Buffer.from(buffer.slice(0, 5)).toString();

    console.log('    HTTP Status:', invRes.status);
    console.log('    Content-Type:', contentType);
    console.log('    PDF Buffer Size:', buffer.byteLength, 'bytes');
    console.log('    PDF File Signature:', pdfHeader);

    if (invRes.status !== 200 || !contentType?.includes('application/pdf') || pdfHeader !== '%PDF-') {
      throw new Error('Failed to generate valid A4 PDF stream');
    }
    console.log('    -> PASSED (Valid A4 PDF Tax Invoice generated and streamed)');

    console.log('\n====================================================');
    console.log('   ALL PHASE 3 ORDERING & INVOICE TESTS PASSED!     ');
    console.log('====================================================');
  } finally {
    server.close();
  }
}

runPhase3Tests().catch((err) => {
  console.error('\nPhase 3 Test failed:', err);
  process.exit(1);
});
