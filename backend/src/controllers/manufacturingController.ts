import { Request, Response } from 'express';

export interface RawMaterial {
  code: string;
  name: string;
  category: 'raw_material' | 'packaging';
  supplier: string;
  unit: string;
  currentStock: number;
  reorderThreshold: number;
  unitCost: number;
}

export interface ProductionBatch {
  batchNumber: string;
  productId: string;
  productName: string;
  plannedQuantityPacks: number;
  actualQuantityPacks: number;
  rawMaterialConsumedKg: number;
  manufacturingDate: Date;
  bestBeforeDate: Date;
  qcStatus: 'qc_pending' | 'qc_approved' | 'qc_rejected';
  qcInspection?: {
    inspectedBy: string;
    moisturePercentage: number; // Must be < 6.5%
    liquorScoreOutOf10: number; // Must be >= 7.0
    sealIntegrityPassed: boolean;
    remarks: string;
    inspectedAt: Date;
  };
  isSellableInventory: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  materialsSupplied: string[];
  paymentTerms: string;
  status: 'active' | 'inactive';
}

export interface PurchaseOrder {
  poNumber: string;
  supplierId: string;
  supplierName: string;
  materialCode: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitCost: number;
  totalAmount: number;
  status: 'pending' | 'partially_received' | 'completed';
  createdAt: Date;
}

// In-memory master stores for dev resilience
let rawMaterials: RawMaterial[] = [
  {
    code: 'RAW-TEA-CTC',
    name: 'CTC Granulated Black Tea (Estate Grade)',
    category: 'raw_material',
    supplier: 'Assam Valley Tea Estates',
    unit: 'kg',
    currentStock: 2500,
    reorderThreshold: 500,
    unitCost: 220,
  },
  {
    code: 'RAW-TEA-BOP',
    name: 'Orthodox Broken Orange Pekoe Blend',
    category: 'raw_material',
    supplier: 'Nilgiri High Elevation Gardens',
    unit: 'kg',
    currentStock: 1200,
    reorderThreshold: 300,
    unitCost: 310,
  },
  {
    code: 'PKG-POUCH-250',
    name: '250g Multi-Layer Barrier Foil Pouches',
    category: 'packaging',
    supplier: 'Supreme Flexible Packaging Ltd',
    unit: 'pieces',
    currentStock: 8000,
    reorderThreshold: 1500,
    unitCost: 4.5,
  },
  {
    code: 'PKG-BOX-50',
    name: '50-Pack Heavy Duty Corrugated Master Cartons',
    category: 'packaging',
    supplier: 'Andhra Paper & Packaging Corp',
    unit: 'pieces',
    currentStock: 350,
    reorderThreshold: 50,
    unitCost: 45,
  },
];

let productionBatches: ProductionBatch[] = [
  {
    batchNumber: 'SF-B26-101',
    productId: 'SF-TEA-250G',
    productName: 'SUJJU FOODS Tea Powder (250g)',
    plannedQuantityPacks: 800,
    actualQuantityPacks: 800,
    rawMaterialConsumedKg: 200, // 800 * 0.25kg = 200kg
    manufacturingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    bestBeforeDate: new Date(Date.now() + 360 * 24 * 60 * 60 * 1000),
    qcStatus: 'qc_approved',
    qcInspection: {
      inspectedBy: 'K. Suresh (QC Chemist)',
      moisturePercentage: 5.2,
      liquorScoreOutOf10: 9.0,
      sealIntegrityPassed: true,
      remarks: 'Golden-red infusion, strong briskness, zero moisture leak',
      inspectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    isSellableInventory: true,
  },
];

let suppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Assam Valley Tea Estates',
    contactPerson: 'Mr. P. Barua',
    phone: '+91 98321 00456',
    email: 'orders@assamvalleytea.com',
    materialsSupplied: ['RAW-TEA-CTC'],
    paymentTerms: 'Net 30 Days',
    status: 'active',
  },
  {
    id: 'SUP-002',
    name: 'Nilgiri High Elevation Gardens',
    contactPerson: 'Ms. Geetha Raman',
    phone: '+91 94432 11987',
    email: 'sales@nilgirihighgardens.com',
    materialsSupplied: ['RAW-TEA-BOP'],
    paymentTerms: 'Net 15 Days',
    status: 'active',
  },
  {
    id: 'SUP-003',
    name: 'Supreme Flexible Packaging Ltd',
    contactPerson: 'Mr. K. Narayana',
    phone: '+91 98480 33211',
    email: 'contact@supremeflex.in',
    materialsSupplied: ['PKG-POUCH-250'],
    paymentTerms: 'Immediate UPI/NEFT',
    status: 'active',
  },
];

let purchaseOrders: PurchaseOrder[] = [
  {
    poNumber: 'PO-2026-081',
    supplierId: 'SUP-001',
    supplierName: 'Assam Valley Tea Estates',
    materialCode: 'RAW-TEA-CTC',
    orderedQuantity: 1000,
    receivedQuantity: 1000,
    unitCost: 220,
    totalAmount: 220000,
    status: 'completed',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

// 1. Get Raw Materials Inventory
export async function getMaterials(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    materials: rawMaterials,
  });
}

