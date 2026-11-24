import { Router } from 'express';
import { lookupPincode } from '../controllers/pincodeController.js';
import { getProducts, getProductBySku } from '../controllers/productController.js';
import { submitContactEnquiry } from '../controllers/contactController.js';
import {
  sendOtp,
  verifyOtp,
  validateSponsorCode,
  registerCustomer,
  registerDistributor,
  login,
  resetPasswordWithOtp,
  getProfile,
} from '../controllers/authController.js';
import {
  calculateOrder,
  createOrder,
  getOrderById,
  getMyOrders,
  downloadInvoice,
} from '../controllers/orderController.js';
import {
  getAssignedOrders,
  acceptOrder,
  recordPickup,
  recordDispatch,
  recordDelivery,
  getDeliveryAlerts,
  reassignOrder,
} from '../controllers/deliveryController.js';
import {
  getCollections,
  reconcileCollection,
  getCommissionRules,
  updateCommissionRule,
  getDistributorCommission,
  getLeaderboard,
} from '../controllers/financeController.js';
import {
  getMaterials,
  getBillOfMaterials,
  createProductionOrder,
  getBatches,
  inspectBatchQC,
  getInventoryOverview,
  getSuppliers,
  createPurchaseOrder,
  receiveGoods,
} from '../controllers/manufacturingController.js';
import {
  verifyQrCode,
  createSubscription,
  getSubscriptions,
  updateSubscriptionStatus,
  createComplaint,
  getComplaints,
  resolveComplaint,
  checkInAttendance,
  checkOutAttendance,
  getAttendanceList,
  getEmployeeTasks,
  completeEmployeeTask,
  getAiInsights,
  getDailyReport,
} from '../controllers/advancedModulesController.js';
import {
  getNotificationHistory,
  triggerTestNotification,
} from '../controllers/notificationController.js';
import { handleCustomerChatbot } from '../controllers/chatbotController.js';
import {
  fetchAuditLogs,
  exportOrders,
  exportCollections,
  exportInventory,
  exportProduction,
} from '../controllers/exportController.js';
import {
  executeThreeHourOrderUpdates,
  jobRunHistory,
} from '../jobs/threeHourOrderUpdateJob.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';
import { requireAuth, requireRoles } from '../middleware/authMiddleware.js';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SUJJU FOODS Enterprise Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0-phase6',
  });
});

// Pincode & Serviceability
apiRouter.get('/pincode/:pincode', lookupPincode);

// Products
apiRouter.get('/products', getProducts);
apiRouter.get('/products/:sku', getProductBySku);

// Contact Enquiries
apiRouter.post('/contact', submitContactEnquiry);

// Authentication & OTP Verification
apiRouter.post('/auth/otp/send', sendOtp);
apiRouter.post('/auth/otp/verify', verifyOtp);
apiRouter.get('/auth/sponsor/validate', validateSponsorCode);
apiRouter.post('/auth/register/customer', registerCustomer);
apiRouter.post('/auth/register/distributor', registerDistributor);
apiRouter.post('/auth/login', login);
apiRouter.post('/auth/password/reset', resetPasswordWithOtp);
apiRouter.get('/auth/profile', requireAuth, getProfile);

// Customer Orders & Pricing Engine
apiRouter.post('/orders/calculate', calculateOrder);
apiRouter.post('/orders', createOrder);
apiRouter.get('/orders/customer/my-orders', getMyOrders);
apiRouter.get('/orders/:orderId', getOrderById);
apiRouter.get('/orders/:orderId/invoice', downloadInvoice);

// Distributor Operations & Delivery Lifecycle
apiRouter.get('/delivery/assigned', getAssignedOrders);
apiRouter.post('/delivery/:orderId/accept', acceptOrder);
apiRouter.post('/delivery/:orderId/pickup', recordPickup);
apiRouter.post('/delivery/:orderId/dispatch', recordDispatch);
apiRouter.post('/delivery/:orderId/deliver', recordDelivery);
apiRouter.get('/delivery/alerts', getDeliveryAlerts);
apiRouter.post('/delivery/:orderId/reassign', reassignOrder);

