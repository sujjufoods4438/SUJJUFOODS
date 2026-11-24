import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  FileText,
  ShoppingBag,
  Share2,
} from 'lucide-react';

export const OrderTracking: React.FC = () => {
  const customerNav = [
    { label: 'My Dashboard', path: '/customer/dashboard', icon: <Clock className="w-4 h-4" /> },
    { label: 'Place New Order', path: '/customer/new-order', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Order History', path: '/customer/orders', icon: <Clock className="w-4 h-4" /> },
    { label: 'Track Delivery', path: '/customer/tracking', icon: <Truck className="w-4 h-4" /> },
    { label: 'Invoices (A4 PDF)', path: '/customer/invoices', icon: <FileText className="w-4 h-4" /> },
    { label: 'My Referral Code', path: '/customer/referrals', icon: <Share2 className="w-4 h-4" /> },
  ];

  const statuses = [
    { title: '1. Order Placed', time: 'Today, 10:15 AM', done: true },
    { title: '2. Order Confirmed', time: 'Today, 10:18 AM', done: true },
    { title: '3. Distributor Assigned', time: 'Today, 10:25 AM', done: true, desc: 'Assigned to Vijay Agencies (Visakhapatnam)' },
    { title: '4. Accepted by Distributor', time: 'Today, 10:35 AM', done: true },
    { title: '5. Picked Up', time: 'Today, 11:10 AM', done: true, desc: 'Package scanned & verified at central unit' },
    { title: '6. Out for Delivery', time: 'In Transit', active: true, desc: 'Delivery partner en route with consignment' },
    { title: '7. Delivered', time: 'Target within 24 hours', done: false },
  ];

  return (
    <DashboardLayout portalTitle="Live Delivery Tracking" portalRole="customer" navItems={customerNav}>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Tracking Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
            <div>
              <span className="text-xs font-bold text-sujju-gold uppercase tracking-wider block">
                24-Hour SLA Delivery Monitor
              </span>
              <h2 className="text-2xl font-bold text-gray-900 font-serif mt-1">
                Order #SF-2026-894120
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">8 Packs (250g) • Total: ₹1,440 (0% GST)</p>
            </div>

            <div className="text-right">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                SLA: On Time (21h remaining)
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
            {statuses.map((s, idx) => (
              <div key={idx} className="flex items-start gap-4 relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 z-10 ${
                    s.done
                      ? 'bg-sujju-green text-white shadow'
                      : s.active
                      ? 'bg-sujju-gold text-sujju-green-950 font-extrabold ring-4 ring-sujju-gold-100 animate-pulse'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {s.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-bold ${s.active ? 'text-sujju-green-950' : 'text-gray-800'}`}>
                      {s.title}
                    </h4>
                    <span className="text-[11px] text-gray-400 font-mono">{s.time}</span>
                  </div>
                  {s.desc && <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Partner Info */}
          <div className="p-5 rounded-2xl bg-sujju-cream-100 border border-sujju-cream-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-sujju-green-950">Assigned Territory Distributor:</p>
              <p className="text-gray-700">Vijay Agencies (ID: APDIST01)</p>
              <p className="text-gray-500">Contact: +91 98765 00123</p>
            </div>

            <a
              href="/api/v1/orders/SF-2026-894120/invoice"
              target="_blank"
              rel="noreferrer"
              className="bg-white border border-gray-300 text-gray-800 font-bold px-4 py-2 rounded-xl text-xs hover:bg-gray-50 transition text-center shadow-sm"
            >
              Download Tax Invoice (A4 PDF)
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
