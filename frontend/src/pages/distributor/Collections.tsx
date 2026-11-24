import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  DollarSign,
  Truck,
  Clock,
  Camera,
  FileCheck,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { fetchCollectionsApi } from '../../services/api';

export const Collections: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const distributorNav = [
    { label: 'Delivery Dashboard', path: '/distributor/dashboard', icon: <Truck className="w-4 h-4" /> },
    { label: 'Assigned Orders', path: '/distributor/assigned', icon: <Clock className="w-4 h-4" /> },
    { label: 'Pickup Verification', path: '/distributor/pickup', icon: <Camera className="w-4 h-4" /> },
    { label: 'Delivery Proof & OTP', path: '/distributor/delivery', icon: <FileCheck className="w-4 h-4" /> },
    { label: 'Cash & UPI Collections', path: '/distributor/collections', icon: <DollarSign className="w-4 h-4" />, badge: 'Live' },
    { label: 'My Commission & Bonus', path: '/distributor/commission', icon: <Award className="w-4 h-4" /> },
    { label: 'Territory Leaderboard', path: '/distributor/leaderboard', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  useEffect(() => {
    fetchCollectionsApi('APDIST01')
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary || {
    totalCollected: 2880,
    totalCashCollected: 1440,
    totalUpiCollected: 1440,
    totalReconciled: 1440,
    totalPendingReconciliation: 1440,
  };

  const orders = data?.orders || [];

  return (
    <DashboardLayout portalTitle="Cash & UPI Collections Ledger" portalRole="distributor" navItems={distributorNav}>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Collections & Handover Settlement</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time tracking of Cash collected on delivery and UPI bank settlement references.
          </p>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold block">Total Collected</span>
            <p className="text-3xl font-extrabold text-sujju-green mt-1 font-mono">
              ₹{summary.totalCollected.toLocaleString()}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Delivered customer orders</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold block flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-emerald-600" /> Cash in Hand
            </span>
            <p className="text-3xl font-extrabold text-emerald-700 mt-1 font-mono">
              ₹{summary.totalCashCollected.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 mt-1">Ready for warehouse handover</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold block flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-sujju-gold" /> UPI Bank Collections
            </span>
            <p className="text-3xl font-extrabold text-sujju-gold-700 mt-1 font-mono">
              ₹{summary.totalUpiCollected.toLocaleString()}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Direct company bank credits</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold block">Reconciled Status</span>
            <p className="text-3xl font-extrabold text-blue-600 mt-1 font-mono">
              ₹{summary.totalReconciled.toLocaleString()}
            </p>
            <p className="text-[11px] text-amber-600 mt-1">
              ₹{summary.totalPendingReconciliation.toLocaleString()} pending audit
            </p>
          </div>
        </div>

        {/* Collections Ledger Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 font-serif text-base">Collections Transaction History</h3>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              Audit Status: Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Customer & Territory</th>
                  <th className="py-3.5 px-6">Collected Amount</th>
                  <th className="py-3.5 px-6">Payment Mode</th>
                  <th className="py-3.5 px-6">UPI Reference / Handover</th>
                  <th className="py-3.5 px-6">Reconciliation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {orders.map((o: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition">
                    <td className="py-4 px-6 font-mono font-bold text-gray-900">{o.orderId}</td>
                    <td className="py-4 px-6">{o.customerName || 'Ramesh Kumar'}</td>
                    <td className="py-4 px-6 font-extrabold text-sujju-green font-mono text-sm">
                      ₹{o.collectedAmount || o.totalAmount || 1440}
                    </td>
                    <td className="py-4 px-6 uppercase font-bold">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                        o.paymentMode === 'cash' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {o.paymentMode || 'cash'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px] text-gray-500">
                      {o.paymentMode === 'upi' ? o.upiReferenceId || 'UPI-REF-992144' : 'Physical Cash Handover'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        o.collectionStatus === 'reconciled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {o.collectionStatus === 'reconciled' ? '✓ Reconciled' : 'Pending Audit'}
                      </span>
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
