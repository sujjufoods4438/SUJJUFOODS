import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Calendar,
  Clock,
  PlusCircle,
  PauseCircle,
  PlayCircle,
  XCircle,
  CheckCircle,
  Sparkles,
  RefreshCw,
  Package,
  Layers,
  FileText,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import {
  fetchSubscriptionsApi,
  createSubscriptionApi,
  updateSubscriptionStatusApi,
} from '../../services/api';

export const Subscriptions: React.FC = () => {
  const customerNav = [
    { label: 'Overview', path: '/customer/dashboard', icon: <Package className="w-4 h-4" /> },
    { label: 'New Order', path: '/customer/new-order', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'Order History', path: '/customer/orders', icon: <Clock className="w-4 h-4" /> },
    { label: 'Live Tracking', path: '/customer/tracking', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Subscriptions', path: '/customer/subscriptions', icon: <RefreshCw className="w-4 h-4" /> },
    { label: 'Tax Invoices', path: '/customer/invoices', icon: <FileText className="w-4 h-4" /> },
    { label: 'Support & Complaints', path: '/customer/complaints', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Subscription Form State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    frequency: 'monthly',
    quantityPacks: 4,
    deliveryPincode: '530016',
    deliveryAddress: 'Dwaraka Nagar, Visakhapatnam, Andhra Pradesh',
    customerPhone: '+91 98480 12345',
    paymentMode: 'cash',
  });

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await fetchSubscriptionsApi();
      if (res?.success) {
        setSubscriptions(res.subscriptions);
      }
    } catch (err) {
      console.error('Failed to load subscriptions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setStatusMsg(null);
      const res = await createSubscriptionApi(formData);
      if (res?.success) {
        setStatusMsg({ type: 'success', text: res.message });
        setShowModal(false);
        await loadSubscriptions();
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Subscription failed' });
      }
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Error creating subscription',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (subId: string, newStatus: 'active' | 'paused' | 'cancelled') => {
    try {
      setActionLoading(true);
      setStatusMsg(null);
      const res = await updateSubscriptionStatusApi(subId, newStatus);
      if (res?.success) {
        setStatusMsg({ type: 'success', text: res.message });
        await loadSubscriptions();
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Failed to update subscription status' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout portalTitle="Tea Subscriptions" portalRole="customer" navItems={customerNav}>
      <div className="space-y-8">
        {/* Header */}
        <div className="sujju-gradient rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-sujju-gold text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Never Run Out of Premium Tea</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Automated Tea Replenishments
            </h2>
            <p className="text-xs text-sujju-green-200 mt-1">
              Enjoy uninterrupted mornings with scheduled doorstep delivery every week, fortnight, or month.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-sujju-gold hover:bg-sujju-gold-600 text-sujju-green-950 font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow text-sm self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-sujju-green" />
                    <span className="font-mono text-xs font-bold text-gray-500">{sub.id}</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      sub.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : sub.status === 'paused'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {sub.status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-lg font-bold text-gray-900">
                    {sub.quantityPacks} Packs (250g) • Every {sub.frequency}
                  </div>
                  <div className="text-xs text-gray-500">
                    Total: <strong className="text-gray-900">₹{sub.totalPerDelivery}</strong> per delivery (₹180/pack, 0% GST)
                  </div>
                  <div className="text-xs text-gray-500">
                    Next Delivery: <strong className="text-sujju-green font-bold">{sub.nextDeliveryDate}</strong>
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    Address: {sub.deliveryAddress} ({sub.deliveryPincode})
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Payment: <strong>{sub.paymentMode.toUpperCase()} on Delivery</strong></span>

                <div className="flex items-center gap-2">
                  {sub.status === 'active' ? (
                    <button
                      onClick={() => handleStatusChange(sub.id, 'paused')}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-amber-300 text-amber-700 hover:bg-amber-50 rounded-lg transition"
                    >
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </button>
                  ) : sub.status === 'paused' ? (
                    <button
                      onClick={() => handleStatusChange(sub.id, 'active')}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-emerald-600 text-white rounded-lg transition"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Resume</span>
                    </button>
                  ) : null}

                  {sub.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(sub.id, 'cancelled')}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Create Subscription */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Subscribe to SUJJU FOODS Tea</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 font-bold">✕</button>
              </div>

              <form onSubmit={handleCreate} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                  >
                    <option value="weekly">Weekly (Every 7 Days)</option>
                    <option value="biweekly">Bi-Weekly (Every 14 Days)</option>
                    <option value="monthly">Monthly (Every 30 Days)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Packs Per Delivery (250g each @ ₹180)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.quantityPacks}
                    onChange={(e) =>
                      setFormData({ ...formData, quantityPacks: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-semibold"
                  />
                  <span className="text-[11px] text-gray-500">
                    Total: ₹{formData.quantityPacks * 180} per delivery
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Delivery Address & Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm mb-2"
                  />
                  <input
                    type="text"
                    value={formData.deliveryPincode}
                    onChange={(e) => setFormData({ ...formData, deliveryPincode: e.target.value })}
                    placeholder="Pincode (e.g. 530016)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Payment Preference
                  </label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                  >
                    <option value="cash">Cash on Delivery (Handover to Territory Distributor)</option>
                    <option value="upi">Doorstep UPI QR Code Scan</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 py-2 bg-sujju-green hover:bg-sujju-green-800 text-white rounded-xl text-sm font-bold shadow"
                  >
                    {actionLoading ? 'Activating...' : 'Confirm Subscription'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
