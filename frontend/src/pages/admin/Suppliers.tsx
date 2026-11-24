import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Truck,
  PlusCircle,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Building,
  Mail,
  Phone,
  Package,
  Layers,
  Factory,
  CheckSquare,
  DollarSign,
  Users,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import {
  fetchSuppliersApi,
  fetchMaterialsApi,
  createPurchaseOrderApi,
  receiveGoodsApi,
} from '../../services/api';

export const Suppliers: React.FC = () => {
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

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New PO Form State
  const [poForm, setPoForm] = useState({
    supplierId: 'SUP-001',
    materialCode: 'RAW-TEA-CTC',
    orderedQuantity: 500,
  });

  // Goods Receipt (GRN) Form State
  const [grnForm, setGrnForm] = useState({
    poNumber: 'PO-2026-081',
    acceptedQuantity: 500,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [supRes, matRes] = await Promise.all([fetchSuppliersApi(), fetchMaterialsApi()]);
      if (supRes?.suppliers) setSuppliers(supRes.suppliers);
      if (matRes?.materials) setMaterials(matRes.materials);
    } catch (err) {
      console.error('Failed to load suppliers data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setStatusMessage(null);
      const res = await createPurchaseOrderApi(poForm);
      if (res?.success) {
        setStatusMessage({ type: 'success', text: res.message });
        setGrnForm({ ...grnForm, poNumber: res.po.poNumber, acceptedQuantity: res.po.orderedQuantity });
        await loadData();
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'PO creation failed' });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.response?.data?.message || 'Error generating Purchase Order',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReceiveGoods = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setStatusMessage(null);
      const res = await receiveGoodsApi(grnForm.poNumber, grnForm.acceptedQuantity);
      if (res?.success) {
        setStatusMessage({ type: 'success', text: res.message });
        await loadData();
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Goods receipt failed' });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.response?.data?.message || 'Error logging Goods Receipt Note (GRN)',
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout portalTitle="Suppliers & Procurement" portalRole="admin" navItems={adminNav}>
      <div className="space-y-8">
        {/* Header */}
        <div className="sujju-gradient rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-sujju-gold text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Procurement & Inward Logistics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Supplier Management & Purchase Orders
            </h2>
            <p className="text-xs text-sujju-green-200 mt-1">
              Issue formal purchase orders, manage Assam & Nilgiri tea suppliers, and credit stock via Goods Receipt (GRN).
            </p>
          </div>
        </div>

        {/* Alert Notification */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* 2-Column Section: Create Purchase Order + Goods Receipt (GRN) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Purchase Order */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <PlusCircle className="w-5 h-5 text-sujju-green" />
              <h3 className="text-lg font-bold text-gray-900">Issue New Purchase Order (PO)</h3>
            </div>

            <form onSubmit={handleCreatePo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Select Supplier
                </label>
                <select
                  value={poForm.supplierId}
                  onChange={(e) => setPoForm({ ...poForm, supplierId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.paymentTerms})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Material Code
                </label>
                <select
                  value={poForm.materialCode}
                  onChange={(e) => setPoForm({ ...poForm, materialCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                >
                  {materials.map((m) => (
                    <option key={m.code} value={m.code}>
                      {m.code} - {m.name} (₹{m.unitCost}/{m.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Ordered Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={poForm.orderedQuantity}
                  onChange={(e) =>
                    setPoForm({ ...poForm, orderedQuantity: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-2.5 bg-sujju-green hover:bg-sujju-green-800 text-white font-bold rounded-xl transition shadow"
              >
                {actionLoading ? 'Issuing...' : 'Generate Purchase Order'}
              </button>
            </form>
          </div>

          {/* Goods Receipt Note (GRN) Inward Entry */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <FileCheck className="w-5 h-5 text-sujju-gold-700" />
              <h3 className="text-lg font-bold text-gray-900">Goods Receipt Note (GRN) Inward</h3>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Upon physical weighment and delivery at the factory warehouse, record accepted quantity to credit raw inventory.
            </p>

            <form onSubmit={handleReceiveGoods} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  PO Number
                </label>
                <input
                  type="text"
                  value={grnForm.poNumber}
                  onChange={(e) => setGrnForm({ ...grnForm, poNumber: e.target.value })}
                  placeholder="e.g. PO-2026-081"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Accepted Quantity Received
                </label>
                <input
                  type="number"
                  min="1"
                  value={grnForm.acceptedQuantity}
                  onChange={(e) =>
                    setGrnForm({ ...grnForm, acceptedQuantity: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                Credits raw stock balance ledger immediately and updates PO status to completed.
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow"
              >
                {actionLoading ? 'Recording...' : 'Record Goods Receipt (GRN)'}
              </button>
            </form>
          </div>
        </div>

        {/* Suppliers Directory */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Registered Estate & Packaging Suppliers</h3>
            <p className="text-xs text-gray-500 mt-1">
              Active vendor relationships, payment covenants, and material supply authorizations.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-4">Supplier Name</th>
                  <th className="px-6 py-4">Contact Person</th>
                  <th className="px-6 py-4">Phone / Email</th>
                  <th className="px-6 py-4">Materials Supplied</th>
                  <th className="px-6 py-4">Payment Terms</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {suppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{sup.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{sup.id}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium">{sup.contactPerson}</td>
                    <td className="px-6 py-4 text-xs">
                      <div>{sup.phone}</div>
                      <div className="text-gray-400">{sup.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {sup.materialsSupplied?.map((mat: string) => (
                        <span
                          key={mat}
                          className="inline-block text-xs font-mono font-bold px-2 py-0.5 bg-gray-100 text-gray-800 rounded mr-1"
                        >
                          {mat}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                      {sup.paymentTerms}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        {sup.status}
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
