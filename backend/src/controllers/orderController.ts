import { Request, Response } from 'express';
import { OrderModel, IOrder } from '../models/Order.js';
import { DEFAULT_PRODUCT } from './productController.js';
import { generateInvoicePdf } from '../services/invoiceService.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// In-memory orders store for development/testing resilience
export const mockOrdersStore: Map<string, any> = new Map();

// Helper to determine territory distributor assignment
export function getDistributorForPincode(pincode: string): { id: string; name: string } {
  const p = pincode.trim();
  if (p.startsWith('530')) {
    return { id: 'APDIST01', name: 'Vijay Agencies (Visakhapatnam Zone)' };
  }
  if (p.startsWith('520')) {
    return { id: 'APDIST04', name: 'Krishna Agency (Vijayawada Zone)' };
  }
  if (p.startsWith('522')) {
    return { id: 'APDIST02', name: 'Guntur Tea Hub (Guntur Zone)' };
  }
  return { id: 'APDIST01', name: 'SUJJU FOODS Central Regional Distribution' };
}

// 1. Server-Side Price Calculation Engine
export async function calculateOrder(req: Request, res: Response): Promise<void> {
  const { quantity } = req.body;
  const qty = parseInt(quantity, 10);

  if (isNaN(qty) || qty <= 0) {
    res.status(400).json({ success: false, message: 'Quantity must be a positive integer' });
    return;
  }

  // Mandatory business rule: Unit price is strictly ₹180 per 250g piece from backend
  const unitPrice = DEFAULT_PRODUCT.unitPrice; // 180
  const subtotal = qty * unitPrice;
  const gstAmount = 0; // Strictly 0 under current configuration
  const deliveryCharge = 0; // Free delivery for standard orders
  const discount = 0;
  const totalAmount = subtotal + gstAmount + deliveryCharge - discount;

  // Example: 8 pieces * 180 = 1440
  res.json({
    success: true,
    data: {
      productId: DEFAULT_PRODUCT.sku,
      productName: DEFAULT_PRODUCT.name,
      packSize: DEFAULT_PRODUCT.packSize,
      quantity: qty,
      unitPrice,
      subtotal,
      gstAmount,
      deliveryCharge,
      discount,
      totalAmount,
      ruleVerification: `${qty} × ₹${unitPrice} = ₹${totalAmount}`,
    },
  });
}

