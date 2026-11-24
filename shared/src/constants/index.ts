export const BRAND_CONFIG = {
  name: 'SUJJU FOODS',
  tagline: 'Purest Farm-Fresh Premium Tea Powder',
  foundedYear: 2024,
  headquarters: 'Andhra Pradesh, India',
  supportEmail: 'support@sujjufoods.com',
  supportPhone: '+91 98765 43210',
  whatsappNumber: '+91 98765 43210',
  primaryColor: '#174A36',
  secondaryColor: '#C69A48',
  backgroundColor: '#FAF8F1',
};

export const INITIAL_PRODUCT = {
  id: 'prod_tea_powder_250g',
  name: 'SUJJU FOODS Tea Powder',
  packSize: '250 grams',
  unitWeightGrams: 250,
  unitPrice: 180, // In Rupees
  currency: 'INR',
  gstPercentage: 0, // Current approved configuration: NO GST
  hsnCode: '09024020',
  description: 'Premium rich aromatic CTC and orthodox blend sourced from authentic tea plantations. Delivers authentic golden-amber colour, strong liquor and unmatched refreshing taste in every single cup.',
  inStock: true,
};

export const ORDER_STATUSES = {
  PLACED: 'Order Placed',
  CONFIRMED: 'Order Confirmed',
  DISTRIBUTOR_ASSIGNED: 'Distributor Assigned',
  ACCEPTED_BY_DISTRIBUTOR: 'Accepted by Distributor',
  PICKED_UP: 'Picked Up',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  DELIVERY_ATTEMPTED: 'Delivery Attempted',
  RETURNED: 'Returned',
  CANCELLED: 'Cancelled',
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  OPERATIONS_ADMIN: 'operations_admin',
  FINANCE_ADMIN: 'finance_admin',
  CONTENT_MANAGER: 'content_manager',
  CUSTOMER: 'customer',
  DISTRIBUTOR: 'distributor',
  EMPLOYEE: 'employee',
} as const;

export const PAYMENT_MODES = {
  CASH: 'cash',
  UPI: 'upi',
} as const;

export const COLLECTION_STATUSES = {
  PENDING: 'pending',
  COLLECTED: 'collected',
  RECONCILED: 'reconciled',
  DISPUTED: 'disputed',
} as const;

export const BATCH_STATUSES = {
  PLANNED: 'planned',
  IN_PRODUCTION: 'in_production',
  QC_PENDING: 'qc_pending',
  QC_APPROVED: 'qc_approved',
  QC_REJECTED: 'qc_rejected',
  RECALLED: 'recalled',
} as const;

export const SLA_RULES = {
  DELIVERY_TARGET_HOURS: 24,
  MAX_HOURS_WITHOUT_STATUS_UPDATE: 3,
  DISTRIBUTOR_ACCEPTANCE_TIMEOUT_MINUTES: 30,
};
