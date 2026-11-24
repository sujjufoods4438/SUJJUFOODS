import { z } from 'zod';

export const PincodeSchema = z
  .string()
  .regex(/^[1-9][0-9]{5}$/, 'Invalid Indian 6-digit PIN code');

export const MobileSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number');

export const PasswordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one digit')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const CustomerRegisterSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    phone: MobileSchema,
    phoneOtp: z.string().length(6, 'OTP must be 6 digits'),
    email: z.string().email('Invalid email address'),
    emailOtp: z.string().length(6, 'Email OTP must be 6 digits'),
    password: PasswordSchema,
    confirmPassword: z.string(),
    sponsorCode: z.string().min(3, 'Valid sponsor or referral code is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const DistributorRegisterSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    phone: MobileSchema,
    phoneOtp: z.string().length(6, 'OTP must be 6 digits'),
    email: z.string().email('Invalid email address'),
    emailOtp: z.string().length(6, 'Email OTP must be 6 digits'),
    password: PasswordSchema,
    confirmPassword: z.string(),
    adminSponsorId: z.string().min(3, 'Admin-issued Sponsor ID is required'),
    servicePincodes: z.array(PincodeSchema).min(1, 'Provide at least one serviceable pincode'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const OrderCalculationSchema = z.object({
  quantity: z.number().int().positive('Quantity must be at least 1 piece'),
  unitPrice: z.number().default(180),
  deliveryCharge: z.number().default(0),
  discount: z.number().default(0),
});

export const ContactEnquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: MobileSchema,
  email: z.string().email('Valid email is required'),
  purpose: z.enum(['general', 'dealership', 'bulk_order', 'feedback', 'complaint']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
