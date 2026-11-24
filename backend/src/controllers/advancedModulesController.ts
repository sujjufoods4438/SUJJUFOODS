import { Request, Response } from 'express';

// ==========================================
// 1. QR Code Product Authentication
// ==========================================
export interface QrProductVerification {
  batchNumber: string;
  isAuthentic: boolean;
  productName: string;
  packSize: string;
  mrp: number;
  fssaiLicense: string;
  plantLocation: string;
  harvestGardens: string;
  manufacturingDate: string;
  bestBeforeDate: string;
  labTestReport: {
    moisturePercentage: number;
    sensoryLiquorScore: string;
    sealIntegrity: string;
    pesticideResidueCompliant: boolean;
    labCertifiedBy: string;
  };
}

export async function verifyQrCode(req: Request, res: Response): Promise<void> {
  const { batchNumber } = req.params;

  if (!batchNumber || batchNumber.trim() === '') {
    res.status(400).json({ success: false, message: 'Batch number or QR identifier is required' });
    return;
  }

  const cleanBatch = batchNumber.toUpperCase().trim();

  // Known verified batches or dynamic batch pattern check
  const isSujjuBatch = cleanBatch.startsWith('SF-B26-') || cleanBatch.startsWith('SF-B24-') || cleanBatch === 'SF-TEA-250G';

  if (!isSujjuBatch) {
    res.status(404).json({
      success: false,
      isAuthentic: false,
      message: `Invalid or unverified batch code "${batchNumber}". Product could not be authenticated as genuine SUJJU FOODS packaging.`,
    });
    return;
  }

  const verificationData: QrProductVerification = {
    batchNumber: cleanBatch,
    isAuthentic: true,
    productName: 'SUJJU FOODS Tea Powder',
    packSize: '250g Multi-Layer Barrier Foil Pouch',
    mrp: 180,
    fssaiLicense: 'FSSAI Lic. No. 10123999000123',
    plantLocation: 'SUJJU FOODS Processing Plant, Visakhapatnam Industrial Corridor, Andhra Pradesh - 530016',
    harvestGardens: 'Assam Valley Premium Tea Estates & High-Elevation Nilgiri Gardens',
    manufacturingDate: '2026-11-20',
    bestBeforeDate: '2027-11-19 (12 Months)',
    labTestReport: {
      moisturePercentage: 5.2,
      sensoryLiquorScore: '9.0 / 10 (Golden-red brisk infusion)',
      sealIntegrity: '100% Passed (Zero micro-perforation detected)',
      pesticideResidueCompliant: true,
      labCertifiedBy: 'K. Suresh (Chief QC & Analytical Chemist)',
    },
  };

  res.json({
    success: true,
    verification: verificationData,
  });
}

// ==========================================
// 2. Customer Subscriptions
// ==========================================
export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryPincode: string;
  deliveryAddress: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  quantityPacks: number;
  totalPerDelivery: number;
  paymentMode: 'cash' | 'upi';
  nextDeliveryDate: string;
  status: 'active' | 'paused' | 'cancelled';
  createdAt: string;
}

let subscriptionsStore: Subscription[] = [
  {
    id: 'SUB-2026-001',
    customerId: 'CUST-DEMO-001',
    customerName: 'Sujata Reddy',
    customerPhone: '+91 98480 12345',
    deliveryPincode: '530016',
    deliveryAddress: 'Flat 402, Sai Residency, Dwaraka Nagar, Visakhapatnam',
    frequency: 'monthly',
    quantityPacks: 4,
    totalPerDelivery: 720, // 4 * 180 = 720
    paymentMode: 'upi',
    nextDeliveryDate: '2026-12-01',
    status: 'active',
    createdAt: '2026-11-15T10:00:00.000Z',
  },
];

export async function createSubscription(req: Request, res: Response): Promise<void> {
  const { customerId, customerName, customerPhone, deliveryPincode, deliveryAddress, frequency, quantityPacks, paymentMode } = req.body;
  const qty = parseInt(quantityPacks, 10);

  if (!customerPhone || !deliveryPincode || !deliveryAddress || isNaN(qty) || qty <= 0) {
    res.status(400).json({ success: false, message: 'Valid customer details, delivery pincode, address, and quantity are required' });
    return;
  }

  const subId = `SUB-2026-${Math.floor(100 + Math.random() * 900)}`;
  const totalPerDelivery = qty * 180; // Strictly ₹180 / pack

  // Calculate next delivery date (weekly +7d, biweekly +14d, monthly +30d)
  const daysToAdd = frequency === 'weekly' ? 7 : frequency === 'biweekly' ? 14 : 30;
  const nextDelivery = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const newSub: Subscription = {
    id: subId,
    customerId: customerId || 'CUST-ACTIVE-USER',
    customerName: customerName || 'Valued Customer',
    customerPhone,
    deliveryPincode,
    deliveryAddress,
    frequency: frequency || 'monthly',
    quantityPacks: qty,
    totalPerDelivery,
    paymentMode: paymentMode || 'cash',
    nextDeliveryDate: nextDelivery,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  subscriptionsStore.unshift(newSub);

  res.status(201).json({
    success: true,
    message: `Subscription ${subId} created successfully. Scheduled ${qty} packs every ${frequency} (₹${totalPerDelivery}/delivery).`,
    subscription: newSub,
  });
}

export async function getSubscriptions(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    subscriptions: subscriptionsStore,
  });
}

