import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  name: string;
  packSize: string;
  unitWeightGrams: number;
  unitPrice: number;
  description: string;
  images: string[];
  inStock: boolean;
  gstPercentage: number;
  hsnCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    packSize: { type: String, required: true },
    unitWeightGrams: { type: Number, required: true },
    unitPrice: { type: Number, required: true }, // Controlled strictly by backend: 180
    description: { type: String, required: true },
    images: [{ type: String }],
    inStock: { type: Boolean, default: true },
    gstPercentage: { type: Number, default: 0 }, // Confirmed 0 GST
    hsnCode: { type: String, default: '09024020' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
