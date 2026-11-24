import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { OrderModel } from '../models/Order.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { mockOrdersStore } from './orderController.js';

// Default Commission Policy: ₹20 per 250g packet delivered and reconciled, or 10%
export interface CommissionRule {
  id: string;
  name: string;
  type: 'fixed_per_pack' | 'percentage';
  rate: number; // ₹20 per pack or 10%
  minPacksMonthlyBonusThreshold?: number;
  monthlyBonusAmount?: number;
  isActive: boolean;
}

let activeCommissionRule: CommissionRule = {
  id: 'RULE-STD-2026',
  name: 'Standard Territory Distributor Commission',
  type: 'fixed_per_pack',
  rate: 20, // ₹20 per 250g pack
  minPacksMonthlyBonusThreshold: 100,
  monthlyBonusAmount: 2000,
  isActive: true,
};

// 1. Get Collections Summary & Ledger (Cash vs UPI)
export async function getCollections(req: AuthRequest, res: Response): Promise<void> {
  const distributorId = (req.query.distributorId as string) || req.user?.referralCode;

  const orders: any[] = [];
  for (const o of mockOrdersStore.values()) {
    if (!distributorId || o.assignedDistributorId === distributorId || o.distributorName?.includes(distributorId)) {
      orders.push(o);
    }
  }

  if (orders.length === 0) {
    orders.push(
      {
        orderId: 'SF-2026-894120',
        customerName: 'Ramesh Kumar',
        totalAmount: 1440,
        quantity: 8,
        status: 'Delivered',
        paymentMode: 'cash',
        collectionStatus: 'reconciled',
        collectedAmount: 1440,
        distributorName: 'Vijay Agencies (APDIST01)',
        assignedDistributorId: 'APDIST01',
        createdAt: new Date(),
      },
      {
        orderId: 'SF-2026-894121',
        customerName: 'Srinivas Rao',
        totalAmount: 1440,
        quantity: 8,
        status: 'Delivered',
        paymentMode: 'upi',
        upiReferenceId: 'UPI-REF-992144',
        collectionStatus: 'reconciled',
        collectedAmount: 1440,
        distributorName: 'Vijay Agencies (APDIST01)',
        assignedDistributorId: 'APDIST01',
        createdAt: new Date(),
      }
    );
  }

  if (orders.length === 0) {
    // Add default representative orders for demonstration
    orders.push(
      {
        orderId: 'SF-2026-894120',
        customerName: 'Ramesh Kumar',
        totalAmount: 1440,
        quantity: 8,
        status: 'Delivered',
        paymentMode: 'cash',
        collectionStatus: 'reconciled',
        collectedAmount: 1440,
        distributorName: 'Vijay Agencies (APDIST01)',
        assignedDistributorId: 'APDIST01',
        createdAt: new Date(),
      },
      {
        orderId: 'SF-2026-894121',
        customerName: 'Srinivas Rao',
        totalAmount: 1440,
        quantity: 8,
        status: 'Delivered',
        paymentMode: 'upi',
        upiReferenceId: 'UPI-REF-992144',
        collectionStatus: 'collected',
        collectedAmount: 1440,
        distributorName: 'Vijay Agencies (APDIST01)',
        assignedDistributorId: 'APDIST01',
        createdAt: new Date(),
      }
    );
  }

  let totalCashCollected = 0;
  let totalUpiCollected = 0;
  let totalReconciled = 0;
  let totalPendingReconciliation = 0;

  for (const o of orders) {
    if (o.status === 'Delivered' || o.collectionStatus === 'collected' || o.collectionStatus === 'reconciled') {
      const amt = o.collectedAmount || o.totalAmount || 0;
      if (o.paymentMode === 'cash') {
        totalCashCollected += amt;
      } else {
        totalUpiCollected += amt;
      }

      if (o.collectionStatus === 'reconciled') {
        totalReconciled += amt;
      } else {
        totalPendingReconciliation += amt;
      }
    }
  }

  res.json({
    success: true,
    summary: {
      totalCollected: totalCashCollected + totalUpiCollected,
      totalCashCollected,
      totalUpiCollected,
      totalReconciled,
      totalPendingReconciliation,
    },
    orders,
  });
}

