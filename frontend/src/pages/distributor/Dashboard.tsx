import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Truck,
  CheckCircle2,
  Clock,
  DollarSign,
  Camera,
  MapPin,
  TrendingUp,
  FileCheck,
  Award,
  AlertCircle,
} from 'lucide-react';

export const DistributorDashboard: React.FC = () => {
  const distributorNav = [
    { label: 'Delivery Dashboard', path: '/distributor/dashboard', icon: <Truck className="w-4 h-4" /> },
    { label: 'Assigned Orders', path: '/distributor/assigned', icon: <Clock className="w-4 h-4" />, badge: '3 Due' },
    { label: 'Pickup Verification', path: '/distributor/pickup', icon: <Camera className="w-4 h-4" /> },
    { label: 'Delivery Proof & OTP', path: '/distributor/delivery', icon: <FileCheck className="w-4 h-4" /> },
    { label: 'Cash & UPI Collections', path: '/distributor/collections', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'My Commission & Bonus', path: '/distributor/commission', icon: <Award className="w-4 h-4" /> },
    { label: 'Territory Leaderboard', path: '/distributor/leaderboard', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout portalTitle="Distributor Delivery Operations" portalRole="distributor" navItems={distributorNav}>
      <div className="space-y-8">
        {/* Territory Status Header */}
        <div className="bg-sujju-green-950 text-white p-6 sm:p-8 rounded-3xl border border-sujju-green-900 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-sujju-gold uppercase tracking-wider block">
              Authorized Territory Distributor
            </span>
            <h2 className="text-2xl font-bold font-serif mt-1">Vijay Agencies (APDIST01)</h2>
            <p className="text-xs text-sujju-green-200 mt-1">
              Assigned Territories: <strong>530001, 530002, 530016 (Visakhapatnam Zone)</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-sujju-green-900 border border-sujju-green-700 px-4 py-2 rounded-xl text-xs text-sujju-gold font-semibold">
              Sponsor ID: SUJJU001
            </span>
            <span className="bg-sujju-gold text-sujju-green-950 px-4 py-2 rounded-xl text-xs font-bold shadow">
              Operational Status: Active
            </span>
          </div>
        </div>

        {/* Distributor Operations KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold">Assigned Deliveries</span>
            <p className="text-3xl font-extrabold text-sujju-green mt-2 font-mono">3 Orders</p>
            <p className="text-xs text-amber-600 font-medium mt-1">Target delivery within 24 hrs</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold">Delivered Today</span>
            <p className="text-3xl font-extrabold text-emerald-600 mt-2 font-mono">5 Orders</p>
            <p className="text-xs text-gray-500 mt-1">100% SLA compliance</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold">Collections in Hand</span>
            <p className="text-3xl font-extrabold text-sujju-gold-700 mt-2 font-mono">₹4,320</p>
            <p className="text-xs text-gray-500 mt-1">Cash: ₹2,880 | UPI: ₹1,440</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold">Commission Earned</span>
            <p className="text-3xl font-extrabold text-blue-600 mt-2 font-mono">₹480</p>
            <p className="text-xs text-gray-500 mt-1">Pending reconciliation</p>
          </div>
        </div>

        {/* Assigned Orders Action List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 font-serif">Orders Awaiting Action</h3>
              <p className="text-xs text-gray-500 mt-0.5">Update pickup and capture customer delivery OTP with GPS proof.</p>
            </div>
            <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-3 py-1 rounded-full border border-amber-200">
              3-Hour Update Rule: 1hr remaining
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'SF-2026-894120',
                customer: 'Ramesh Kumar',
                phone: '+91 98765 12345',
                address: 'D.No 4-52/1, Dwaraka Nagar, Visakhapatnam (530016)',
                quantity: '8 Packs (250g)',
                amount: '₹1,440',
                status: 'Accepted',
                action: 'Start Pickup Proof',
              },
              {
                id: 'SF-2026-894121',
                customer: 'Venkat Rao',
                phone: '+91 98765 44321',
                address: 'Flat 302, Siripuram, Visakhapatnam (530020)',
                quantity: '4 Packs (250g)',
                amount: '₹720',
                status: 'Out for Delivery',
                action: 'Submit Delivery Proof & OTP',
              },
            ].map((order, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-sujju-green transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900 font-mono">{order.id}</span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{order.status}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-800">{order.customer} ({order.phone})</p>
                  <p className="text-xs text-gray-500">{order.address}</p>
                  <p className="text-xs font-bold text-sujju-green pt-1">Collection Amount: {order.amount} ({order.quantity})</p>
                </div>

                <div className="flex items-center gap-3">
                  <button className="bg-sujju-green hover:bg-sujju-green-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition">
                    {order.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
