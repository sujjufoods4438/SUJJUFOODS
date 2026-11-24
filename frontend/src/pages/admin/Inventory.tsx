import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Layers,
  Package,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Truck,
  Factory,
  CheckSquare,
  DollarSign,
  Users,
  LayoutDashboard
} from 'lucide-react';
import { fetchInventoryOverviewApi } from '../../services/api';

export const Inventory: React.FC = () => {
  const adminNav = [
    { label: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Customers', path: '/admin/customers', icon: <Users className="w-4 h-4" /> },
    { label: 'Distributors', path: '/admin/distributors', icon: <Truck className="w-4 h-4" /> },
    { label: 'Orders & Dispatch', path: '/admin/orders', icon: <Package className="w-4 h-4" /> },
    { label: 'Manufacturing & Batches', path: '/admin/manufacturing', icon: <Factory className="w-4 h-4" /> },
    { label: 'Raw Material Inventory', path: '/admin/inventory', icon: <Layers className="w-4 h-4" /> },
    { label: 'Suppliers & POs', path: '/admin/suppliers', icon: <Truck className="w-4 h-4" /> },
    { label: 'Collections & Reconciliation', path: '/admin/collections', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Commission Engine', path: '/admin/commission', icon: <CheckSquare className="w-4 h-4" /> },
  ];

  const [inventory, setInventory] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await fetchInventoryOverviewApi();
      if (res?.success) {
        setInventory(res);
      }
    } catch (err) {
      console.error('Failed to load inventory data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  return (
    <DashboardLayout portalTitle="Inventory Management" portalRole="admin" navItems={adminNav}>
      <div className="space-y-8">
        {/* Header */}
        <div className="sujju-gradient rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-sujju-gold text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Multi-Stage Stock Balance Ledger</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Raw Materials & Finished Goods Stock
            </h2>
            <p className="text-xs text-sujju-green-200 mt-1">
              Strict partition between sellable finished goods, quarantine QC stock, and raw estate procurement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadInventory}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Stock</span>
            </button>
            <span className="bg-sujju-gold text-sujju-green-950 text-xs px-4 py-2 rounded-xl font-bold shadow">
              Rate: ₹180 / Pack
            </span>
          </div>
        </div>

        {/* Finished Goods Spotlight */}
        {inventory?.finishedGoods && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-sujju-green" />
                <h3 className="text-lg font-bold text-gray-900">Finished Goods Master: 250g Tea Pouches</h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                0% GST Enforced
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <span className="text-xs font-semibold text-emerald-800">Sellable In-Stock</span>
                <div className="text-2xl font-extrabold text-emerald-900 mt-1">
                  {inventory.finishedGoods.sellableAvailablePacks} <span className="text-xs font-medium">packs</span>
                </div>
                <span className="text-[11px] text-emerald-700">QC Approved & Available to Dispatch</span>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                <span className="text-xs font-semibold text-amber-800">Quarantine / QC Pending</span>
                <div className="text-2xl font-extrabold text-amber-900 mt-1">
                  {inventory.finishedGoods.pendingQcPacks} <span className="text-xs font-medium">packs</span>
                </div>
                <span className="text-[11px] text-amber-700">Cannot be dispatched until approved</span>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <span className="text-xs font-semibold text-blue-800">Transit Reserved</span>
                <div className="text-2xl font-extrabold text-blue-900 mt-1">
                  {inventory.finishedGoods.reservedPacks} <span className="text-xs font-medium">packs</span>
                </div>
                <span className="text-[11px] text-blue-700">Assigned to territory distributors</span>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                <span className="text-xs font-semibold text-purple-800">Dispatched & Delivered</span>
                <div className="text-2xl font-extrabold text-purple-900 mt-1">
                  {inventory.finishedGoods.dispatchedPacks} <span className="text-xs font-medium">packs</span>
                </div>
                <span className="text-[11px] text-purple-700">Handed over to verified customers</span>
              </div>
            </div>
          </div>
        )}

        {/* Low Stock Warning Banner (if any) */}
        {inventory?.lowStockAlerts && inventory.lowStockAlerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="text-xs text-amber-900">
              <strong>Procurement Reorder Alert:</strong> The following materials are at or below reorder threshold:{' '}
              {inventory.lowStockAlerts.map((m: any) => `${m.name} (${m.currentStock} ${m.unit})`).join(', ')}.
            </div>
          </div>
        )}

        {/* Raw Materials & Packaging Ledger */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Raw Tea & Packaging Stock Ledger</h3>
              <p className="text-xs text-gray-500 mt-1">
                Real-time stock balance updated automatically by Production Runs and Supplier Goods Receipts (GRN).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-4">Item Code</th>
                  <th className="px-6 py-4">Material Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Default Supplier</th>
                  <th className="px-6 py-4 text-center">Current Stock</th>
                  <th className="px-6 py-4 text-center">Reorder Threshold</th>
                  <th className="px-6 py-4 text-right">Unit Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventory?.rawMaterials?.map((item: any) => {
                  const isLow = item.currentStock <= item.reorderThreshold;
                  return (
                    <tr key={item.code} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            item.category === 'raw_material'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.category === 'raw_material' ? 'Raw Tea Leaf' : 'Packaging'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-700">
                        {item.supplier}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-extrabold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.currentStock}
                        </span>{' '}
                        <span className="text-xs text-gray-500">{item.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-xs text-gray-500">
                        {item.reorderThreshold} {item.unit}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        ₹{item.unitCost} / {item.unit}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