// Finance, Collections & Commission Engine
apiRouter.get('/finance/collections', getCollections);
apiRouter.post('/finance/collections/:orderId/reconcile', reconcileCollection);
apiRouter.get('/finance/commission/rules', getCommissionRules);
apiRouter.post('/finance/commission/rules', updateCommissionRule);
apiRouter.get('/finance/commission', getDistributorCommission);
apiRouter.get('/finance/leaderboard', getLeaderboard);

// Manufacturing, BOM, Inventory & Suppliers
apiRouter.get('/manufacturing/materials', getMaterials);
apiRouter.get('/manufacturing/bom', getBillOfMaterials);
apiRouter.post('/manufacturing/production/create', createProductionOrder);
apiRouter.get('/manufacturing/batches', getBatches);
apiRouter.post('/manufacturing/batches/:batchNumber/qc', inspectBatchQC);
apiRouter.get('/manufacturing/inventory', getInventoryOverview);
apiRouter.get('/manufacturing/suppliers', getSuppliers);
apiRouter.post('/manufacturing/purchases', createPurchaseOrder);
apiRouter.post('/manufacturing/purchases/:poNumber/receive', receiveGoods);

// Phase 7: Advanced Modules
// 1. QR Code Product Authentication
apiRouter.get('/qr/:batchNumber', verifyQrCode);

// 2. Customer Subscriptions
apiRouter.post('/subscriptions', createSubscription);
apiRouter.get('/subscriptions', getSubscriptions);
apiRouter.post('/subscriptions/:subId/status', updateSubscriptionStatus);

// 3. Customer Returns & Complaints
apiRouter.post('/complaints', createComplaint);
apiRouter.get('/complaints', getComplaints);
apiRouter.post('/complaints/:id/resolve', resolveComplaint);

// 4. Employee Attendance & Task Management
apiRouter.post('/employee/attendance/check-in', checkInAttendance);
apiRouter.post('/employee/attendance/check-out', checkOutAttendance);
apiRouter.get('/employee/attendance', getAttendanceList);
apiRouter.get('/employee/tasks', getEmployeeTasks);
apiRouter.post('/employee/tasks/:taskId/complete', completeEmployeeTask);

// 5. Admin AI Business Intelligence & Daily Reports
apiRouter.post('/admin/ai/insights', getAiInsights);
apiRouter.get('/admin/reports/daily', getDailyReport);

// Phase 8: Notifications, Customer Chatbot, Excel Exports & Audit Logs
// 1. WhatsApp & Email Notification Engine
apiRouter.get('/notifications/history', getNotificationHistory);
apiRouter.post('/notifications/test', triggerTestNotification);

// 2. Customer AI Chatbot
apiRouter.post('/chatbot/message', createRateLimiter(60000, 40), handleCustomerChatbot);

// 3. Immutable Audit Logs
apiRouter.get('/admin/audit-logs', fetchAuditLogs);

// 4. Excel / CSV Exports
apiRouter.get('/export/orders', exportOrders);
apiRouter.get('/export/collections', exportCollections);
apiRouter.get('/export/inventory', exportInventory);
apiRouter.get('/export/production', exportProduction);

// 5. 3-Hour Order Progress Background Update Engine
apiRouter.post('/jobs/order-progress-updates', async (req, res) => {
  const force = Boolean(req.body?.force);
  const result = await executeThreeHourOrderUpdates(force);
  res.json({ success: true, result });
});

apiRouter.get('/jobs/order-progress-updates', (req, res) => {
  res.json({ success: true, history: jobRunHistory });
});

// Role-Guarded Admin Routes
apiRouter.get('/admin/overview', requireAuth, requireRoles('super_admin', 'operations_admin', 'finance_admin'), (req, res) => {
  res.json({ success: true, message: 'Admin dashboard access authorized' });
});
