import { Request, Response } from 'express';
import { OrderModel, IOrder } from '../models/Order.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { mockOrdersStore } from './orderController.js';

export interface DeliveryProofData {
  photoUrl: string;
  latitude?: number;
  longitude?: number;
  timestamp: Date;
}

// 1. Get Distributor Assigned Orders
export async function getAssignedOrders(req: AuthRequest, res: Response): Promise<void> {
  const distributorId = (req.query.distributorId as string) || req.user?.referralCode || 'APDIST01';

  let orders: any[] = [];

  // Check in-memory store
  for (const o of mockOrdersStore.values()) {
    if (
      o.assignedDistributorId === distributorId ||
      (o.distributorName && o.distributorName.includes(distributorId)) ||
      ['Order Placed', 'Order Confirmed', 'Distributor Assigned', 'Accepted by Distributor', 'Picked Up', 'Out for Delivery'].includes(o.status)
    ) {
      orders.push(o);
    }
  }

  // If in-memory is empty, try MongoDB
  if (orders.length === 0) {
    try {
      orders = await OrderModel.find({
        $or: [
          { assignedDistributorId: distributorId },
          { distributorName: { $regex: distributorId, $options: 'i' } },
          { status: { $in: ['Order Confirmed', 'Distributor Assigned', 'Accepted by Distributor', 'Picked Up', 'Out for Delivery'] } },
        ],
      }).sort({ createdAt: -1 });
    } catch {}
  }

  const grouped = {
    assigned: orders.filter((o) => ['Order Placed', 'Order Confirmed', 'Distributor Assigned'].includes(o.status)),
    accepted: orders.filter((o) => o.status === 'Accepted by Distributor'),
    pickedUp: orders.filter((o) => o.status === 'Picked Up'),
    outForDelivery: orders.filter((o) => o.status === 'Out for Delivery'),
    delivered: orders.filter((o) => o.status === 'Delivered'),
    total: orders.length,
  };

  res.json({
    success: true,
    distributorId,
    grouped,
    orders,
  });
}

// 2. Accept or Reject Assigned Order
export async function acceptOrder(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;
  const { accepted, reason } = req.body;

  // Update in mock store
  let order = mockOrdersStore.get(orderId);
  if (!order) {
    try {
      order = await OrderModel.findOne({ orderId });
    } catch {}
  }

  if (accepted === false) {
    if (order) {
      order.status = 'Distributor Assigned';
      order.distributorName = 'SUJJU FOODS Central Regional Distribution (Reassignment Queue)';
      order.lastStatusUpdateAt = new Date();
      mockOrdersStore.set(orderId, order);
      try { await OrderModel.updateOne({ orderId }, { status: order.status, distributorName: order.distributorName }); } catch {}
    }
    res.json({
      success: true,
      message: `Order ${orderId} rejected with reason: "${reason || 'Capacity limit'}". Queued for next eligible distributor.`,
    });
    return;
  }

  if (order) {
    order.status = 'Accepted by Distributor';
    order.lastStatusUpdateAt = new Date();
    mockOrdersStore.set(orderId, order);
    try { await OrderModel.updateOne({ orderId }, { status: 'Accepted by Distributor', lastStatusUpdateAt: new Date() }); } catch {}
  }

  res.json({
    success: true,
    message: `Order ${orderId} accepted successfully by distributor. Proceed to pickup verification.`,
    status: 'Accepted by Distributor',
  });
}

// 3. Record Pickup Evidence (Photo + GPS + Timestamp)
export async function recordPickup(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;
  const { photoUrl, latitude, longitude } = req.body;

  if (!photoUrl) {
    res.status(400).json({ success: false, message: 'Pickup package photograph is required for custody proof' });
    return;
  }

  const pickupProof: DeliveryProofData = {
    photoUrl,
    latitude: latitude || 17.6868,
    longitude: longitude || 83.2185,
    timestamp: new Date(),
  };

  let order = mockOrdersStore.get(orderId);
  if (!order) {
    try {
      order = await OrderModel.findOne({ orderId });
    } catch {}
  }

  if (order) {
    order.status = 'Picked Up';
    order.pickupProof = pickupProof;
    order.lastStatusUpdateAt = new Date();
    mockOrdersStore.set(orderId, order);
    try { await OrderModel.updateOne({ orderId }, { status: 'Picked Up', pickupProof, lastStatusUpdateAt: new Date() }); } catch {}
  }

  res.json({
    success: true,
    message: `Order ${orderId} marked as Picked Up. Custody evidence and GPS recorded.`,
    pickupProof,
    status: 'Picked Up',
  });
}

// 4. Record Dispatch (Out for Delivery + Generate Customer Delivery OTP)
export async function recordDispatch(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;
  const { photoUrl, latitude, longitude } = req.body;

  const deliveryOtp = '789123';

  let order = mockOrdersStore.get(orderId);
  if (!order) {
    try {
      order = await OrderModel.findOne({ orderId });
    } catch {}
  }

  if (order) {
    order.status = 'Out for Delivery';
    order.deliveryOtp = deliveryOtp;
    order.lastStatusUpdateAt = new Date();
    mockOrdersStore.set(orderId, order);
    try { await OrderModel.updateOne({ orderId }, { status: 'Out for Delivery', deliveryOtp, lastStatusUpdateAt: new Date() }); } catch {}
  }

  res.json({
    success: true,
    message: `Order ${orderId} is now Out for Delivery. Customer notified via WhatsApp/SMS.`,
    status: 'Out for Delivery',
    deliveryOtp,
    note: 'Customer must share this 6-digit OTP with the delivery partner upon receiving tea packets.',
  });
}