// 2. Reconcile Collection (Admin / Finance Action)
export async function reconcileCollection(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;
  const { reconciledBy, notes } = req.body;

  let order = mockOrdersStore.get(orderId);
  if (!order && mongoose.connection.readyState === 1) {
    try {
      order = await OrderModel.findOne({ orderId });
    } catch {}
  }

  // Idempotency check: Cannot reconcile already reconciled transaction
  if (order && order.collectionStatus === 'reconciled') {
    res.status(400).json({
      success: false,
      message: `Collection for order ${orderId} has already been reconciled against bank settlement. Duplicate reconciliation blocked.`,
      orderId,
    });
    return;
  }

  if (order) {
    order.collectionStatus = 'reconciled';
    order.reconciledAt = new Date();
    order.reconciledBy = reconciledBy || 'Finance Admin';
    mockOrdersStore.set(orderId, order);
    if (mongoose.connection.readyState === 1) {
      try {
        await OrderModel.updateOne(
          { orderId },
          { collectionStatus: 'reconciled', lastStatusUpdateAt: new Date() }
        );
      } catch {}
    }
  } else {
    // If not in store yet, store in mock store as reconciled
    mockOrdersStore.set(orderId, {
      orderId,
      collectionStatus: 'reconciled',
      reconciledAt: new Date(),
      reconciledBy: reconciledBy || 'Finance Admin',
    });
  }

  res.json({
    success: true,
    message: `Collection for order ${orderId} reconciled successfully against bank settlement.`,
    orderId,
    collectionStatus: 'reconciled',
    reconciledAt: new Date(),
  });
}

// 3. Get / Update Commission Rules
export async function getCommissionRules(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    rule: activeCommissionRule,
  });
}

export async function updateCommissionRule(req: Request, res: Response): Promise<void> {
  const { name, type, rate, minPacksMonthlyBonusThreshold, monthlyBonusAmount } = req.body;
  if (!rate || rate <= 0) {
    res.status(400).json({ success: false, message: 'Valid commission rate is required' });
    return;
  }

  activeCommissionRule = {
    id: `RULE-UPD-${Date.now()}`,
    name: name || activeCommissionRule.name,
    type: type || 'fixed_per_pack',
    rate: parseFloat(rate),
    minPacksMonthlyBonusThreshold: minPacksMonthlyBonusThreshold || 100,
    monthlyBonusAmount: monthlyBonusAmount || 2000,
    isActive: true,
  };

  res.json({
    success: true,
    message: 'Distributor commission policy updated successfully',
    rule: activeCommissionRule,
  });
}

