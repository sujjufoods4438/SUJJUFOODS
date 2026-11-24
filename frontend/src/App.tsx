import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Products } from './pages/public/Products';
import { Gallery } from './pages/public/Gallery';
import { Contact } from './pages/public/Contact';
import { QRVerification } from './pages/public/QRVerification';
import { Login } from './pages/auth/Login';
import { CustomerRegister } from './pages/auth/CustomerRegister';
import { DistributorRegister } from './pages/auth/DistributorRegister';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Manufacturing } from './pages/admin/Manufacturing';
import { Inventory } from './pages/admin/Inventory';
import { Suppliers } from './pages/admin/Suppliers';
import { AIAnalytics } from './pages/admin/AIAnalytics';
import { Reports } from './pages/admin/Reports';
import { CustomerDashboard } from './pages/customer/Dashboard';
import { NewOrder } from './pages/customer/NewOrder';
import { OrderHistory } from './pages/customer/OrderHistory';
import { OrderTracking } from './pages/customer/OrderTracking';
import { Invoices } from './pages/customer/Invoices';
import { Subscriptions } from './pages/customer/Subscriptions';
import { Complaints } from './pages/customer/Complaints';
import { DistributorDashboard } from './pages/distributor/Dashboard';
import { AssignedOrders } from './pages/distributor/AssignedOrders';
import { PickupProof } from './pages/distributor/PickupProof';
import { DeliveryProof } from './pages/distributor/DeliveryProof';
import { Collections } from './pages/distributor/Collections';
import { Commission } from './pages/distributor/Commission';
import { Leaderboard } from './pages/distributor/Leaderboard';
import { EmployeeDashboard } from './pages/employee/Dashboard';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/verify" element={<QRVerification />} />
            <Route path="/verify/:batchNumber" element={<QRVerification />} />
            <Route path="/login" element={<Login />} />
            <Route path="/customer/register" element={<CustomerRegister />} />
            <Route path="/distributor/register" element={<DistributorRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Customer Portal Routes */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/new-order" element={<NewOrder />} />
          <Route path="/customer/orders" element={<OrderHistory />} />
          <Route path="/customer/tracking" element={<OrderTracking />} />
          <Route path="/customer/invoices" element={<Invoices />} />
          <Route path="/customer/subscriptions" element={<Subscriptions />} />
          <Route path="/customer/complaints" element={<Complaints />} />

          {/* Distributor Portal Routes */}
          <Route path="/distributor/dashboard" element={<DistributorDashboard />} />
          <Route path="/distributor/assigned" element={<AssignedOrders />} />
          <Route path="/distributor/pickup" element={<PickupProof />} />
          <Route path="/distributor/delivery" element={<DeliveryProof />} />
          <Route path="/distributor/collections" element={<Collections />} />
          <Route path="/distributor/commission" element={<Commission />} />
          <Route path="/distributor/leaderboard" element={<Leaderboard />} />

          {/* Admin & Employee Portals */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manufacturing" element={<Manufacturing />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/suppliers" element={<Suppliers />} />
          <Route path="/admin/ai-analytics" element={<AIAnalytics />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
