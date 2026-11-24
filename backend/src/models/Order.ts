import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  customer: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productId: string;
  productName: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  gstAmount: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  deliveryAddress: {
    houseNumber: string;
    street: string;
    area: string;
    landmark?: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    recipientName: string;
    contactNumber: string;
    latitude?: number;
    longitude?: number;
  };
  assignedDistributor?: mongoose.Types.ObjectId;
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
  slaDueAt: Date;
  lastStatusUpdateAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    packSize: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    gstAmount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    deliveryAddress: {
      houseNumber: { type: String, required: true },
      street: { type: String, required: true },
      area: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true, index: true },
      recipientName: { type: String, required: true },
      contactNumber: { type: String, required: true },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    assignedDistributor: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    distributorName: { type: String },
    status: {
      type: String,
      enum: [
        'Order Placed',
        'Order Confirmed',
        'Distributor Assigned',
        'Accepted by Distributor',
        'Picked Up',
        'Out for Delivery',
        'Delivered',
        'Delivery Attempted',
        'Returned',
        'Cancelled',
      ],
      default: 'Order Placed',
      index: true,
    },
    paymentMode: { type: String, enum: ['cash', 'upi'], default: 'cash' },
    collectionStatus: {
      type: String,
      enum: ['pending', 'collected', 'reconciled', 'disputed'],
      default: 'pending',
    },
    upiReferenceId: { type: String },
    collectedAmount: { type: Number, default: 0 },
    deliveryOtp: { type: String },
    pickupProof: {
      photoUrl: String,
      latitude: Number,
      longitude: Number,
      timestamp: Date,
    },
    deliveryProof: {
      photoUrl: String,
      latitude: Number,
      longitude: Number,
      timestamp: Date,
    },
    slaDueAt: { type: Date, required: true },
    lastStatusUpdateAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
