import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Award,
  Truck,
  Clock,
  Camera,
  FileCheck,
  DollarSign,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { fetchCommissionApi } from '../../services/api';

export const Commission: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const distributorNav = [
    { label: 'Delivery Dashboard', path: '/distributor/dashboard', icon: <Truck className="w-4 h-4" /> },
    { label: 'Assigned Orders', path: '/distributor/assigned', icon: <Clock className="w-4 h-4" /> },
    { label: 'Pickup Verification', path: '/distributor/pickup', icon: <Camera className="w-4 h-4" /> },
    { label: 'Delivery Proof & OTP', path: '/distributor/delivery', icon: <FileCheck className="w-4 h-4" /> },
    { label: 'Cash & UPI Collections', path: '/distributor/collections', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'My Commission & Bonus', path: '/distributor/commission', icon: <Award className="w-4 h-4" />, badge: 'Earned' },
    { label: 'Territory Leaderboard', path: '/distributor/leaderboard', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  useEffect(() => {
    fetchCommissionApi('APDIST01')
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary || {
    totalDeliveredPacks: 16,
    estimatedCommission: 160,
    approvedCommission: 160,
    targetBonusEarned: 0,
    totalPayableCommission: 160,
  };

  const rule = data?.activeRule || {
    rate: 20,
    minPacksMonthlyBonusThreshold: 100,
    monthlyBonusAmount: 2000,
  };

  const ledger = data?.ledger || [
    {
      orderId: 'SF-2026-894120',
      date: new Date(),
      packs: 8,
      orderAmount: 1440,
      commissionRate: '₹20/pack',
      commissionAmount: 160,
      status: 'Approved',
    },
    {
      orderId: 'SF-2026-894121',
      date: new Date(),
      packs: 8,
      orderAmount: 1440,
      commissionRate: '₹20/pack',
      commissionAmount: 160,
      status: 'Pending Reconciliation',
    },
  ];

  return (
    <DashboardLayout portalTitle="Distributor Commission & Statements" portalRole="distributor" navItems={distributorNav}>
      <div className="space-y-8">
        {/* Banner */}
        <div className="sujju-gradient text-white rounded-3xl p-6 sm:p-8 border border-sujju-green-900 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-sujju-gold text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Performance Earnings</span>
            </div>
            <h2 className="text-2xl font-bold font-serif">Commission & Incentives Statement</h2>
            <p className="text-xs text-sujju-green-200 mt-1">
              Commission Policy: <strong>₹{rule.rate} per 250g pack</strong> on eligible delivered & reconciled orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-sujju-gold text-sujju-green-950 font-extrabold text-sm px-4 py-2 rounded-xl shadow">
              Rate: ₹{rule.rate} / pack
            </span>
          </div>
        </div>

        {/* Earnings KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold block">Approved Commission</span>
            <p className="text-3xl font-extrabold text-sujju-green mt-1 font-mono">
              ₹{summary.approvedCommission.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 mt-1">Reconciled and ready for bank payout</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold block">Estimated (Pending Audit)</span>
            <p className="text-3xl font-extrabold text-amber-600 mt-1 font-mono">
              ₹{summary.estimatedCommission.toLocaleString()}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Awaiting cash/UPI settlement</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold block">Monthly Target Bonus (100 Packs)</span>
            <p className="text-3xl font-extrabold text-sujju-gold-700 mt-1 font-mono">
              ₹{summary.targetBonusEarned > 0 ? `₹${summary.targetBonusEarned}` : '₹0 / ₹2,000'}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              {summary.totalDeliveredPacks} / {rule.minPacksMonthlyBonusThreshold} packs achieved this month
            </p>
          </div>
        </div>

        {/* Ledger */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 font-serif text-base">Delivered Orders Commission Ledger</h3>
            <span className="text-xs text-gray-500">Period: Current Month</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Delivered Packs</th>
                  <th className="py-3.5 px-6">Order Total</th>
                  <th className="py-3.5 px-6">Commission Rate</th>
                  <th className="py-3.5 px-6">Commission Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {ledger.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition">
                    <td className="py-4 px-6 font-mono font-bold text-gray-900">{row.orderId}</td>
                    <td className="py-4 px-6">{row.packs} Packs (250g)</td>
                    <td className="py-4 px-6">₹{row.orderAmount}</td>
                    <td className="py-4 px-6 font-semibold text-gray-700">{row.commissionRate}</td>
                    <td className="py-4 px-6 font-extrabold text-sujju-green font-mono text-sm">
                      ₹{row.commissionAmount}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        row.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {row.status}
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
