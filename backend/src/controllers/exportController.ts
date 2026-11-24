import { Request, Response } from 'express';
import { getAuditLogs } from '../services/auditService.js';

export async function fetchAuditLogs(req: Request, res: Response): Promise<void> {
  const logs = getAuditLogs();
  res.json({
    success: true,
    total: logs.length,
    logs,
  });
}

// Convert JSON array to CSV string
function convertToCsv(data: Record<string, any>[]): string {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map((obj) =>
    headers.map((h) => {
      let val = obj[h];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') val = JSON.stringify(val);
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\r\n');
}

// 1. Export Orders (CSV/Excel compatible)
export async function exportOrders(req: Request, res: Response): Promise<void> {
  const demoOrders = [
    {
      orderId: 'SF-2026-894120',
      invoiceNumber: 'INV-2026-00412',
      customerName: 'Anil Kumar',
      customerPhone: '+91 94401 22334',
      pincode: '530016',
      quantityPacks: 8,
      unitPrice: 180,
      subtotal: 1440,
      gstRate: '0%',
      totalPayable: 1440,
      paymentMode: 'cash',
      status: 'delivered',
      assignedDistributor: 'Vijay Agencies (Visakhapatnam)',
      createdAt: '2026-11-24 10:15:00',
      deliveredAt: '2026-11-24 16:30:00',
    },
    {
      orderId: 'SF-2026-894121',
      invoiceNumber: 'INV-2026-00413',
      customerName: 'P. Lakshmi',
      customerPhone: '+91 98480 33445',
      pincode: '530001',
      quantityPacks: 4,
      unitPrice: 180,
      subtotal: 720,
      gstRate: '0%',
      totalPayable: 720,
      paymentMode: 'upi',
      status: 'out_for_delivery',
      assignedDistributor: 'Vijay Agencies (Visakhapatnam)',
      createdAt: '2026-11-24 11:20:00',
      deliveredAt: 'In Transit',
    },
  ];

  const csv = convertToCsv(demoOrders);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="SUJJU_FOODS_Orders_Export.csv"');
  res.status(200).send(csv);
}

// 2. Export Collections & Financial Settlements
export async function exportCollections(req: Request, res: Response): Promise<void> {
  const demoCollections = [
    {
      orderId: 'SF-2026-894120',
      distributorName: 'Vijay Agencies',
      customerName: 'Anil Kumar',
      amountCollected: 1440,
      mode: 'CASH',
      collectionStatus: 'reconciled',
      reconciledBy: 'finance@sujjufoods.com',
      collectedAt: '2026-11-24 16:30:00',
    },
    {
      orderId: 'SF-2026-894119',
      distributorName: 'K. S. Distributors',
      customerName: 'Suresh Babu',
      amountCollected: 720,
      mode: 'UPI',
      upiReference: 'UPI-REF-884920',
      collectionStatus: 'reconciled',
      reconciledBy: 'finance@sujjufoods.com',
      collectedAt: '2026-11-24 15:45:00',
    },
  ];

  const csv = convertToCsv(demoCollections);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="SUJJU_FOODS_Collections_Ledger.csv"');
  res.status(200).send(csv);
}

// 3. Export Inventory (Raw & Finished Goods)
export async function exportInventory(req: Request, res: Response): Promise<void> {
  const inventoryData = [
    { itemCode: 'SF-TEA-250G', description: 'SUJJU FOODS Tea Powder (250g)', category: 'Finished Goods', stockQuantity: 1200, unit: 'packs', valueAtSellingPrice: 216000, status: 'Sellable' },
    { itemCode: 'RAW-TEA-CTC', description: 'Assam CTC Estate Black Tea', category: 'Raw Tea Leaf', stockQuantity: 2930, unit: 'kg', unitCost: 220, totalValuation: 644600, reorderLevel: 500 },
    { itemCode: 'RAW-TEA-BOP', description: 'Nilgiri Orthodox BOP Blend', category: 'Raw Tea Leaf', stockQuantity: 1170, unit: 'kg', unitCost: 310, totalValuation: 362700, reorderLevel: 300 },
    { itemCode: 'PKG-POUCH-250', description: '250g Barrier Foil Pouches', category: 'Packaging', stockQuantity: 7600, unit: 'pieces', unitCost: 4.5, totalValuation: 34200, reorderLevel: 1500 },
    { itemCode: 'PKG-BOX-50', description: 'Corrugated Master Shipping Cartons', category: 'Packaging', stockQuantity: 342, unit: 'pieces', unitCost: 45, totalValuation: 15390, reorderLevel: 50 },
  ];

  const csv = convertToCsv(inventoryData);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="SUJJU_FOODS_Inventory_Valuation.csv"');
  res.status(200).send(csv);
}

// 4. Export Production & Quality Control Batches
export async function exportProduction(req: Request, res: Response): Promise<void> {
  const productionData = [
    { batchNumber: 'SF-B26-101', product: 'SUJJU FOODS Tea (250g)', quantityPacks: 800, weightKg: 200, mfgDate: '2026-11-20', expDate: '2027-11-19', qcStatus: 'APPROVED', moisturePercent: 5.2, sensoryScore: 9.0, chemist: 'K. Suresh' },
    { batchNumber: 'SF-B26-807', product: 'SUJJU FOODS Tea (250g)', quantityPacks: 400, weightKg: 100, mfgDate: '2026-11-24', expDate: '2027-11-23', qcStatus: 'APPROVED', moisturePercent: 5.3, sensoryScore: 9.0, chemist: 'K. Suresh' },
  ];

  const csv = convertToCsv(productionData);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="SUJJU_FOODS_Production_QC_Log.csv"');
  res.status(200).send(csv);
}
