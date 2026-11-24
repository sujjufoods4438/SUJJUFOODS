# SUJJU FOODS – Database Schema Specification

This document details the MongoDB schemas and relationships implemented for the SUJJU FOODS enterprise platform.

## 1. User & Identity Management (`users` collection)
Stores all actors across the platform (Super Admin, Operations Admin, Finance Admin, Content Manager, Customer, Distributor, Employee).

```typescript
interface IUser {
  _id: ObjectId;
  fullName: string;
  phone: string; // Unique index
  isPhoneVerified: boolean;
  email: string; // Unique index
  isEmailVerified: boolean;
  passwordHash: string; // Argon2id or bcrypt
  role: 'super_admin' | 'operations_admin' | 'finance_admin' | 'content_manager' | 'customer' | 'distributor' | 'employee';
  referralCode: string; // Unique index
  sponsorId?: string; // Links to parent sponsor / referrer
  isActive: boolean;
  isApproved: boolean; // Required for distributors and employees
  servicePincodes?: string[]; // Pincodes assigned to distributor
  createdAt: Date;
  updatedAt: Date;
}
```

## 2. Product Master (`products` collection)
Central product catalogue managed by administrators.

```typescript
interface IProduct {
  _id: ObjectId;
  sku: string; // Unique index (e.g. SF-TEA-250G)
  name: string; // 'SUJJU FOODS Tea Powder'
  packSize: string; // '250 grams'
  unitWeightGrams: number; // 250
  unitPrice: number; // Strictly ₹180
  description: string;
  images: string[];
  inStock: boolean;
  gstPercentage: number; // 0% under current approved configuration
  hsnCode: string; // '09024020'
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 3. Orders & Deliveries (`orders` collection)
Stores transactional orders, pricing snapshots, delivery assignments, and SLA metadata.

```typescript
interface IOrder {
  _id: ObjectId;
  orderId: string; // Unique index (e.g. SF-2026-894120)
  customer: ObjectId; // Ref: User
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productId: string;
  productName: string;
  packSize: string;
  quantity: number; // Positive integer
  unitPrice: number; // ₹180 snapshot
  subtotal: number; // quantity * 180
  gstAmount: number; // ₹0.00
  deliveryCharge: number;
  discount: number;
  totalAmount: number; // subtotal + gstAmount + deliveryCharge - discount
  deliveryAddress: {
    houseNumber: string;
    street: string;
    area: string;
    landmark?: string;
    city: string;
    district: string;
    state: string;
    pincode: string; // Index
    recipientName: string;
    contactNumber: string;
    latitude?: number;
    longitude?: number;
  };
  assignedDistributor?: ObjectId; // Ref: User
  distributorName?: string;
  status:
    | 'Order Placed'
    | 'Order Confirmed'
    | 'Distributor Assigned'
    | 'Accepted by Distributor'
    | 'Picked Up'
    | 'Out for Delivery'
    | 'Delivered'
    | 'Delivery Attempted'
    | 'Returned'
    | 'Cancelled';
  paymentMode: 'cash' | 'upi';
  collectionStatus: 'pending' | 'collected' | 'reconciled' | 'disputed';
  upiReferenceId?: string;
  collectedAmount?: number;
  deliveryOtp?: string;
  pickupProof?: {
    photoUrl: string;
    latitude?: number;
    longitude?: number;
    timestamp: Date;
  };
  deliveryProof?: {
    photoUrl: string;
    latitude?: number;
    longitude?: number;
    timestamp: Date;
  };
  slaDueAt: Date; // 24 hours from confirmation
  lastStatusUpdateAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 4. Contact Enquiries (`contact_enquiries` collection)
Stores incoming general, bulk order, and dealership requests.

```typescript
interface IContactEnquiry {
  _id: ObjectId;
  name: string;
  phone: string;
  email: string;
  purpose: 'general' | 'dealership' | 'bulk_order' | 'feedback' | 'complaint';
  message: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}
```