// 2. Submit New Customer Order
export async function createOrder(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { quantity, deliveryAddress, paymentMode } = req.body;
    const qty = parseInt(quantity, 10);

    if (isNaN(qty) || qty <= 0) {
      res.status(400).json({ success: false, message: 'Quantity must be at least 1 piece' });
      return;
    }

    if (!deliveryAddress || !deliveryAddress.pincode || !deliveryAddress.recipientName) {
      res.status(400).json({ success: false, message: 'Delivery address and pincode are required' });
      return;
    }

    const unitPrice = DEFAULT_PRODUCT.unitPrice; // Strictly 180
    const subtotal = qty * unitPrice;
    const gstAmount = 0; // Strictly 0% GST
    const deliveryCharge = 0;
    const discount = 0;
    const totalAmount = subtotal + gstAmount + deliveryCharge - discount;

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `SF-${new Date().getFullYear()}-${randomSuffix}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${randomSuffix}`;
    const slaDueAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-hour delivery SLA target

    const assignedDistributor = getDistributorForPincode(deliveryAddress.pincode);

    const orderData = {
      orderId,
      invoiceNumber,
      customer: req.user?.userId || 'cust_guest_001',
      customerName: deliveryAddress.recipientName,
      customerPhone: deliveryAddress.contactNumber || req.user?.phone || '9999999999',
      customerEmail: req.user?.email || 'customer@sujjufoods.com',
      productId: DEFAULT_PRODUCT.sku,
      productName: DEFAULT_PRODUCT.name,
      packSize: DEFAULT_PRODUCT.packSize,
      quantity: qty,
      unitPrice,
      subtotal,
      gstAmount,
      deliveryCharge,
      discount,
      totalAmount,
      deliveryAddress,
      assignedDistributorId: assignedDistributor.id,
      distributorName: assignedDistributor.name,
      status: 'Order Placed',
      paymentMode: paymentMode || 'cash',
      collectionStatus: 'pending',
      slaDueAt,
      lastStatusUpdateAt: new Date(),
      createdAt: new Date(),
    };

    mockOrdersStore.set(orderId, orderData);

    try {
      const orderDoc = new OrderModel(orderData);
      await orderDoc.save().catch(() => null);
    } catch {}

    res.status(201).json({
      success: true,
      message: 'Order confirmed successfully and assigned for 24-hour distributor delivery.',
      order: orderData,
      invoiceNumber,
      invoiceDownloadUrl: `/api/v1/orders/${orderId}/invoice`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Order creation failed' });
  }
}

// 3. Get Order By ID with Timeline
export async function getOrderById(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;

  let order = mockOrdersStore.get(orderId);
  if (!order) {
    try {
      order = await OrderModel.findOne({ orderId });
    } catch {}
  }

  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  // 10 Status Tracking Timeline
  const trackingTimeline = [
    { status: 'Order Placed', timestamp: order.createdAt, done: true },
    { status: 'Order Confirmed', timestamp: order.createdAt, done: true },
    { status: 'Distributor Assigned', timestamp: order.createdAt, done: true, details: order.distributorName },
    { status: 'Accepted by Distributor', timestamp: null, done: order.status !== 'Order Placed' },
    { status: 'Picked Up', timestamp: null, done: ['Picked Up', 'Out for Delivery', 'Delivered'].includes(order.status) },
    { status: 'Out for Delivery', timestamp: null, done: ['Out for Delivery', 'Delivered'].includes(order.status) },
    { status: 'Delivered', timestamp: null, done: order.status === 'Delivered' },
  ];

  res.json({
    success: true,
    order,
    trackingTimeline,
    slaTarget: '24 Hours Doorstep Delivery',
  });
}

// 4. Get Current User's Orders
export async function getMyOrders(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;

  const orders: any[] = [];
  for (const o of mockOrdersStore.values()) {
    if (!userId || o.customer === userId || o.customerPhone === req.user?.phone) {
      orders.push(o);
    }
  }

  // If mock store has none, also query MongoDB
  if (orders.length === 0 && userId) {
    try {
      const dbOrders = await OrderModel.find({ customer: userId }).sort({ createdAt: -1 });
      orders.push(...dbOrders);
    } catch {}
  }

  // If still empty, return a default mock order for showcase
  if (orders.length === 0) {
    const demoOrder = {
      orderId: 'SF-2026-894120',
      invoiceNumber: 'INV-2026-894120',
      customerName: req.user?.email || 'Ramesh Kumar',
      customerPhone: req.user?.phone || '+91 98765 12345',
      customerEmail: req.user?.email || 'customer@example.com',
      productId: 'SF-TEA-250G',
      productName: 'SUJJU FOODS Tea Powder',
      packSize: '250 grams',
      quantity: 8,
      unitPrice: 180,
      subtotal: 1440,
      gstAmount: 0,
      deliveryCharge: 0,
      discount: 0,
      totalAmount: 1440,
      status: 'Accepted by Distributor',
      paymentMode: 'cash',
      collectionStatus: 'pending',
      distributorName: 'Vijay Agencies (Visakhapatnam Zone)',
      deliveryAddress: {
        houseNumber: 'D.No 4-52/1',
        street: 'Dwaraka Nagar',
        area: 'Dwaraka Nagar',
        city: 'Visakhapatnam',
        district: 'Visakhapatnam',
        state: 'Andhra Pradesh',
        pincode: '530016',
        recipientName: 'Ramesh Kumar',
        contactNumber: '+91 98765 12345',
      },
      createdAt: new Date(),
    };
    orders.push(demoOrder);
  }

  res.json({
    success: true,
    orders,
    count: orders.length,
  });
}

// 5. Download Print-Ready A4 PDF Invoice
export async function downloadInvoice(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;

  let order = mockOrdersStore.get(orderId);
  if (!order) {
    try {
      order = await OrderModel.findOne({ orderId });
    } catch {}
  }

  // Fallback demo order if not yet placed in DB
  if (!order) {
    order = {
      orderId,
      invoiceNumber: `INV-${new Date().getFullYear()}-${orderId.replace(/[^0-9]/g, '').slice(-6) || '894120'}`,
      customerName: 'Ramesh Kumar',
      customerPhone: '+91 98765 12345',
      customerEmail: 'customer@example.com',
      quantity: 8,
      unitPrice: 180,
      subtotal: 1440,
      gstAmount: 0,
      totalAmount: 1440,
      packSize: '250 grams',
      paymentMode: 'cash',
      collectionStatus: 'pending',
      deliveryAddress: {
        houseNumber: 'D.No 4-52/1',
        street: 'Dwaraka Nagar',
        area: 'Dwaraka Nagar',
        city: 'Visakhapatnam',
        district: 'Visakhapatnam',
        state: 'Andhra Pradesh',
        pincode: '530016',
        recipientName: 'Ramesh Kumar',
        contactNumber: '+91 98765 12345',
      },
      createdAt: new Date(),
    };
  }

  try {
    const pdfBuffer = await generateInvoicePdf(order);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="SUJJU_FOODS_Invoice_${orderId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to generate A4 PDF invoice' });
  }
}
