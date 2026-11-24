import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sujju_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface PincodeInfo {
  pincode: string;
  city: string;
  district: string;
  state: string;
  country: string;
  isServiceable: boolean;
  deliveryPromise?: string;
}

export const checkPincode = async (pincode: string): Promise<PincodeInfo> => {
  const res = await api.get(`/pincode/${pincode}`);
  return res.data;
};

export const fetchProducts = async () => {
  const res = await api.get('/products');
  return res.data.data;
};

export const submitContact = async (data: {
  name: string;
  phone: string;
  email: string;
  purpose: string;
  message: string;
}) => {
  const res = await api.post('/contact', data);
  return res.data;
};

export const calculateOrder = async (quantity: number) => {
  const res = await api.post('/orders/calculate', { quantity });
  return res.data.data;
};

export const createOrderApi = async (orderData: any) => {
  const res = await api.post('/orders', orderData);
  return res.data;
};

export const fetchMyOrdersApi = async () => {
  const res = await api.get('/orders/customer/my-orders');
  return res.data;
};

export const fetchOrderByIdApi = async (orderId: string) => {
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
};

export const validateSponsor = async (code: string) => {
  const res = await api.get(`/auth/sponsor/validate?code=${encodeURIComponent(code)}`);
  return res.data;
};

export const sendOtpApi = async (target: string, type: 'phone' | 'email') => {
  const res = await api.post('/auth/otp/send', { target, type });
  return res.data;
};

export const verifyOtpApi = async (target: string, type: 'phone' | 'email', otp: string) => {
  const res = await api.post('/auth/otp/verify', { target, type, otp });
  return res.data;
};

export const registerCustomerApi = async (data: any) => {
  const res = await api.post('/auth/register/customer', data);
  return res.data;
};

export const registerDistributorApi = async (data: any) => {
  const res = await api.post('/auth/register/distributor', data);
  return res.data;
};

export const loginApi = async (data: { identifier: string; password: string }) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const resetPasswordApi = async (data: any) => {
  const res = await api.post('/auth/password/reset', data);
  return res.data;
};

// Delivery APIs
export const fetchAssignedDeliveriesApi = async (distributorId?: string) => {
  const res = await api.get(`/delivery/assigned${distributorId ? `?distributorId=${distributorId}` : ''}`);
  return res.data;
};

export const acceptDeliveryApi = async (orderId: string, accepted: boolean, reason?: string) => {
  const res = await api.post(`/delivery/${orderId}/accept`, { accepted, reason });
  return res.data;
};

export const submitPickupProofApi = async (orderId: string, data: { photoUrl: string; latitude?: number; longitude?: number }) => {
  const res = await api.post(`/delivery/${orderId}/pickup`, data);
  return res.data;
};

export const submitDispatchProofApi = async (orderId: string, data: { photoUrl: string; latitude?: number; longitude?: number }) => {
  const res = await api.post(`/delivery/${orderId}/dispatch`, data);
  return res.data;
};

export const submitDeliveryProofApi = async (orderId: string, data: {
  deliveryOtp: string;
  photoUrl: string;
  latitude?: number;
  longitude?: number;
  paymentMode: 'cash' | 'upi';
  collectedAmount: number;
  upiReferenceId?: string;
  authorizedException?: boolean;
}) => {
  const res = await api.post(`/delivery/${orderId}/deliver`, data);
  return res.data;
};

export const fetchDeliveryAlertsApi = async () => {
  const res = await api.get('/delivery/alerts');
  return res.data;
};

// Phase 5: Finance & Commission APIs
export const fetchCollectionsApi = async (distributorId?: string) => {
  const res = await api.get(`/finance/collections${distributorId ? `?distributorId=${distributorId}` : ''}`);
  return res.data;
};

export const reconcileCollectionApi = async (orderId: string, notes?: string) => {
  const res = await api.post(`/finance/collections/${orderId}/reconcile`, { notes });
  return res.data;
};

export const fetchCommissionApi = async (distributorId?: string) => {
  const res = await api.get(`/finance/commission${distributorId ? `?distributorId=${distributorId}` : ''}`);
  return res.data;
};

export const fetchLeaderboardApi = async () => {
  const res = await api.get('/finance/leaderboard');
  return res.data;
};

