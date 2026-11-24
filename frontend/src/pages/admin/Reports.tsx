import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Sparkles,
  CheckCircle,
  Truck,
  Package,
  Layers,
  DollarSign,
  LayoutDashboard,
  Users,
  Factory,
  CheckSquare
} from 'lucide-react';
import { fetchDailyReportApi } from '../../services/api';

export const Reports: React.FC = () => {
  const adminNav = [
    { label: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Customers', path: '/admin/customers', icon: <Users className="w-4 h-4" /> },
    { label: 'Distributors', path: '/admin/distributors', icon: <Truck className="w-4 h-4" /> },
    { label: 'Orders & Dispatch', path: '/admin/orders', icon: <Package className="w-4 h-4" /> },
    { label: 'Manufacturing & Batches', path: '/admin/manufacturing', icon: <Factory className="w-4 h-4" /> },
    { label: 'Raw Material Inventory', path: '/admin/inventory', icon: <Layers className="w-4 h-4" /> },
    { label: 'Suppliers & POs', path: '/admin/suppliers', icon: <Truck className="w-4 h-4" /> },
    { label: 'Collections & Reconciliation', path: '/admin/collections', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Daily Reports', path: '/admin/reports', icon: <FileText className="w-4 h-4" /> },
  ];

  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadReport = async () => {
    try {
      setLoading(true);
      const res = await fetchDailyReportApi();
      if (res?.success) {
        setReport(res.report);
      }
    } catch (err) {
      console.error('Failed to load daily report', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout portalTitle="Executive Operational Reports" portalRole="admin" navItems={adminNav}>
      <div className="space-y-8">
        {/* Header */}
        <div className="sujju-gradient rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg print:hidden">
          <div>
            <div className="flex items-center gap-2 text-sujju-gold text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Consolidated Executive Ledger</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Daily Operational & Financial Report
            </h2>
            <p className="text-xs text-sujju-green-200 mt-1">
              Print-ready executive summary encompassing plant production, orders, deliveries, and reconciled collections.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/api/v1/export/orders"
              download
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3.5 py-2 rounded-xl text-white font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-sujju-gold" />
              <span>Orders CSV</span>
            </a>
            <a
              href="/api/v1/export/collections"
              download
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3.5 py-2 rounded-xl text-white font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-sujju-gold" />
              <span>Collections CSV</span>
            </a>
            <a
              href="/api/v1/export/inventory"
              download
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3.5 py-2 rounded-xl text-white font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-sujju-gold" />
              <span>Inventory CSV</span>
            </a>
            <button
              onClick={handlePrint}
              className="bg-sujju-gold hover:bg-sujju-gold-600 text-sujju-green-950 text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print A4</span>
            </button>
          </div>
        </div>

        {/* Report Paper Card (Print Friendly) */}
        {report && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 sm:p-10 space-y-8">
            {/* Letterhead */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 gap-4">
              <div>
                <h1 className="text-2xl font-black font-serif text-sujju-green tracking-wide">
                  SUJJU FOODS PRIVATE LIMITED
                </h1>
                <div className="text-xs text-gray-500 mt-1">
                  Visakhapatnam Industrial Corridor, Andhra Pradesh - 530016
                </div>
                <div className="text-xs text-gray-500">
                  FSSAI Lic: <strong>10123999000123</strong> | Tax Configuration: <strong>0% GST Approved</strong>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase font-bold text-gray-400">Report Date</span>
                <div className="text-lg font-bold text-gray-900">{report.reportDate}</div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Production */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase">
                  <Factory className="w-4 h-4 text-sujju-green" />
                  <span>Plant Production Run</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Batches Produced:</span>
                    <strong className="text-gray-900">{report.production.batchesCreatedToday}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Packs Finished:</span>
                    <strong className="text-gray-900">{report.production.totalPacksProduced} packs</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Weight Yield:</span>
                    <strong className="text-gray-900">{report.production.totalFinishedWeightKg} kg</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">QC Status:</span>
                    <strong className="text-emerald-700 font-bold">{report.production.qcApprovedPacks} Approved (0 Rejected)</strong>
                  </div>
                </div>
              </div>

              {/* Order Deliveries & SLA */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Orders & 24h SLA Delivery</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Orders Dispatched:</span>
                    <strong className="text-gray-900">{report.orders.totalOrdersToday} orders</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Pack Volume:</span>
                    <strong className="text-gray-900">{report.orders.totalPacksOrdered} packs</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Gross Invoiced:</span>
                    <strong className="text-gray-900">₹{report.orders.grossSales}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">SLA Performance:</span>
                    <strong className="text-emerald-700 font-bold">{report.orders.onTimePercentage} On-Time</strong>
                  </div>
                </div>
              </div>

              {/* Collections & Reconciliation */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase">
                  <DollarSign className="w-4 h-4 text-sujju-gold-700" />
                  <span>Collections & Finance</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Physical Cash:</span>
                    <strong className="text-gray-900">₹{report.collections.totalCashCollected}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Doorstep UPI:</span>
                    <strong className="text-gray-900">₹{report.collections.totalUpiCollected}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Gross Collections:</span>
                    <strong className="text-gray-900">₹{report.collections.totalGrossCollected}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Reconciliation:</span>
                    <strong className="text-emerald-700 font-bold">{report.collections.reconciliationStatus}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Closing Stock */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Closing Warehouse Stock Balances
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                  <span className="text-xs text-emerald-800">Sellable 250g Packs</span>
                  <div className="text-lg font-black text-emerald-950 mt-0.5">
                    {report.inventory.sellableFinishedGoodsPacks}
                  </div>
                </div>
                <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                  <span className="text-xs text-blue-800">Raw CTC Tea Leaf</span>
                  <div className="text-lg font-black text-blue-950 mt-0.5">
                    {report.inventory.rawTeaCtcKg} kg
                  </div>
                </div>
                <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-100">
                  <span className="text-xs text-purple-800">Raw BOP Tea Leaf</span>
                  <div className="text-lg font-black text-purple-950 mt-0.5">
                    {report.inventory.rawTeaBopKg} kg
                  </div>
                </div>
                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100">
                  <span className="text-xs text-amber-800">250g Packaging Foil</span>
                  <div className="text-lg font-black text-amber-950 mt-0.5">
                    {report.inventory.packagingPouchesPieces} pcs
                  </div>
                </div>
              </div>
            </div>

            {/* Signature & Compliance Sign-off */}
            <div className="pt-8 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
              <div>
                Prepared By: <strong>Automated ERP System</strong>
              </div>
              <div>
                Approved By: <strong>Managing Director, SUJJU FOODS</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
