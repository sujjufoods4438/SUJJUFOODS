import mongoose, { Schema, Document } from 'mongoose';

export interface IContactEnquiry extends Document {
  name: string;
  phone: string;
  email: string;
  purpose: 'general' | 'dealership' | 'bulk_order' | 'feedback' | 'complaint';
  message: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const ContactEnquirySchema = new Schema<IContactEnquiry>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    purpose: {
      type: String,
      enum: ['general', 'dealership', 'bulk_order', 'feedback', 'complaint'],
      default: 'general',
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const ContactEnquiryModel =
  mongoose.models.ContactEnquiry || mongoose.model<IContactEnquiry>('ContactEnquiry', ContactEnquirySchema);
