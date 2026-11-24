import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  TrendingUp,
  Award,
  Truck,
  Clock,
  Camera,
  FileCheck,
  DollarSign,
  Trophy,
  Medal,
  Star,
} from 'lucide-react';
import { fetchLeaderboardApi } from '../../services/api';

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const distributorNav = [
    { label: 'Delivery Dashboard', path: '/distributor/dashboard', icon: <Truck className="w-4 h-4" /> },
    { label: 'Assigned Orders', path: '/distributor/assigned', icon: <Clock className="w-4 h-4" /> },
    { label: 'Pickup Verification', path: '/distributor/pickup', icon: <Camera className="w-4 h-4" /> },
    { label: 'Delivery Proof & OTP', path: '/distributor/delivery', icon: <FileCheck className="w-4 h-4" /> },
    { label: 'Cash & UPI Collections', path: '/distributor/collections', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'My Commission & Bonus', path: '/distributor/commission', icon: <Award className="w-4 h-4" /> },
    { label: 'Territory Leaderboard', path: '/distributor/leaderboard', icon: <TrendingUp className="w-4 h-4" />, badge: 'Rankings' },
  ];

  useEffect(() => {
    fetchLeaderboardApi()
      .then((res) => setLeaderboard(res.leaderboard || []))
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout portalTitle="Territory Distributor Leaderboard" portalRole="distributor" navItems={distributorNav}>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Andhra Pradesh Territory Rankings</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Leaderboard evaluated on delivered order volume, on-time 24-hr SLA compliance, and collection integrity.
          </p>
        </div>

        {/* Podium Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {leaderboard.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border shadow-sm text-center relative overflow-hidden ${
                item.rank === 1
                  ? 'bg-gradient-to-b from-amber-50 to-white border-sujju-gold/50 ring-2 ring-sujju-gold/20'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md font-extrabold text-lg bg-white border">
                {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
              </div>

              <span className="text-[10px] uppercase tracking-widest font-bold text-sujju-gold block">
                {item.badge}
              </span>
              <h3 className="text-lg font-bold text-gray-900 font-serif mt-0.5">{item.distributorName}</h3>
              <p className="text-xs text-gray-500">{item.territory}</p>

              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Delivered Packs</span>
                  <strong className="text-sujju-green font-mono text-base">{item.deliveredPacks}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">SLA On-Time</span>
                  <strong className="text-emerald-700 font-mono text-base">{item.slaComplianceRate}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 font-serif text-base">Territory Performance Standings</h3>
            <span className="text-xs font-semibold text-gray-500">Updated Hourly</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b">
                <tr>
                  <th className="py-3.5 px-6">Rank</th>
                  <th className="py-3.5 px-6">Distributor & Territory</th>
                  <th className="py-3.5 px-6">Delivered Orders</th>
                  <th className="py-3.5 px-6">Delivered Packs (250g)</th>
                  <th className="py-3.5 px-6">Reconciled Sales</th>
                  <th className="py-3.5 px-6">24h SLA Compliance</th>
                  <th className="py-3.5 px-6">Partner Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {leaderboard.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition">
                    <td className="py-4 px-6 font-bold text-gray-900 font-mono text-sm">
                      #{row.rank}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900 block">{row.distributorName}</span>
                      <span className="text-[10px] text-gray-400">{row.territory}</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-800">{row.deliveredOrders} Orders</td>
                    <td className="py-4 px-6 font-mono font-bold text-sujju-green">{row.deliveredPacks} Packs</td>
                    <td className="py-4 px-6 font-mono font-bold">₹{row.reconciledSales.toLocaleString()}</td>
                    <td className="py-4 px-6 font-mono text-emerald-700 font-bold">{row.slaComplianceRate}%</td>
                    <td className="py-4 px-6">
                      <span className="bg-sujju-gold/20 text-sujju-gold-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {row.badge}
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
