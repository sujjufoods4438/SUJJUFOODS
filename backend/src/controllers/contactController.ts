import { Request, Response } from 'express';
import { ContactEnquiryModel } from '../models/ContactEnquiry.js';

export async function submitContactEnquiry(req: Request, res: Response): Promise<void> {
  try {
    const { name, phone, email, purpose, message } = req.body;

    if (!name || !phone || !email || !message) {
      res.status(400).json({ success: false, message: 'All required fields must be provided' });
      return;
    }

    const enquiry = new ContactEnquiryModel({
      name,
      phone,
      email,
      purpose: purpose || 'general',
      message,
    });

    await enquiry.save().catch(() => null);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to SUJJU FOODS. Our management team will contact you shortly.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}