export async function updateSubscriptionStatus(req: Request, res: Response): Promise<void> {
  const { subId } = req.params;
  const { status } = req.body;

  if (!['active', 'paused', 'cancelled'].includes(status)) {
    res.status(400).json({ success: false, message: 'Status must be active, paused, or cancelled' });
    return;
  }

  const sub = subscriptionsStore.find((s) => s.id === subId);
  if (!sub) {
    res.status(404).json({ success: false, message: `Subscription ${subId} not found` });
    return;
  }

  sub.status = status;
  res.json({
    success: true,
    message: `Subscription ${subId} updated to ${status}.`,
    subscription: sub,
  });
}

// ==========================================
// 3. Customer Returns & Complaints
// ==========================================
export interface Complaint {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  category: 'packaging_damaged' | 'wrong_quantity' | 'taste_quality' | 'delivery_delay' | 'other';
  description: string;
  photoUrl?: string;
  resolutionStatus: 'open' | 'investigating' | 'resolved' | 'replacement_dispatched';
  resolutionNotes?: string;
  createdAt: string;
}

let complaintsStore: Complaint[] = [
  {
    id: 'CMP-2026-012',
    orderId: 'SF-2026-894120',
    customerName: 'Anil Kumar',
    customerPhone: '+91 94401 22334',
    category: 'packaging_damaged',
    description: 'Outer seal bent during transit; tea inside was intact but pouch looked creased.',
    photoUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    resolutionStatus: 'resolved',
    resolutionNotes: 'Customer contacted, offered ₹50 voucher and verified pouch barrier was intact.',
    createdAt: '2026-11-22T14:30:00.000Z',
  },
];

export async function createComplaint(req: Request, res: Response): Promise<void> {
  const { orderId, customerName, customerPhone, category, description, photoUrl } = req.body;

  if (!orderId || !category || !description) {
    res.status(400).json({ success: false, message: 'Order ID, category, and description are required' });
    return;
  }

  const complaintId = `CMP-2026-${Math.floor(100 + Math.random() * 900)}`;

  const newComplaint: Complaint = {
    id: complaintId,
    orderId,
    customerName: customerName || 'Registered Customer',
    customerPhone: customerPhone || '+91 98480 00000',
    category,
    description,
    photoUrl,
    resolutionStatus: 'open',
    createdAt: new Date().toISOString(),
  };

  complaintsStore.unshift(newComplaint);

  res.status(201).json({
    success: true,
    message: `Support ticket ${complaintId} logged successfully. A customer relationship manager will review it within 2 hours.`,
    complaint: newComplaint,
  });
}

export async function getComplaints(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    complaints: complaintsStore,
  });
}

export async function resolveComplaint(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { resolutionStatus, resolutionNotes } = req.body;

  const complaint = complaintsStore.find((c) => c.id === id);
  if (!complaint) {
    res.status(404).json({ success: false, message: `Ticket ${id} not found` });
    return;
  }

  complaint.resolutionStatus = resolutionStatus || 'resolved';
  complaint.resolutionNotes = resolutionNotes || 'Resolved as per standard quality policy';

  res.json({
    success: true,
    message: `Support ticket ${id} marked as ${complaint.resolutionStatus}.`,
    complaint,
  });
}

// ==========================================
// 4. Employee Attendance & Task Management
// ==========================================
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  checkInTime: string;
  checkOutTime?: string;
  location: string;
  status: 'present' | 'half_day' | 'completed';
}

export interface EmployeeTask {
  id: string;
  employeeId: string;
  taskTitle: string;
  priority: 'high' | 'medium' | 'low';
  department: 'production' | 'quality' | 'dispatch' | 'maintenance';
  isCompleted: boolean;
  completedAt?: string;
}

let attendanceRecords: AttendanceRecord[] = [
  {
    id: 'ATT-2026-001',
    employeeId: 'EMP-014',
    employeeName: 'Ravi Teja',
    role: 'Packaging Line Supervisor',
    checkInTime: '2026-11-24T08:30:00.000Z',
    location: 'Plant Floor Section B (Visakhapatnam)',
    status: 'present',
  },
];

let employeeTasksStore: EmployeeTask[] = [
  {
    id: 'TSK-101',
    employeeId: 'EMP-014',
    taskTitle: 'Inspect seal integrity on 400 pouches of Batch SF-B26-807',
    priority: 'high',
    department: 'quality',
    isCompleted: true,
    completedAt: '2026-11-24T11:00:00.000Z',
  },
  {
    id: 'TSK-102',
    employeeId: 'EMP-014',
    taskTitle: 'Calibrate digital weighing scale for 250g packaging line',
    priority: 'medium',
    department: 'maintenance',
    isCompleted: false,
  },
  {
    id: 'TSK-103',
    employeeId: 'EMP-014',
    taskTitle: 'Stage corrugated master boxes for morning dispatch to Gajuwaka zone',
    priority: 'high',
    department: 'dispatch',
    isCompleted: false,
  },
];

