import { Request, Response } from 'express';
import { sentNotificationsStore, sendNotification } from '../services/notificationService.js';

// Get notification audit log
export async function getNotificationHistory(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    total: sentNotificationsStore.length,
    notifications: sentNotificationsStore,
  });
}

// Trigger manual test notification (for admin / developer verification)
export async function triggerTestNotification(req: Request, res: Response): Promise<void> {
  const { event, recipientName, recipientPhone, recipientEmail, metadata } = req.body;

  const record = await sendNotification({
    event: event || 'ORDER_CONFIRMATION',
    channels: ['whatsapp', 'email', 'sms'],
    recipientName: recipientName || 'Customer',
    recipientPhone: recipientPhone || '+91 98480 12345',
    recipientEmail: recipientEmail || 'customer@example.com',
    metadata: metadata || {
      orderId: 'SF-2026-999999',
      quantity: 4,
      totalAmount: 720,
      pincode: '530016',
    },
  });

  res.status(201).json({
    success: true,
    message: `Test notification sent via WhatsApp and Email for event: ${record.event}`,
    notification: record,
  });
}
