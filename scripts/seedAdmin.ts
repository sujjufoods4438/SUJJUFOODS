import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { UserModel } from '../backend/src/models/User.js';
import { config } from '../backend/src/config/env.js';

async function seedAdmin() {
  await mongoose.connect(config.mongoUri);
  console.log('Connected to MongoDB for admin seeding...');

  const existingAdmin = await UserModel.findOne({ role: 'super_admin' });
  if (existingAdmin) {
    console.log(`Super Admin already exists: ${existingAdmin.email}`);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('SujjuAdmin@2026!', salt);

  const admin = new UserModel({
    fullName: 'SUJJU FOODS Super Admin',
    phone: '9876543210',
    isPhoneVerified: true,
    email: 'admin@sujjufoods.com',
    isEmailVerified: true,
    passwordHash,
    role: 'super_admin',
    referralCode: 'SUJJU001',
    isActive: true,
    isApproved: true,
  });

  await admin.save();
  console.log('Super Admin successfully seeded: admin@sujjufoods.com (Referral Code: SUJJU001)');
  process.exit(0);
}

seedAdmin().catch(console.error);
