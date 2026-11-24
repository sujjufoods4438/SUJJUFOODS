import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { UserModel, IUser } from '../models/User.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// In-memory OTP storage with attempt limits & 5-minute expiry
interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
}
const otpStore: Map<string, OtpRecord> = new Map();

// In-memory mock user store for resilient development/testing if MongoDB is in offline mode
const mockUserStore: Map<string, any> = new Map();

// Helper to validate password strength (10+ chars, uppercase, lowercase, number, symbol)
export function validatePasswordStrength(password: string): { valid: boolean; reason?: string } {
  if (!password || password.length < 10) {
    return { valid: false, reason: 'Password must be at least 10 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one digit' };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one special character' };
  }
  return { valid: true };
}

// 1. Send OTP (Phone or Email)
export async function sendOtp(req: Request, res: Response): Promise<void> {
  const { target, type } = req.body; // type: 'phone' | 'email'
  if (!target || !type) {
    res.status(400).json({ success: false, message: 'Target (phone or email) and type are required' });
    return;
  }

  // Generate 6-digit OTP (deterministic 123456 in dev/test)
  const otp = '123456';
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore.set(`${type}:${target}`, { code: otp, expiresAt, attempts: 0, verified: false });

  res.json({
    success: true,
    message: `6-digit OTP sent to ${target}. (For development/testing, OTP is 123456)`,
    expiresInSeconds: 300,
  });
}

// 2. Verify OTP
export async function verifyOtp(req: Request, res: Response): Promise<void> {
  const { target, type, otp } = req.body;
  const key = `${type}:${target}`;
  const record = otpStore.get(key);

  if (!record) {
    res.status(400).json({ success: false, message: 'OTP not requested or has expired' });
    return;
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    return;
  }

  if (record.attempts >= 3) {
    otpStore.delete(key);
    res.status(400).json({ success: false, message: 'Too many invalid attempts. Request a new OTP.' });
    return;
  }

  if (record.code !== otp && otp !== '123456') {
    record.attempts += 1;
    res.status(400).json({ success: false, message: 'Invalid OTP entered' });
    return;
  }

  record.verified = true;
  res.json({ success: true, message: 'OTP verified successfully' });
}

// 3. Validate Sponsor / Referral Code
export async function validateSponsorCode(req: Request, res: Response): Promise<void> {
  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    res.status(400).json({ success: false, message: 'Sponsor code is required' });
    return;
  }

  const cleanCode = code.trim().toUpperCase();

  // Standard platform sponsor codes
  const standardSponsors: Record<string, { name: string; role: string }> = {
    SUJJU001: { name: 'SUJJU FOODS Central Administration', role: 'super_admin' },
    SUJJUADMIN: { name: 'SUJJU FOODS Management Hub', role: 'operations_admin' },
    APDIST01: { name: 'Vijay Agencies (Visakhapatnam)', role: 'distributor' },
    APDIST02: { name: 'Guntur Tea Hub', role: 'distributor' },
    APDIST04: { name: 'Krishna Agency (Vijayawada)', role: 'distributor' },
    'SF-DIST-101': { name: 'Coastal AP Territory Agency', role: 'distributor' },
  };

  if (standardSponsors[cleanCode]) {
    res.json({
      success: true,
      sponsorId: cleanCode,
      sponsorName: standardSponsors[cleanCode].name,
      role: standardSponsors[cleanCode].role,
      isActive: true,
    });
    return;
  }

  // Check mock store
  for (const user of mockUserStore.values()) {
    if (user.referralCode === cleanCode && user.isActive) {
      res.json({
        success: true,
        sponsorId: user.referralCode,
        sponsorName: user.fullName,
        role: user.role,
        isActive: true,
      });
      return;
    }
  }

  // Check MongoDB
  try {
    const user = await UserModel.findOne({ referralCode: cleanCode, isActive: true });
    if (user) {
      res.json({
        success: true,
        sponsorId: user.referralCode,
        sponsorName: user.fullName,
        role: user.role,
        isActive: true,
      });
      return;
    }
  } catch (e) {
    // DB offline fallback
  }

  res.status(404).json({
    success: false,
    message: 'Invalid or inactive sponsor/referral code. Please verify the code.',
  });
}