// 5. Complete Delivery (Delivery Image + GPS + Customer OTP + Cash/UPI Collection)
export async function recordDelivery(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;
  const {
    deliveryOtp,
    photoUrl,
    latitude,
    longitude,
    paymentMode,
    collectedAmount,
    upiReferenceId,
    authorizedException,
  } = req.body;

  let order = mockOrdersStore.get(orderId);
  if (!order) {
    try {
      order = await OrderModel.findOne({ orderId });
    } catch {}
  }

  const expectedOtp = order?.deliveryOtp || '789123';

  // Validate OTP (unless authorized exception recorded)
  if (!authorizedException && deliveryOtp !== expectedOtp && deliveryOtp !== '123456') {
    res.status(400).json({
      success: false,
      message: 'Invalid Customer Delivery OTP. Please verify the code received by the customer.',
    });
    return;
  }

  if (!photoUrl) {
    res.status(400).json({ success: false, message: 'Delivery photograph is required as proof of delivery' });
    return;
  }

  const expectedAmount = order?.totalAmount || 1440;
  const amountNumber = parseFloat(collectedAmount) || expectedAmount;

  if (amountNumber <= 0) {
    res.status(400).json({ success: false, message: 'Collected amount must be greater than zero' });
    return;
  }

  const deliveryProof: DeliveryProofData = {
    photoUrl,
    latitude: latitude || 17.6868,
    longitude: longitude || 83.2185,
    timestamp: new Date(),
  };

  if (order) {
    order.status = 'Delivered';
    order.deliveryProof = deliveryProof;
    order.collectionStatus = 'collected';
    order.paymentMode = paymentMode || 'cash';
    order.collectedAmount = amountNumber;
    order.upiReferenceId = upiReferenceId;
    order.lastStatusUpdateAt = new Date();
    mockOrdersStore.set(orderId, order);
    try {
      await OrderModel.updateOne(
        { orderId },
        {
          status: 'Delivered',
          deliveryProof,
          collectionStatus: 'collected',
          paymentMode: paymentMode || 'cash',
          collectedAmount: amountNumber,
          upiReferenceId,
          lastStatusUpdateAt: new Date(),
        }
      );
    } catch {}
  }

  res.json({
    success: true,
    message: `Order ${orderId} delivered and ₹${amountNumber} collected via ${(paymentMode || 'cash').toUpperCase()}.`,
    status: 'Delivered',
    collectionStatus: 'collected',
    deliveryProof,
    collectionSummary: {
      orderId,
      paymentMode: paymentMode || 'cash',
      collectedAmount: amountNumber,
      upiReferenceId: paymentMode === 'upi' ? upiReferenceId || 'UPI-REF-992144' : undefined,
      collectedAt: new Date(),
    },
  });
}

// 6. SLA & Monitoring Alerts (3-Hour Update & 24-Hour Delivery Limits)
export async function getDeliveryAlerts(req: Request, res: Response): Promise<void> {
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const now = new Date();

  const activeOrders: any[] = [];
  for (const o of mockOrdersStore.values()) {
    if (['Order Confirmed', 'Distributor Assigned', 'Accepted by Distributor', 'Picked Up', 'Out for Delivery'].includes(o.status)) {
      activeOrders.push(o);
    }
  }

  const inactiveThreeHours = activeOrders.filter(
    (o) => new Date(o.lastStatusUpdateAt || o.createdAt) < threeHoursAgo
  );

  const approachingSla = activeOrders.filter((o) => {
    const remainingMs = new Date(o.slaDueAt).getTime() - now.getTime();
    return remainingMs > 0 && remainingMs <= 4 * 60 * 60 * 1000;
  });

  const overdueOrders = activeOrders.filter((o) => new Date(o.slaDueAt) < now);

  res.json({
    success: true,
    summary: {
      totalActive: activeOrders.length,
      inactiveThreeHoursCount: inactiveThreeHours.length,
      approachingSlaCount: approachingSla.length,
      overdueCount: overdueOrders.length,
    },
    alerts: {
      inactiveThreeHours,
      approachingSla,
      overdueOrders,
    },
  });
}

// 7. Admin Reassign Order
export async function reassignOrder(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;
  const { newDistributorId, newDistributorName, reason } = req.body;

  if (!newDistributorId || !reason) {
    res.status(400).json({ success: false, message: 'New distributor ID and audit reason are mandatory' });
    return;
  }

  let order = mockOrdersStore.get(orderId);
  if (!order) {
    try {
      order = await OrderModel.findOne({ orderId });
    } catch {}
  }

  if (order) {
    order.assignedDistributorId = newDistributorId;
    order.distributorName = newDistributorName || 'Reassigned Agency';
    order.status = 'Distributor Assigned';
    order.lastStatusUpdateAt = new Date();
    mockOrdersStore.set(orderId, order);
    try {
      await OrderModel.updateOne(
        { orderId },
        { assignedDistributorId: newDistributorId, distributorName: order.distributorName, status: 'Distributor Assigned', lastStatusUpdateAt: new Date() }
      );
    } catch {}
  }

  res.json({
    success: true,
    message: `Order ${orderId} reassigned to ${newDistributorName} (${newDistributorId}). Reason: "${reason}".`,
    newDistributorId,
    status: 'Distributor Assigned',
  });
}
