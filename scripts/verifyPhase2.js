import http from 'http';
import { app } from '../backend/dist/app.js';

async function runPhase2Tests() {
  console.log('====================================================');
  console.log('   SUJJU FOODS - Phase 2 Authentication Test Suite  ');
  console.log('====================================================');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[Test Server] In-memory server listening on port ${port}`);

  try {
    // 1. Send OTP & Verify OTP
    console.log('\n[1] Testing Mobile OTP Generation & Verification ...');
    const sendRes = await fetch(`${baseUrl}/api/v1/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: '9876543210', type: 'phone' }),
    });
    const sendData = await sendRes.json();
    console.log('    OTP Send Result:', sendData.message);
    if (!sendData.success) throw new Error('OTP send failed');

    const verifyRes = await fetch(`${baseUrl}/api/v1/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: '9876543210', type: 'phone', otp: '123456' }),
    });
    const verifyData = await verifyRes.json();
    console.log('    OTP Verify Result:', verifyData.message);
    if (!verifyData.success) throw new Error('OTP verification failed');
    console.log('    -> PASSED');

    // 2. Weak Password Rejection
    console.log('\n[2] Testing Weak Password Rejection ...');
    const weakRes = await fetch(`${baseUrl}/api/v1/auth/register/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test User',
        phone: '9876512345',
        email: 'test@example.com',
        password: 'weak',
        confirmPassword: 'weak',
        sponsorCode: 'SUJJU001',
      }),
    });
    const weakData = await weakRes.json();
    console.log('    Weak Password Error:', weakData.message);
    if (weakData.success) throw new Error('Weak password was not rejected!');
    console.log('    -> PASSED (Password complexity enforced)');

    // 3. Sponsor Validation
    console.log('\n[3] Testing Sponsor Validation (SUJJU001) ...');
    const sponsorRes = await fetch(`${baseUrl}/api/v1/auth/sponsor/validate?code=SUJJU001`);
    const sponsorData = await sponsorRes.json();
    console.log(`    Sponsor: ${sponsorData.sponsorName} | ID: ${sponsorData.sponsorId} | Role: ${sponsorData.role}`);
    if (!sponsorData.success || sponsorData.sponsorId !== 'SUJJU001') {
      throw new Error('Sponsor validation failed');
    }
    console.log('    -> PASSED');

    // 4. Customer Registration with Sponsor Attribution
    console.log('\n[4] Testing Customer Registration (Compliant Password & Sponsor) ...');
    const custPhone = `987${Math.floor(1000000 + Math.random() * 9000000)}`;
    const custEmail = `customer_${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/api/v1/auth/register/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Anand Varma',
        phone: custPhone,
        email: custEmail,
        password: 'SecurePassword@2026',
        confirmPassword: 'SecurePassword@2026',
        sponsorCode: 'SUJJU001',
      }),
    });
    const regData = await regRes.json();
    console.log('    Registration Result:', regData.message);
    console.log('    Assigned Referral Code:', regData.user.referralCode);
    console.log('    Attributed Sponsor ID:', regData.user.sponsorId);
    if (!regData.success || !regData.user.referralCode.startsWith('SF-CUST-')) {
      throw new Error('Customer registration failed or did not generate SF-CUST- code');
    }
    console.log('    -> PASSED');

    // 5. Distributor Registration & Mandatory Admin Approval Check
    console.log('\n[5] Testing Distributor Registration (Requires Admin Approval) ...');
    const distPhone = `988${Math.floor(1000000 + Math.random() * 9000000)}`;
    const distEmail = `distributor_${Date.now()}@example.com`;
    const distRegRes = await fetch(`${baseUrl}/api/v1/auth/register/distributor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Krishna Tea Traders',
        phone: distPhone,
        email: distEmail,
        password: 'Distributor@2026!',
        confirmPassword: 'Distributor@2026!',
        adminSponsorId: 'SUJJU001',
        servicePincodes: ['530001', '530016'],
      }),
    });
    const distRegData = await distRegRes.json();
    console.log('    Distributor Registration Result:', distRegData.message);
    console.log('    Distributor ID:', distRegData.distributorId);
    console.log('    Approval Status:', distRegData.isApproved ? 'Approved' : 'Pending Admin Approval');
    if (distRegData.isApproved !== false) {
      throw new Error('Distributor must require admin approval before activation!');
    }
    console.log('    -> PASSED');

    // 6. Distributor Login Blocked Before Approval
    console.log('\n[6] Testing Distributor Login Prevention Prior to Approval ...');
    const distLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: distPhone,
        password: 'Distributor@2026!',
      }),
    });
    const distLoginData = await distLoginRes.json();
    console.log('    Login Block Response:', distLoginData.message);
    if (distLoginData.success) {
      throw new Error('Unapproved distributor should not be permitted to log in!');
    }
    console.log('    -> PASSED (Pending distributor blocked as expected)');

    // 7. Customer Login & JWT Generation
    console.log('\n[7] Testing Customer Login with Password Verification ...');
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: custPhone,
        password: 'SecurePassword@2026',
      }),
    });
    const loginData = await loginRes.json();
    console.log('    Login Result:', loginData.message);
    console.log('    Received JWT Token (first 25 chars):', loginData.token.substring(0, 25) + '...');
    if (!loginData.success || !loginData.token) {
      throw new Error('Customer login failed');
    }
    const customerToken = loginData.token;
    console.log('    -> PASSED');

    // 8. Protected Profile Route & RBAC Access Guard
    console.log('\n[8] Testing Protected Route /api/v1/auth/profile ...');
    const profileRes = await fetch(`${baseUrl}/api/v1/auth/profile`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const profileData = await profileRes.json();
    console.log(`    Authenticated as: ${profileData.user.email} (Role: ${profileData.user.role})`);
    if (!profileData.success || profileData.user.role !== 'customer') {
      throw new Error('Profile access failed');
    }
    console.log('    -> PASSED');

    // 9. RBAC Restriction Check (Customer trying to access Admin Overview)
    console.log('\n[9] Testing RBAC Guard: Customer Attempting Admin Access ...');
    const adminCheckRes = await fetch(`${baseUrl}/api/v1/admin/overview`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const adminCheckData = await adminCheckRes.json();
    console.log('    Access Response:', adminCheckData.message);
    if (adminCheckRes.status !== 403) {
      throw new Error('RBAC violation: Customer was not denied access to Admin endpoint!');
    }
    console.log('    -> PASSED (403 Forbidden correctly returned for unauthorized role)');

    // 10. Super Admin Login
    console.log('\n[10] Testing Super Admin Login (admin@sujjufoods.com) ...');
    const adminLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'admin@sujjufoods.com',
        password: 'SujjuAdmin@2026!',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    console.log('    Admin Login Result:', adminLoginData.message);
    console.log('    Role Claim:', adminLoginData.user.role);
    if (!adminLoginData.success || adminLoginData.user.role !== 'super_admin') {
      throw new Error('Super Admin login failed');
    }

    // Admin accessing admin overview
    const adminOverviewRes = await fetch(`${baseUrl}/api/v1/admin/overview`, {
      headers: { Authorization: `Bearer ${adminLoginData.token}` },
    });
    const adminOverviewData = await adminOverviewRes.json();
    console.log('    Admin Access Check:', adminOverviewData.message);
    if (!adminOverviewData.success) throw new Error('Admin could not access admin overview');
    console.log('    -> PASSED (Super Admin RBAC access authorized)');

    // 11. Password Reset with OTP
    console.log('\n[11] Testing Password Reset with OTP ...');
    const resetRes = await fetch(`${baseUrl}/api/v1/auth/password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: custPhone,
        otp: '123456',
        newPassword: 'BrandNewPassword@2026',
        confirmPassword: 'BrandNewPassword@2026',
      }),
    });
    const resetData = await resetRes.json();
    console.log('    Password Reset Result:', resetData.message);
    if (!resetData.success) throw new Error('Password reset failed');

    // Test login with new password
    const newLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: custPhone,
        password: 'BrandNewPassword@2026',
      }),
    });
    const newLoginData = await newLoginRes.json();
    if (!newLoginData.success) throw new Error('Login with new password failed');
    console.log('    -> PASSED (Password reset and login verified)');

    console.log('\n====================================================');
    console.log('   ALL PHASE 2 AUTHENTICATION TESTS PASSED (100%)   ');
    console.log('====================================================');
  } finally {
    server.close();
  }
}

runPhase2Tests().catch((err) => {
  console.error('\nPhase 2 Test failed:', err);
  process.exit(1);
});