// Phase 6: Manufacturing, Inventory & Suppliers APIs
export const fetchMaterialsApi = async () => {
  const res = await api.get('/manufacturing/materials');
  return res.data;
};

export const fetchBomApi = async () => {
  const res = await api.get('/manufacturing/bom');
  return res.data;
};

export const createProductionOrderApi = async (plannedQuantityPacks: number) => {
  const res = await api.post('/manufacturing/production/create', { plannedQuantityPacks });
  return res.data;
};

export const fetchBatchesApi = async () => {
  const res = await api.get('/manufacturing/batches');
  return res.data;
};

export const inspectBatchQcApi = async (
  batchNumber: string,
  data: {
    inspectedBy: string;
    moisturePercentage: number;
    liquorScoreOutOf10: number;
    sealIntegrityPassed: boolean;
    remarks: string;
    approved: boolean;
  }
) => {
  const res = await api.post(`/manufacturing/batches/${batchNumber}/qc`, data);
  return res.data;
};

export const fetchInventoryOverviewApi = async () => {
  const res = await api.get('/manufacturing/inventory');
  return res.data;
};

export const fetchSuppliersApi = async () => {
  const res = await api.get('/manufacturing/suppliers');
  return res.data;
};

export const createPurchaseOrderApi = async (data: {
  supplierId: string;
  materialCode: string;
  orderedQuantity: number;
}) => {
  const res = await api.post('/manufacturing/purchases', data);
  return res.data;
};

export const receiveGoodsApi = async (poNumber: string, acceptedQuantity: number) => {
  const res = await api.post(`/manufacturing/purchases/${poNumber}/receive`, { acceptedQuantity });
  return res.data;
};

// Phase 7: Advanced Modules APIs
export const verifyQrApi = async (batchNumber: string) => {
  const res = await api.get(`/qr/${encodeURIComponent(batchNumber)}`);
  return res.data;
};

export const fetchSubscriptionsApi = async () => {
  const res = await api.get('/subscriptions');
  return res.data;
};

export const createSubscriptionApi = async (data: any) => {
  const res = await api.post('/subscriptions', data);
  return res.data;
};

export const updateSubscriptionStatusApi = async (subId: string, status: 'active' | 'paused' | 'cancelled') => {
  const res = await api.post(`/subscriptions/${subId}/status`, { status });
  return res.data;
};

export const fetchComplaintsApi = async () => {
  const res = await api.get('/complaints');
  return res.data;
};

export const createComplaintApi = async (data: any) => {
  const res = await api.post('/complaints', data);
  return res.data;
};

export const resolveComplaintApi = async (id: string, data: { resolutionStatus: string; resolutionNotes?: string }) => {
  const res = await api.post(`/complaints/${id}/resolve`, data);
  return res.data;
};

export const checkInAttendanceApi = async (data: any) => {
  const res = await api.post('/employee/attendance/check-in', data);
  return res.data;
};

export const checkOutAttendanceApi = async (employeeId?: string) => {
  const res = await api.post('/employee/attendance/check-out', { employeeId });
  return res.data;
};

export const fetchAttendanceApi = async () => {
  const res = await api.get('/employee/attendance');
  return res.data;
};

export const fetchEmployeeTasksApi = async () => {
  const res = await api.get('/employee/tasks');
  return res.data;
};

export const completeEmployeeTaskApi = async (taskId: string) => {
  const res = await api.post(`/employee/tasks/${taskId}/complete`);
  return res.data;
};

export const fetchAiInsightsApi = async (query?: string) => {
  const res = await api.post('/admin/ai/insights', { query });
  return res.data;
};

export const fetchDailyReportApi = async () => {
  const res = await api.get('/admin/reports/daily');
  return res.data;
};

// Phase 8: Customer Chatbot & Export APIs
export const sendCustomerChatMessageApi = async (message: string, context?: any) => {
  const res = await api.post('/chatbot/message', { message, ...context });
  return res.data;
};

export const fetchNotificationHistoryApi = async () => {
  const res = await api.get('/notifications/history');
  return res.data;
};

export const fetchAuditLogsApi = async () => {
  const res = await api.get('/admin/audit-logs');
  return res.data;
};

export const getExportUrl = (type: 'orders' | 'collections' | 'inventory' | 'production') => {
  return `/api/v1/export/${type}`;
};