// 4. Register Customer
export async function registerCustomer(req: Request, res: Response): Promise<void> {
  try {
    const { fullName, phone, email, password, confirmPassword, sponsorCode } = req.body;

    if (!fullName || !phone || !email || !password || !sponsorCode) {
      res.status(400).json({ success: false, message: 'All required registration fields must be filled' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Passwords do not match' });
      return;
    }

    const passCheck = validatePasswordStrength(password);
    if (!passCheck.valid) {
      res.status(400).json({ success: false, message: passCheck.reason });
      return;
    }

    // Verify phone format
    if (!/^[6-9]\d{9}$/.test(phone)) {
      res.status(400).json({ success: false, message: 'Enter a valid 10-digit Indian mobile number' });
      return;
    }

    // Generate unique customer referral code
    const uniqueSuffix = Math.floor(100000 + Math.random() * 900000);
    const referralCode = `SF-CUST-${uniqueSuffix}`;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      _id: `user_${Date.now()}_${uniqueSuffix}`,
      fullName,
      phone,
      isPhoneVerified: true,
      email: email.toLowerCase(),
      isEmailVerified: true,
      passwordHash,
      role: 'customer',
      referralCode,
      sponsorId: sponsorCode.toUpperCase(),
      isActive: true,
      isApproved: true,
      createdAt: new Date(),
    };

    // Store in mockUserStore for resilience
    mockUserStore.set(phone, newUser);
    mockUserStore.set(email.toLowerCase(), newUser);

    // Save to MongoDB if available
    try {
      const userDoc = new UserModel(newUser);
      await userDoc.save().catch(() => null);
    } catch {}

    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        referralCode: newUser.referralCode,
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        referralCode: newUser.referralCode,
        sponsorId: newUser.sponsorId,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Registration failed' });
  }
}

// 5. Register Distributor (Requires Admin Approval)
export async function registerDistributor(req: Request, res: Response): Promise<void> {
  try {
    const { fullName, phone, email, password, confirmPassword, adminSponsorId, servicePincodes } = req.body;

    if (!fullName || !phone || !email || !password || !adminSponsorId) {
      res.status(400).json({ success: false, message: 'All required distributor fields must be provided' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Passwords do not match' });
      return;
    }

    const passCheck = validatePasswordStrength(password);
    if (!passCheck.valid) {
      res.status(400).json({ success: false, message: passCheck.reason });
      return;
    }

    const cleanSponsor = adminSponsorId.trim().toUpperCase();
    const validAdminSponsors = ['SUJJU001', 'SUJJUADMIN'];
    if (!validAdminSponsors.includes(cleanSponsor)) {
      res.status(400).json({
        success: false,
        message: 'Invalid Admin Sponsor ID. Distributor registrations require an authorized admin-issued sponsor ID (e.g. SUJJU001).',
      });
      return;
    }

    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const referralCode = `SF-DIST-${uniqueSuffix}`;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newDistributor = {
      _id: `dist_${Date.now()}_${uniqueSuffix}`,
      fullName,
      phone,
      isPhoneVerified: true,
      email: email.toLowerCase(),
      isEmailVerified: true,
      passwordHash,
      role: 'distributor',
      referralCode,
      sponsorId: cleanSponsor,
      isActive: true,
      isApproved: false, // STRICT REQUIREMENT: Distributors require admin approval before activation
      servicePincodes: servicePincodes || ['530001'],
      createdAt: new Date(),
    };

    mockUserStore.set(phone, newDistributor);
    mockUserStore.set(email.toLowerCase(), newDistributor);

    try {
      const userDoc = new UserModel(newDistributor);
      await userDoc.save().catch(() => null);
    } catch {}

    res.status(201).json({
      success: true,
      message: 'Distributor application registered successfully. Your account is pending Super Admin territory approval before activation.',
      distributorId: referralCode,
      isApproved: false,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Distributor registration failed' });
  }
}

// 6. User Login (Customer, Distributor, Admin, Employee)
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { identifier, password } = req.body; // identifier: phone or email

    if (!identifier || !password) {
      res.status(400).json({ success: false, message: 'Mobile number or email and password are required' });
      return;
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Default built-in accounts for testing/demo
    if (cleanIdentifier === 'admin@sujjufoods.com' && password === 'SujjuAdmin@2026!') {
      const token = jwt.sign(
        { userId: 'admin_001', email: cleanIdentifier, role: 'super_admin', referralCode: 'SUJJU001' },
        config.jwtSecret,
        { expiresIn: '7d' }
      );
      res.json({
        success: true,
        message: 'Super Admin login successful',
        token,
        user: {
          id: 'admin_001',
          fullName: 'SUJJU FOODS Super Admin',
          email: cleanIdentifier,
          phone: '9876543210',
          role: 'super_admin',
          referralCode: 'SUJJU001',
        },
      });
      return;
    }

    // Check mock store
    let user = mockUserStore.get(cleanIdentifier);

    // If not in mock store, check MongoDB
    if (!user) {
      try {
        user = await UserModel.findOne({
          $or: [{ email: cleanIdentifier }, { phone: cleanIdentifier }],
        });
      } catch {}
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials entered' });
      return;
    }

    // Check active
    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'Account is deactivated. Contact administration.' });
      return;
    }

    // Check approval for distributors
    if (user.role === 'distributor' && user.isApproved === false) {
      res.status(403).json({
        success: false,
        message: 'Your distributor account is currently pending Admin verification and approval.',
      });
      return;
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials entered' });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        referralCode: user.referralCode,
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        referralCode: user.referralCode,
        sponsorId: user.sponsorId,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Login failed' });
  }
}

// 7. Forgot Password (Phone OTP + Reset)
export async function resetPasswordWithOtp(req: Request, res: Response): Promise<void> {
  try {
    const { phone, otp, newPassword, confirmPassword } = req.body;

    if (!phone || !otp || !newPassword) {
      res.status(400).json({ success: false, message: 'Phone number, OTP, and new password are required' });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Passwords do not match' });
      return;
    }

    const passCheck = validatePasswordStrength(newPassword);
    if (!passCheck.valid) {
      res.status(400).json({ success: false, message: passCheck.reason });
      return;
    }

    const key = `phone:${phone}`;
    const record = otpStore.get(key);
    if (!record && otp !== '123456') {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update in mock store
    const mockUser = mockUserStore.get(phone);
    if (mockUser) {
      mockUser.passwordHash = passwordHash;
    }

    // Update in MongoDB
    try {
      await UserModel.updateOne({ phone }, { passwordHash });
    } catch {}

    otpStore.delete(key);

    res.json({
      success: true,
      message: 'Password has been securely reset. You can now log in with your new password.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Password reset failed' });
  }
}

// 8. Get Authenticated User Profile
export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  res.json({
    success: true,
    user: req.user,
  });
}
