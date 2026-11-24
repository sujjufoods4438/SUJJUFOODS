import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Share2,
  FileText,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerDashboard: React.FC = () => {
  const customerNav = [
    { label: 'My Dashboard', path: '/customer/dashboard', icon: <Package className="w-4 h-4" /> },
    { label: 'Place New Order', path: '/customer/new-order', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Order History', path: '/customer/orders', icon: <Clock className="w-4 h-4" /> },
    { label: 'Track Delivery', path: '/customer/tracking', icon: <Truck className="w-4 h-4" />, badge: 'Active' },
    { label: 'Invoices (A4 PDF)', path: '/customer/invoices', icon: <FileText className="w-4 h-4" /> },
    { label: 'My Referral Code', path: '/customer/referrals', icon: <Share2 className="w-4 h-4" /> },
    { label: 'Delivery Addresses', path: '/customer/addresses', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout portalTitle="Customer Dashboard" portalRole="customer" navItems={customerNav}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sujju-cream-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-sujju-gold uppercase tracking-wider block">
              Welcome Back
            </span>
            <h2 className="text-2xl font-bold text-sujju-green-950 font-serif mt-1">
              Hello, Ramesh Kumar
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Delivery Territory: <strong>Visakhapatnam (530016)</strong> | Account Status: <strong className="text-emerald-600">Active</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-sujju-cream-100 border border-sujju-cream-300 px-4 py-2.5 rounded-2xl text-xs">
              <span className="text-gray-500 block">My Referral Code:</span>
              <strong className="text-sujju-green font-mono text-sm tracking-wider">SUJJU-CUST-8821</strong>
            </div>

            <Link
              to="/products"
              className="bg-sujju-green hover:bg-sujju-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-sujju-gold" />
              <span>Order Tea Packets</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold">Active Orders</span>
            <p className="text-3xl font-extrabold text-sujju-green mt-2 font-mono">1 Order</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Target delivery within 24 hours</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold">Total Delivered Orders</span>
            <p className="text-3xl font-extrabold text-gray-900 mt-2 font-mono">12 Packs</p>
            <p className="text-xs text-gray-500 mt-1">₹2,160 Total Purchase (No GST)</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold">Referred Friends</span>
            <p className="text-3xl font-extrabold text-sujju-gold-700 mt-2 font-mono">4 Customers</p>
            <p className="text-xs text-gray-500 mt-1">Share your code to earn reward privileges</p>
          </div>
        </div>

        {/* Current Order Tracking Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <span className="text-xs font-semibold text-sujju-green uppercase">Live Active Order</span>
              <h3 className="text-xl font-bold text-gray-900 font-serif">Order #SF-2026-894120</h3>
              <p className="text-xs text-gray-500 mt-0.5">Placed on 24 Nov 2026 • Assigned to local partner</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-sujju-green font-mono">₹1,440</span>
              <span className="text-xs text-gray-500 block">8 pieces × ₹180 | 0% GST</span>
            </div>
          </div>

          {/* Visual Tracking Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
            {[
              { title: 'Order Placed', time: '10:15 AM', done: true },
              { title: 'Confirmed', time: '10:18 AM', done: true },
              { title: 'Distributor Assigned', time: '10:25 AM', done: true },
              { title: 'Out for Delivery', time: 'In Progress', active: true },
              { title: 'Delivered & Paid', time: 'Pending Delivery', done: false },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                  step.done ? 'bg-sujju-green text-white' : step.active ? 'bg-sujju-gold text-sujju-green-950 animate-pulse' : 'bg-gray-200 text-gray-500'
                }`}>
                  {idx + 1}
                </div>
                <span className="font-bold text-xs text-gray-900">{step.title}</span>
                <span className="text-[10px] text-gray-500 mt-0.5">{step.time}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-sujju-cream-100 rounded-2xl border border-sujju-cream-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-sujju-green-950">Assigned Delivery Partner: Vijay Agency (+91 98765 00123)</p>
              <p className="text-gray-500 mt-0.5">Please keep ₹1,440 ready in Cash or UPI QR upon delivery.</p>
            </div>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition">
              Download A4 Invoice PDF
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
