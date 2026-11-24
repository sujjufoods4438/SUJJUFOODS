import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  phone: string;
  isPhoneVerified: boolean;
  email: string;
  isEmailVerified: boolean;
  passwordHash: string;
  role: 'super_admin' | 'operations_admin' | 'finance_admin' | 'content_manager' | 'customer' | 'distributor' | 'employee';
  referralCode: string;
  sponsorId?: string;
  isActive: boolean;
  isApproved: boolean; // For distributor & employee
  servicePincodes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, index: true },
    isPhoneVerified: { type: Boolean, default: false },
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    isEmailVerified: { type: Boolean, default: false },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['super_admin', 'operations_admin', 'finance_admin', 'content_manager', 'customer', 'distributor', 'employee'],
      default: 'customer',
      index: true,
    },
    referralCode: { type: String, required: true, unique: true, index: true },
    sponsorId: { type: String, index: true },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: function(this: IUser) { return this.role === 'customer'; } },
    servicePincodes: [{ type: String }],
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