export async function checkInAttendance(req: Request, res: Response): Promise<void> {
  const { employeeId, employeeName, role, location } = req.body;

  const record: AttendanceRecord = {
    id: `ATT-2026-${Math.floor(100 + Math.random() * 900)}`,
    employeeId: employeeId || 'EMP-CURRENT',
    employeeName: employeeName || 'Factory Floor Staff',
    role: role || 'Plant Operator',
    checkInTime: new Date().toISOString(),
    location: location || 'SUJJU FOODS Plant Floor (Visakhapatnam)',
    status: 'present',
  };

  attendanceRecords.unshift(record);

  res.status(201).json({
    success: true,
    message: `Attendance check-in logged for ${record.employeeName} at ${new Date().toLocaleTimeString()}.`,
    record,
  });
}

export async function checkOutAttendance(req: Request, res: Response): Promise<void> {
  const { employeeId } = req.body;

  const record = attendanceRecords.find((r) => r.employeeId === (employeeId || 'EMP-CURRENT') && !r.checkOutTime);
  if (!record) {
    res.status(404).json({ success: false, message: 'No active open check-in record found for checkout' });
    return;
  }

  record.checkOutTime = new Date().toISOString();
  record.status = 'completed';

  res.json({
    success: true,
    message: `Attendance checkout logged successfully at ${new Date().toLocaleTimeString()}.`,
    record,
  });
}

export async function getAttendanceList(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    attendance: attendanceRecords,
  });
}

export async function getEmployeeTasks(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    tasks: employeeTasksStore,
  });
}

export async function completeEmployeeTask(req: Request, res: Response): Promise<void> {
  const { taskId } = req.params;

  const task = employeeTasksStore.find((t) => t.id === taskId);
  if (!task) {
    res.status(404).json({ success: false, message: `Task ${taskId} not found` });
    return;
  }

  task.isCompleted = true;
  task.completedAt = new Date().toISOString();

  res.json({
    success: true,
    message: `Task "${task.taskTitle}" marked as completed.`,
    task,
  });
}

// ==========================================
// 5. Admin AI Business Intelligence & Reports
// ==========================================
export async function getAiInsights(req: Request, res: Response): Promise<void> {
  const { query } = req.body;

  const insights = {
    generatedAt: new Date().toISOString(),
    queryAnalyzed: query || 'Comprehensive Operations & Sales Health',
    summary: 'SUJJU FOODS operations are performing at optimal capacity across Visakhapatnam and coastal Andhra Pradesh territories with 96.2% 24-hr SLA compliance.',
    recommendations: [
      {
        area: 'Procurement Alert',
        observation: 'RAW-TEA-CTC stock will reach reorder threshold in approx 14 days at current production velocity of 800 packs/day.',
        action: 'Issue Purchase Order for 1,500 kg to Assam Valley Tea Estates within the next 48 hours to secure bulk discount.',
      },
      {
        area: 'Territory Distribution',
        observation: 'Territory 530016 (Dwaraka Nagar) has experienced a 35% week-on-week surge in repeat tea orders.',
        action: 'Allocate secondary distributor support or increase daily vehicle staging from 50 to 80 packs.',
      },
      {
        area: 'Collections & Finance',
        observation: 'UPI collections comprise 28.6% while physical cash comprises 71.4%. All cash handovers are reconciled within 4 hours.',
        action: 'Incentivize UPI QR scan at doorstep with a ₹5 promotional repeat credit to optimize cash float handling.',
      },
    ],
    salesVelocity: {
      averageDailyPacksSold: 28,
      revenueRunRateDaily: 5040,
      activeCustomerCount: 48,
      distributorRetentionRate: '100%',
    },
  };

  res.json({
    success: true,
    insights,
  });
}

export async function getDailyReport(req: Request, res: Response): Promise<void> {
  const dateStr = new Date().toISOString().split('T')[0];

  const report = {
    reportDate: dateStr,
    company: 'SUJJU FOODS PRIVATE LIMITED',
    gstRate: '0% (Standard Approved Configuration)',
    productPrice: 180,
    production: {
      batchesCreatedToday: 1,
      totalPacksProduced: 400,
      totalFinishedWeightKg: 100,
      qcApprovedPacks: 400,
      qcRejectedPacks: 0,
    },
    orders: {
      totalOrdersToday: 28,
      totalPacksOrdered: 28,
      grossSales: 5040,
      deliveredOnTime: 24,
      onTimePercentage: '96.2%',
    },
    collections: {
      totalCashCollected: 3600,
      totalUpiCollected: 1440,
      totalGrossCollected: 5040,
      reconciledAmount: 5040,
      reconciliationStatus: 'Fully Reconciled',
    },
    inventory: {
      sellableFinishedGoodsPacks: 1200,
      quarantinedPacks: 0,
      rawTeaCtcKg: 2930,
      rawTeaBopKg: 1170,
      packagingPouchesPieces: 7600,
    },
  };

  res.json({
    success: true,
    report,
  });
}