// 2. Get Standard Bill of Materials (BOM) Formula
export async function getBillOfMaterials(req: Request, res: Response): Promise<void> {
  const bom = {
    productId: 'SF-TEA-250G',
    productName: 'SUJJU FOODS Tea Powder (250g)',
    batchBasisPacks: 400, // 100 kg finished goods
    finishedWeightKg: 100,
    formula: [
      { materialCode: 'RAW-TEA-CTC', name: 'CTC Black Tea Granules', requiredQuantity: 70, unit: 'kg', ratio: '70%' },
      { materialCode: 'RAW-TEA-BOP', name: 'Orthodox BOP Leaf', requiredQuantity: 30, unit: 'kg', ratio: '30%' },
      { materialCode: 'PKG-POUCH-250', name: '250g Laminated Pouches', requiredQuantity: 400, unit: 'pieces', ratio: '1:1 pack' },
      { materialCode: 'PKG-BOX-50', name: 'Corrugated Master Box', requiredQuantity: 8, unit: 'pieces', ratio: '50 packs/box' },
    ],
  };

  res.json({
    success: true,
    bom,
  });
}

// 3. Create Production Run (Calculates consumption, deducts raw stock, generates unique batch number)
export async function createProductionOrder(req: Request, res: Response): Promise<void> {
  const { plannedQuantityPacks } = req.body;
  const packs = parseInt(plannedQuantityPacks, 10);

  if (isNaN(packs) || packs <= 0) {
    res.status(400).json({ success: false, message: 'Valid planned quantity of packs is required' });
    return;
  }

  // Calculate required raw materials (e.g. 400 packs = 100kg total = 70kg CTC + 30kg BOP + 400 pouches)
  const weightKg = (packs * 250) / 1000;
  const ctcRequired = weightKg * 0.7;
  const bopRequired = weightKg * 0.3;
  const pouchesRequired = packs;

  // Check inventory availability (cannot become negative)
  const ctcItem = rawMaterials.find((m) => m.code === 'RAW-TEA-CTC');
  const bopItem = rawMaterials.find((m) => m.code === 'RAW-TEA-BOP');
  const pouchItem = rawMaterials.find((m) => m.code === 'PKG-POUCH-250');

  if (!ctcItem || ctcItem.currentStock < ctcRequired) {
    res.status(400).json({
      success: false,
      message: `Insufficient CTC Black Tea stock. Required: ${ctcRequired} kg, Available: ${ctcItem?.currentStock || 0} kg`,
    });
    return;
  }

  if (!bopItem || bopItem.currentStock < bopRequired) {
    res.status(400).json({
      success: false,
      message: `Insufficient Orthodox BOP stock. Required: ${bopRequired} kg, Available: ${bopItem?.currentStock || 0} kg`,
    });
    return;
  }

  if (!pouchItem || pouchItem.currentStock < pouchesRequired) {
    res.status(400).json({
      success: false,
      message: `Insufficient 250g packaging pouches. Required: ${pouchesRequired} pcs, Available: ${pouchItem?.currentStock || 0} pcs`,
    });
    return;
  }

  // Deduct inventory transactionally
  ctcItem.currentStock -= ctcRequired;
  bopItem.currentStock -= bopRequired;
  pouchItem.currentStock -= pouchesRequired;

  // Generate unique batch number
  const batchSuffix = Math.floor(100 + Math.random() * 900);
  const batchNumber = `SF-B26-${batchSuffix}`;

  const newBatch: ProductionBatch = {
    batchNumber,
    productId: 'SF-TEA-250G',
    productName: 'SUJJU FOODS Tea Powder (250g)',
    plannedQuantityPacks: packs,
    actualQuantityPacks: packs,
    rawMaterialConsumedKg: weightKg,
    manufacturingDate: new Date(),
    bestBeforeDate: new Date(Date.now() + 360 * 24 * 60 * 60 * 1000), // 12 months
    qcStatus: 'qc_pending', // Mandatory rule: starts as pending QC
    isSellableInventory: false, // Cannot be sold until QC approved
  };

  productionBatches.unshift(newBatch);

  res.status(201).json({
    success: true,
    message: `Production completed for ${packs} packs (${weightKg} kg). Batch ${batchNumber} queued for Quality Control inspection.`,
    batch: newBatch,
    consumed: {
      ctcKg: ctcRequired,
      bopKg: bopRequired,
      pouchesPieces: pouchesRequired,
    },
  });
}

// 4. Get Batches
export async function getBatches(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    batches: productionBatches,
  });
}

