import { mockOrdersStore } from '../controllers/orderController.js';
import { sendNotification } from '../services/notificationService.js';
import { OrderModel } from '../models/Order.js';
import mongoose from 'mongoose';

export interface OrderProgressJobResult {
  runAt: string;
  totalActiveOrdersScanned: number;
  notificationsDispatched: number;
  skippedOrders: number;
  failedNotifications: number;
  details: {
    orderId: string;
    customerPhone: string;
    status: string;
    remainingSlaHours: number;
    messageSent: boolean;
    reason?: string;
  }[];
}

export const jobRunHistory: OrderProgressJobResult[] = [];

/**
 * Executes 3-hour interval periodic order updates for active in-flight customer orders.
 * Eligible statuses: 'Order Placed', 'Assigned', 'Accepted', 'Picked Up', 'Out for Delivery'.
 * Ineligible statuses: 'Delivered', 'Cancelled', 'Quarantined'.
 */
export async function executeThreeHourOrderUpdates(forceIntervalCheck: boolean = false): Promise<OrderProgressJobResult> {
  const runAt = new Date().toISOString();
  const activeOrders: any[] = [];

  // 1. Gather from in-memory mock store
  for (const order of mockOrdersStore.values()) {
    activeOrders.push(order);
  }

  // 2. Gather from MongoDB if connected
  if (mongoose.connection.readyState === 1) {
    try {
      const dbOrders = await OrderModel.find({
        status: { $in: ['Order Placed', 'Assigned', 'Accepted', 'Picked Up', 'Out for Delivery'] },
      }).lean();
      for (const dbo of dbOrders) {
        if (!activeOrders.some((o) => o.orderId === dbo.orderId)) {
          activeOrders.push(dbo);
        }
      }
    } catch (err) {
      console.error('[3-Hour Update Job] Error querying MongoDB orders:', err);
    }
  }

  // Filter only in-flight statuses
  const inFlightStatuses = ['Order Placed', 'Assigned', 'Accepted', 'Picked Up', 'Out for Delivery'];
  const eligible = activeOrders.filter((o) => inFlightStatuses.includes(o.status));

  const result: OrderProgressJobResult = {
    runAt,
    totalActiveOrdersScanned: eligible.length,
    notificationsDispatched: 0,
    skippedOrders: 0,
    failedNotifications: 0,
    details: [],
  };

  const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
  const now = Date.now();

  for (const order of eligible) {
    const lastUpdateAt = order.lastProgressUpdateSentAt ? new Date(order.lastProgressUpdateSentAt).getTime() : 0;
    const timeSinceLastUpdate = now - lastUpdateAt;

    // Check 3-hour threshold unless forced for manual admin run
    if (!forceIntervalCheck && timeSinceLastUpdate < THREE_HOURS_MS && lastUpdateAt !== 0) {
      result.skippedOrders++;
      result.details.push({
        orderId: order.orderId,
        customerPhone: order.customerPhone || 'N/A',
        status: order.status,
        remainingSlaHours: calculateRemainingHours(order.slaTargetTimestamp),
        messageSent: false,
        reason: 'Less than 3 hours since last progress update',
      });
      continue;
    }

    const remainingHours = calculateRemainingHours(order.slaTargetTimestamp);

    try {
      // Dispatch update via WhatsApp / SMS
      await sendNotification({
        event: 'PICKUP_DISPATCH',
        channels: ['whatsapp', 'sms'],
        recipientName: order.customerName || 'Valued Customer',
        recipientPhone: order.customerPhone || '+91 98480 12345',
        metadata: {
          orderId: order.orderId,
          quantity: order.quantity || order.items?.[0]?.quantity || 1,
          status: order.status,
          distributorName: order.assignedDistributorName || 'Assigned Territory Partner',
          remainingHours,
        },
      });

      // Update order record
      order.lastProgressUpdateSentAt = new Date().toISOString();
      mockOrdersStore.set(order.orderId, order);

      result.notificationsDispatched++;
      result.details.push({
        orderId: order.orderId,
        customerPhone: order.customerPhone || 'N/A',
        status: order.status,
        remainingSlaHours: remainingHours,
        messageSent: true,
      });
    } catch (err: any) {
      result.failedNotifications++;
      result.details.push({
        orderId: order.orderId,
        customerPhone: order.customerPhone || 'N/A',
        status: order.status,
        remainingSlaHours: remainingHours,
        messageSent: false,
        reason: err?.message || 'Dispatch failure',
      });
    }
  }

  jobRunHistory.unshift(result);
  if (jobRunHistory.length > 50) jobRunHistory.pop();

  return result;
}

function calculateRemainingHours(targetIso?: string): number {
  if (!targetIso) return 24;
  const target = new Date(targetIso).getTime();
  const diff = target - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60));
}