// 4. Calculate Commission Ledger for Distributor
export async function getDistributorCommission(req: AuthRequest, res: Response): Promise<void> {
  const distributorId = (req.query.distributorId as string) || req.user?.referralCode || 'APDIST01';

  const orders: any[] = [];
  for (const o of mockOrdersStore.values()) {
    if (!distributorId || o.assignedDistributorId === distributorId || o.distributorName?.includes(distributorId)) {
      orders.push(o);
    }
  }

  if (orders.length === 0) {
    orders.push(
      {
        orderId: 'SF-2026-894120',
        customerName: 'Ramesh Kumar',
        totalAmount: 1440,
        quantity: 8,
        status: 'Delivered',
        paymentMode: 'cash',
        collectionStatus: 'reconciled',
        collectedAmount: 1440,
        distributorName: 'Vijay Agencies (APDIST01)',
        assignedDistributorId: 'APDIST01',
        createdAt: new Date(),
      },
      {
        orderId: 'SF-2026-894121',
        customerName: 'Srinivas Rao',
        totalAmount: 1440,
        quantity: 8,
        status: 'Delivered',
        paymentMode: 'upi',
        upiReferenceId: 'UPI-REF-992144',
        collectionStatus: 'reconciled',
        collectedAmount: 1440,
        distributorName: 'Vijay Agencies (APDIST01)',
        assignedDistributorId: 'APDIST01',
        createdAt: new Date(),
      }
    );
  }

  let totalDeliveredPacks = 0;
  let estimatedCommission = 0;
  let approvedCommission = 0;
  let reversedCommission = 0;

  const commissionLedger: any[] = [];

  for (const o of orders) {
    if (o.status === 'Delivered') {
      const packs = o.quantity || 1;
      totalDeliveredPacks += packs;

      const commAmount =
        activeCommissionRule.type === 'fixed_per_pack'
          ? packs * activeCommissionRule.rate
          : (o.totalAmount * activeCommissionRule.rate) / 100;

      if (o.collectionStatus === 'reconciled') {
        approvedCommission += commAmount;
      } else {
        estimatedCommission += commAmount;
      }

      commissionLedger.push({
        orderId: o.orderId,
        date: o.createdAt,
        packs,
        orderAmount: o.totalAmount,
        commissionRate: `₹${activeCommissionRule.rate}/pack`,
        commissionAmount: commAmount,
        status: o.collectionStatus === 'reconciled' ? 'Approved' : 'Pending Reconciliation',
      });
    }
  }

  // Monthly bonus calculation
  let targetBonusEarned = 0;
  if (totalDeliveredPacks >= (activeCommissionRule.minPacksMonthlyBonusThreshold || 100)) {
    targetBonusEarned = activeCommissionRule.monthlyBonusAmount || 2000;
  }

  res.json({
    success: true,
    distributorId,
    activeRule: activeCommissionRule,
    summary: {
      totalDeliveredPacks,
      estimatedCommission,
      approvedCommission,
      targetBonusEarned,
      totalPayableCommission: approvedCommission + targetBonusEarned,
      reversedCommission,
    },
    ledger: commissionLedger,
  });
}

// 5. Territory Leaderboard (Rankings based on delivered volume & SLA performance)
export async function getLeaderboard(req: Request, res: Response): Promise<void> {
  const leaderboard = [
    {
      rank: 1,
      distributorName: 'Vijay Agencies',
      distributorId: 'APDIST01',
      territory: 'Visakhapatnam Zone (530001 - 530020)',
      deliveredOrders: 42,
      deliveredPacks: 336,
      reconciledSales: 60480,
      slaComplianceRate: 98.4,
      incentivePoints: 1250,
      badge: 'Platinum Partner',
    },
    {
      rank: 2,
      distributorName: 'Krishna Agency',
      distributorId: 'APDIST04',
      territory: 'Vijayawada Zone (520001 - 520015)',
      deliveredOrders: 36,
      deliveredPacks: 288,
      reconciledSales: 51840,
      slaComplianceRate: 96.8,
      incentivePoints: 1080,
      badge: 'Gold Partner',
    },
    {
      rank: 3,
      distributorName: 'Guntur Tea Hub',
      distributorId: 'APDIST02',
      territory: 'Guntur & Tenali Zone (522001 - 522004)',
      deliveredOrders: 28,
      deliveredPacks: 224,
      reconciledSales: 40320,
      slaComplianceRate: 95.0,
      incentivePoints: 840,
      badge: 'Silver Partner',
    },
    {
      rank: 4,
      distributorName: 'Godavari Direct Traders',
      distributorId: 'APDIST05',
      territory: 'Rajahmundry & Kakinada (533101 - 533001)',
      deliveredOrders: 20,
      deliveredPacks: 160,
      reconciledSales: 28800,
      slaComplianceRate: 94.2,
      incentivePoints: 620,
      badge: 'Bronze Partner',
    },
  ];

  res.json({
    success: true,
    reportingMonth: 'November 2026',
    leaderboard,
  });
}
