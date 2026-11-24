import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Factory,
  Layers,
  CheckCircle,
  AlertTriangle,
  Play,
  ClipboardCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Package,
  CheckSquare,
  FileText,
  DollarSign,
  Truck,
  Users,
  LayoutDashboard
} from 'lucide-react';
import {
  fetchBomApi,
  fetchBatchesApi,
  createProductionOrderApi,
  inspectBatchQcApi,
} from '../../services/api';

export const Manufacturing: React.FC = () => {
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

  const [batches, setBatches] = useState<any[]>([]);
  const [bom, setBom] = useState<any>(null);
  const [plannedPacks, setPlannedPacks] = useState<number>(400);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // QC Modal state
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);
  const [qcForm, setQcForm] = useState({
    inspectedBy: 'Chief QC Chemist',
    moisturePercentage: 5.4,
    liquorScoreOutOf10: 8.5,
    sealIntegrityPassed: true,
    remarks: 'Complies with FSSAI moisture and organoleptic liquor aroma standards.',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [bomRes, batchRes] = await Promise.all([fetchBomApi(), fetchBatchesApi()]);
      if (bomRes?.bom) setBom(bomRes.bom);
      if (batchRes?.batches) setBatches(batchRes.batches);
    } catch (err: any) {
      console.error('Failed to load manufacturing data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartProduction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (plannedPacks <= 0) return;
    try {
      setActionLoading(true);
      setStatusMessage(null);
      const res = await createProductionOrderApi(plannedPacks);
      if (res?.success) {
        setStatusMessage({ type: 'success', text: res.message });
        await loadData();
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Production failed' });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.response?.data?.message || 'Error executing production run',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleQcSubmit = async (approved: boolean) => {
    if (!selectedBatch) return;
    try {
      setActionLoading(true);
      setStatusMessage(null);
      const res = await inspectBatchQcApi(selectedBatch.batchNumber, {
        ...qcForm,
        approved,
      });
      if (res?.success) {
        setStatusMessage({ type: 'success', text: res.message });
        setSelectedBatch(null);
        await loadData();
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'QC evaluation failed' });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.response?.data?.message || 'QC verification failed',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Live BOM Calculations
  const calcWeightKg = (plannedPacks * 250) / 1000;
  const calcCtcKg = (calcWeightKg * 0.7).toFixed(1);
  const calcBopKg = (calcWeightKg * 0.3).toFixed(1);

  return (
    <DashboardLayout portalTitle="Manufacturing & Batch Management" portalRole="admin" navItems={adminNav}>
      <div className="space-y-8">
        {/* Header */}
        <div className="sujju-gradient rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-sujju-gold text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Plant Floor Operations & FSSAI Standards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Tea Processing & Batch Execution
            </h2>
            <p className="text-xs text-sujju-green-200 mt-1">
              Automatic raw inventory deduction, statutory batch numbering, and compulsory Quality Control (QC) gating.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-white/10 border border-white/20 text-xs px-4 py-2 rounded-xl text-white font-medium">
              Formula: <strong>70% CTC + 30% BOP</strong>
            </span>
            <span className="bg-sujju-gold text-sujju-green-950 text-xs px-4 py-2 rounded-xl font-bold shadow">
              QC Benchmark: &lt;6.5% Moisture
            </span>
          </div>
        </div>

        {/* Notification Alert */}
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

        {/* Two-Column Layout: Start Production Run + Active BOM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Start Production Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-sujju-green" />
                <h3 className="text-lg font-bold text-gray-900">Initiate Production Batch Run</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                Mandatory QC Gate
              </span>
            </div>

            <form onSubmit={handleStartProduction} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Planned Quantity (Finished 250g Pouches)
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    min="40"
                    step="20"
                    value={plannedPacks}
                    onChange={(e) => setPlannedPacks(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sujju-green focus:outline-none font-semibold text-lg"
                    placeholder="Enter planned packs (e.g. 400)"
                  />
                  <button
                    type="submit"
                    disabled={actionLoading || plannedPacks <= 0}
                    className="flex-shrink-0 bg-sujju-green hover:bg-sujju-green-800 text-white font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{actionLoading ? 'Processing...' : 'Run Production'}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Bill of Materials Consumption Preview */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Automatic Material Consumption Forecast:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="block text-xs text-gray-500">Finished Weight</span>
                    <span className="text-sm font-extrabold text-sujju-green">{calcWeightKg} kg</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="block text-xs text-gray-500">CTC Tea (70%)</span>
                    <span className="text-sm font-extrabold text-gray-900">{calcCtcKg} kg</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="block text-xs text-gray-500">BOP Tea (30%)</span>
                    <span className="text-sm font-extrabold text-gray-900">{calcBopKg} kg</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="block text-xs text-gray-500">250g Pouches</span>
                    <span className="text-sm font-extrabold text-gray-900">{plannedPacks} pcs</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  * Raw materials are deducted from inventory upon dispatching the production order. Resulting batch is placed in quarantine until QC approval.
                </p>
              </div>
            </form>
          </div>

          {/* Standard Bill of Materials (BOM) Reference */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <Layers className="w-5 h-5 text-sujju-gold-700" />
                <h3 className="text-lg font-bold text-gray-900">Standard Formula (BOM)</h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Approved standard blend for <strong>SUJJU FOODS Tea Powder (250g)</strong> per 100 kg batch (400 packs).
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs p-2 bg-emerald-50 text-emerald-950 rounded-lg">
                  <span className="font-semibold">CTC Black Granules</span>
                  <span className="font-bold">70 kg (70%)</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2 bg-blue-50 text-blue-950 rounded-lg">
                  <span className="font-semibold">Orthodox BOP Leaf</span>
                  <span className="font-bold">30 kg (30%)</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2 bg-purple-50 text-purple-950 rounded-lg">
                  <span className="font-semibold">Barrier Foil Pouches</span>
                  <span className="font-bold">400 pieces</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2 bg-amber-50 text-amber-950 rounded-lg">
                  <span className="font-semibold">Corrugated Cartons</span>
                  <span className="font-bold">8 boxes</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Standard Batch Basis:</span>
              <strong className="text-gray-900">100 kg / 400 packs</strong>
            </div>
          </div>
        </div>

        {/* Production Batches Ledger */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Production Batches & QC Gate</h3>
              <p className="text-xs text-gray-500 mt-1">
                Batches remain blocked from sellable inventory until certified by Quality Control.
              </p>
            </div>
            <button
              onClick={loadData}
              className="text-xs font-semibold px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700"
            >
              Refresh Batches
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-4">Batch Number</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4">Mfg / Expiry</th>
                  <th className="px-6 py-4 text-center">QC Status</th>
                  <th className="px-6 py-4 text-center">Sellable</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {batches.map((batch) => (
                  <tr key={batch.batchNumber} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">
                      {batch.batchNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{batch.productName}</div>
                      <div className="text-xs text-gray-400">{batch.rawMaterialConsumedKg} kg consumed</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-gray-900">{batch.actualQuantityPacks}</span>
                      <span className="text-xs text-gray-500"> packs</span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div>Mfg: {new Date(batch.manufacturingDate).toLocaleDateString()}</div>
                      <div className="text-gray-400">Exp: {new Date(batch.bestBeforeDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {batch.qcStatus === 'qc_approved' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          QC Approved
                        </span>
                      )}
                      {batch.qcStatus === 'qc_pending' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          QC Pending
                        </span>
                      )}
                      {batch.qcStatus === 'qc_rejected' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800">
                          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                          Quarantined
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {batch.isSellableInventory ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          Blocked
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {batch.qcStatus === 'qc_pending' ? (
                        <button
                          onClick={() => setSelectedBatch(batch)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-sujju-green hover:bg-sujju-green-800 text-white rounded-lg transition"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5" />
                          Inspect QC
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedBatch(batch)}
                          className="text-xs font-semibold text-gray-500 hover:text-gray-900 underline"
                        >
                          View Inspection
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quality Control (QC) Modal */}
        {selectedBatch && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-sujju-green" />
                  <h3 className="text-xl font-bold text-gray-900">
                    QC Inspection: {selectedBatch.batchNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <strong>FSSAI Inspection Rule:</strong> Moisture percentage must be strictly &lt;6.5%, seal integrity must pass without micro-leaks, and liquor sensory score must be &ge;7.0 / 10.
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Inspected By (Chemist / Officer)
                  </label>
                  <input
                    type="text"
                    value={qcForm.inspectedBy}
                    onChange={(e) => setQcForm({ ...qcForm, inspectedBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Moisture Content (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={qcForm.moisturePercentage}
                      onChange={(e) =>
                        setQcForm({ ...qcForm, moisturePercentage: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-semibold"
                    />
                    <span className="text-[10px] text-gray-500">Benchmark: &lt; 6.5%</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Liquor Score (/10)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="10"
                      value={qcForm.liquorScoreOutOf10}
                      onChange={(e) =>
                        setQcForm({ ...qcForm, liquorScoreOutOf10: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-semibold"
                    />
                    <span className="text-[10px] text-gray-500">Benchmark: &ge; 7.0</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    id="sealCheck"
                    checked={qcForm.sealIntegrityPassed}
                    onChange={(e) => setQcForm({ ...qcForm, sealIntegrityPassed: e.target.checked })}
                    className="w-4 h-4 text-sujju-green rounded focus:ring-sujju-green"
                  />
                  <label htmlFor="sealCheck" className="text-xs font-semibold text-gray-800">
                    250g Pouch Seal & Barrier Integrity Passed (Zero Leaks)
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    QC Sensory Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={qcForm.remarks}
                    onChange={(e) => setQcForm({ ...qcForm, remarks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleQcSubmit(false)}
                    className="flex-1 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition"
                  >
                    Reject / Quarantine
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleQcSubmit(true)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition shadow"
                  >
                    {actionLoading ? 'Approving...' : 'Approve & Release to Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