// 5. Submit Quality Control (QC) Inspection
export async function inspectBatchQC(req: Request, res: Response): Promise<void> {
  const { batchNumber } = req.params;
  const { inspectedBy, moisturePercentage, liquorScoreOutOf10, sealIntegrityPassed, remarks, approved } = req.body;

  const batch = productionBatches.find((b) => b.batchNumber === batchNumber);
  if (!batch) {
    res.status(404).json({ success: false, message: `Batch ${batchNumber} not found` });
    return;
  }

  const moisture = parseFloat(moisturePercentage);
  const score = parseFloat(liquorScoreOutOf10);

  // Quality check rule: Moisture must be < 6.5% and seal integrity passed
  const meetsQualityStandards = moisture < 6.5 && sealIntegrityPassed === true && score >= 7.0;

  if (approved && !meetsQualityStandards) {
    res.status(400).json({
      success: false,
      message: `Quality standard violation: Batch ${batchNumber} failed inspection benchmarks (Moisture must be <6.5%, current: ${moisture}%; Seal integrity must pass). Cannot approve.`,
    });
    return;
  }

  batch.qcStatus = approved ? 'qc_approved' : 'qc_rejected';
  batch.isSellableInventory = approved ? true : false;
  batch.qcInspection = {
    inspectedBy: inspectedBy || 'Chief QC Officer',
    moisturePercentage: moisture,
    liquorScoreOutOf10: score,
    sealIntegrityPassed: Boolean(sealIntegrityPassed),
    remarks: remarks || (approved ? 'Meets all statutory & FSSAI moisture benchmarks' : 'Failed quality parameters'),
    inspectedAt: new Date(),
  };

  res.json({
    success: true,
    message: approved
      ? `Batch ${batchNumber} approved! Added ${batch.actualQuantityPacks} packs to sellable finished goods inventory.`
      : `Batch ${batchNumber} rejected and moved to quarantine/rework.`,
    batch,
  });
}

// 6. Comprehensive Inventory Overview (Raw, Packaging, Finished Goods)
export async function getInventoryOverview(req: Request, res: Response): Promise<void> {
  // Calculate sellable finished packs from QC approved batches
  const totalApprovedPacks = productionBatches
    .filter((b) => b.isSellableInventory)
    .reduce((acc, curr) => acc + curr.actualQuantityPacks, 0);

  const pendingQcPacks = productionBatches
    .filter((b) => b.qcStatus === 'qc_pending')
    .reduce((acc, curr) => acc + curr.actualQuantityPacks, 0);

  res.json({
    success: true,
    finishedGoods: {
      sku: 'SF-TEA-250G',
      productName: 'SUJJU FOODS Tea Powder (250g)',
      sellableAvailablePacks: totalApprovedPacks,
      pendingQcPacks,
      reservedPacks: 24, // Customer orders in transit
      dispatchedPacks: 120,
    },
    rawMaterials,
    lowStockAlerts: rawMaterials.filter((m) => m.currentStock <= m.reorderThreshold),
  });
}

// 7. Suppliers Management
export async function getSuppliers(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    suppliers,
  });
}

// 8. Create Purchase Order & Goods Receipt (GRN)
export async function createPurchaseOrder(req: Request, res: Response): Promise<void> {
  const { supplierId, materialCode, orderedQuantity } = req.body;
  const qty = parseFloat(orderedQuantity);

  const supplier = suppliers.find((s) => s.id === supplierId);
  const material = rawMaterials.find((m) => m.code === materialCode);

  if (!supplier || !material || isNaN(qty) || qty <= 0) {
    res.status(400).json({ success: false, message: 'Valid supplier, material code, and quantity required' });
    return;
  }

  const poNumber = `PO-2026-${Math.floor(100 + Math.random() * 900)}`;
  const totalAmount = qty * material.unitCost;

  const po: PurchaseOrder = {
    poNumber,
    supplierId: supplier.id,
    supplierName: supplier.name,
    materialCode: material.code,
    orderedQuantity: qty,
    receivedQuantity: 0,
    unitCost: material.unitCost,
    totalAmount,
    status: 'pending',
    createdAt: new Date(),
  };

  purchaseOrders.unshift(po);

  res.status(201).json({
    success: true,
    message: `Purchase Order ${poNumber} issued to ${supplier.name} for ${qty} ${material.unit}.`,
    po,
  });
}

// 9. Receive Goods (GRN) - Credits Raw Material Inventory
export async function receiveGoods(req: Request, res: Response): Promise<void> {
  const { poNumber } = req.params;
  const { acceptedQuantity } = req.body;
  const accepted = parseFloat(acceptedQuantity);

  const po = purchaseOrders.find((p) => p.poNumber === poNumber);
  if (!po) {
    res.status(404).json({ success: false, message: `PO ${poNumber} not found` });
    return;
  }

  po.receivedQuantity = accepted;
  po.status = 'completed';

  // Credit inventory
  const material = rawMaterials.find((m) => m.code === po.materialCode);
  if (material) {
    material.currentStock += accepted;
  }

  res.json({
    success: true,
    message: `Goods Receipt recorded. Credited ${accepted} ${material?.unit} of ${material?.name} to inventory ledger.`,
    po,
    material,
  });
}
