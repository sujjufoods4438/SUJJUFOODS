import http from 'http';
import { app } from '../backend/dist/app.js';

async function runTests() {
  console.log('====================================================');
  console.log('   SUJJU FOODS - Phase 1 Verification Test Suite    ');
  console.log('====================================================');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[Test Server] In-memory server listening on port ${port}`);

  try {
    // 1. Health Endpoint
    console.log('\n[1] Testing GET /api/v1/health ...');
    const healthRes = await fetch(`${baseUrl}/api/v1/health`);
    const healthData = await healthRes.json();
    console.log('    Response:', JSON.stringify(healthData));
    if (healthData.status !== 'online') throw new Error('Health check failed');
    console.log('    -> PASSED');

    // 2. Product Catalogue Endpoint & Price Snapshot Rule
    console.log('\n[2] Testing GET /api/v1/products ...');
    const prodRes = await fetch(`${baseUrl}/api/v1/products`);
    const prodData = await prodRes.json();
    console.log('    Found products:', prodData.data.length);
    const product = prodData.data[0];
    console.log(`    Product: ${product.name} | Unit Price: ₹${product.unitPrice} | Pack: ${product.packSize}`);
    console.log(`    GST: ${product.gstPercentage}% (Approved 0% configuration)`);
    if (product.unitPrice !== 180) throw new Error('Product price must strictly be ₹180');
    if (product.gstPercentage !== 0) throw new Error('GST must strictly be 0%');
    console.log('    -> PASSED (Mandatory ₹180 & 0% GST verified)');

    // 3. Indian Pincode & Serviceability Lookup
    console.log('\n[3] Testing GET /api/v1/pincode/530001 (Visakhapatnam, AP) ...');
    const pinRes = await fetch(`${baseUrl}/api/v1/pincode/530001`);
    const pinData = await pinRes.json();
    console.log(`    Location: ${pinData.city}, ${pinData.district}, ${pinData.state}`);
    console.log(`    Serviceable: ${pinData.isServiceable} | Promise: ${pinData.deliveryPromise}`);
    if (!pinData.isServiceable || pinData.state !== 'Andhra Pradesh') throw new Error('Pincode serviceability check failed');
    console.log('    -> PASSED');

    // 4. Server-Side Order Calculation Engine (8 pieces * 180 = 1440, 0 GST)
    console.log('\n[4] Testing POST /api/v1/orders/calculate (Quantity: 8 pieces) ...');
    const calcRes = await fetch(`${baseUrl}/api/v1/orders/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: 8 }),
    });
    const calcData = await calcRes.json();
    console.log('    Calculation Result:');
    console.log(`    Quantity: ${calcData.data.quantity} pieces`);
    console.log(`    Unit Price: ₹${calcData.data.unitPrice}`);
    console.log(`    Subtotal: ₹${calcData.data.subtotal}`);
    console.log(`    GST Amount: ₹${calcData.data.gstAmount}`);
    console.log(`    Total Payable Amount: ₹${calcData.data.totalAmount}`);
    console.log(`    Verification Formula: ${calcData.data.ruleVerification}`);
    if (calcData.data.totalAmount !== 1440) {
      throw new Error(`Expected ₹1,440 for 8 pieces, got ₹${calcData.data.totalAmount}`);
    }
    console.log('    -> PASSED (8 × ₹180 = ₹1,440 with ₹0 GST verified)');

    // 5. Contact Enquiry Submission
    console.log('\n[5] Testing POST /api/v1/contact ...');
    const contactRes = await fetch(`${baseUrl}/api/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Venkata Rao',
        phone: '9876500123',
        email: 'venkat@example.com',
        purpose: 'dealership',
        message: 'Interested in territory dealership for Visakhapatnam zone.',
      }),
    });
    const contactData = await contactRes.json();
    console.log('    Response:', contactData.message);
    if (!contactData.success) throw new Error('Contact submission failed');
    console.log('    -> PASSED');

    console.log('\n====================================================');
    console.log('   ALL PHASE 1 ARCHITECTURAL TESTS PASSED (100%)    ');
    console.log('====================================================');
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error('\nTest failed with error:', err);
  process.exit(1);
});
