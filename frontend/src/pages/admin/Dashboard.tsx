import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  Layers,
  Factory,
  CheckSquare,
  DollarSign,
  TrendingUp,
  FileText,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const adminNav = [
    { label: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Customers', path: '/admin/customers', icon: <Users className="w-4 h-4" /> },
    { label: 'Distributors', path: '/admin/distributors', icon: <Truck className="w-4 h-4" />, badge: '3 Pending' },
    { label: 'Sponsor Network', path: '/admin/sponsors', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Orders & Dispatch', path: '/admin/orders', icon: <Package className="w-4 h-4" />, badge: '12 Active' },
    { label: 'Manufacturing & Batches', path: '/admin/manufacturing', icon: <Factory className="w-4 h-4" /> },
    { label: 'Raw Material Inventory', path: '/admin/inventory', icon: <Layers className="w-4 h-4" /> },
    { label: 'Collections & Reconciliation', path: '/admin/collections', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Commission Engine', path: '/admin/commission', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'A4 Invoices & Reports', path: '/admin/reports', icon: <FileText className="w-4 h-4" /> },
  ];

  const kpis = [
    { label: "Today's Orders", value: '28 Packs', sub: '₹5,040 Gross Sales', icon: <Package className="w-5 h-5 text-sujju-green" /> },
    { label: 'Delivered (24-Hr SLA)', value: '24 Orders', sub: '96.2% On-Time Delivery', icon: <Truck className="w-5 h-5 text-emerald-600" /> },
    { label: 'Collections Today', value: '₹5,040', sub: 'Cash: ₹3,600 | UPI: ₹1,440', icon: <DollarSign className="w-5 h-5 text-sujju-gold-700" /> },
    { label: 'Active Distributors', value: '14 Active', sub: 'Andhra Pradesh Territories', icon: <Users className="w-5 h-5 text-blue-600" /> },
    { label: 'Manufacturing Output', value: '800 Packs', sub: 'Batch SF-B24-108 (Approved)', icon: <Factory className="w-5 h-5 text-purple-600" /> },
    { label: 'Commission Accrued', value: '₹560', sub: 'Reconciled Delivered Orders', icon: <CheckSquare className="w-5 h-5 text-amber-600" /> },
  ];

  return (
    <DashboardLayout portalTitle="Admin Command Center" portalRole="admin" navItems={adminNav}>
      <div className="space-y-8">
        {/* Top Header Banner */}
        <div className="sujju-gradient rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-sujju-gold text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Real-Time Enterprise Operations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
              SUJJU FOODS Management Hub
            </h2>
            <p className="text-xs text-sujju-green-200 mt-1">
              Live monitoring of manufacturing batches, distributor delivery SLAs, cash/UPI collections, and sponsor attribution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-white/10 border border-white/20 text-xs px-4 py-2 rounded-xl text-white font-medium">
              Tax Rule: <strong>0% GST Approved</strong>
            </span>
            <span className="bg-sujju-gold text-sujju-green-950 text-xs px-4 py-2 rounded-xl font-bold shadow">
              Rate: ₹180 / 250g
            </span>
          </div>
        </div>

        {/* Operational KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">{kpi.label}</span>
                <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">{kpi.icon}</div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900 mt-2 font-mono">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Live Orders & 24-Hr SLA Tracker */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 font-serif">Recent Orders & Assignment Queue</h3>
              <p className="text-xs text-gray-500 mt-0.5">Automated routing with 24-hour delivery SLA monitoring.</p>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              Auto-Assignment: Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Customer & Territory</th>
                  <th className="py-3.5 px-6">Quantity & Amount</th>
                  <th className="py-3.5 px-6">Assigned Distributor</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">SLA Countdown</th>
                  <th className="py-3.5 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {[
                  {
                    id: 'SF-2026-894120',
                    customer: 'Ramesh Kumar (530016)',
                    items: '8 Packs (250g)',
                    amount: '₹1,440 (No GST)',
                    distributor: 'Vijay Dist (APDIST01)',
                    status: 'Accepted by Distributor',
                    statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
                    sla: '21h 45m remaining',
                  },
                  {
                    id: 'SF-2026-894119',
                    customer: 'Srinivas Rao (520001)',
                    items: '4 Packs (250g)',
                    amount: '₹720 (No GST)',
                    distributor: 'Krishna Agency (APDIST04)',
                    status: 'Out for Delivery',
                    statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
                    sla: '14h 10m remaining',
                  },
                  {
                    id: 'SF-2026-894118',
                    customer: 'Prasad Raju (522001)',
                    items: '8 Packs (250g)',
                    amount: '₹1,440 (No GST)',
                    distributor: 'Guntur Tea Hub (APDIST02)',
                    status: 'Delivered & Collected',
                    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    sla: 'Delivered in 7h 20m',
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/80 transition">
                    <td className="py-4 px-6 font-bold text-gray-900 font-mono">{row.id}</td>
                    <td className="py-4 px-6">{row.customer}</td>
                    <td className="py-4 px-6 font-bold text-sujju-green">{row.amount} <span className="text-[10px] text-gray-400 block">{row.items}</span></td>
                    <td className="py-4 px-6">{row.distributor}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-mono text-[11px]">{row.sla}</td>
                    <td className="py-4 px-6">
                      <button className="text-sujju-green hover:underline font-bold text-xs">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
