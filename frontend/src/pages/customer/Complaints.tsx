import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  PlusCircle,
  HelpCircle,
  Sparkles,
  Package,
  Calendar,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { fetchComplaintsApi, createComplaintApi } from '../../services/api';

export const Complaints: React.FC = () => {
  const customerNav = [
    { label: 'Overview', path: '/customer/dashboard', icon: <Package className="w-4 h-4" /> },
    { label: 'New Order', path: '/customer/new-order', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'Order History', path: '/customer/orders', icon: <Clock className="w-4 h-4" /> },
    { label: 'Live Tracking', path: '/customer/tracking', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Subscriptions', path: '/customer/subscriptions', icon: <RefreshCw className="w-4 h-4" /> },
    { label: 'Tax Invoices', path: '/customer/invoices', icon: <FileText className="w-4 h-4" /> },
    { label: 'Support & Complaints', path: '/customer/complaints', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    orderId: 'SF-2026-894120',
    category: 'packaging_damaged',
    description: '',
    customerName: 'Valued Customer',
    customerPhone: '+91 98480 12345',
  });

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetchComplaintsApi();
      if (res?.success) {
        setComplaints(res.complaints);
      }
    } catch (err) {
      console.error('Failed to load complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    try {
      setActionLoading(true);
      setStatusMsg(null);
      const res = await createComplaintApi(formData);
      if (res?.success) {
        setStatusMsg({ type: 'success', text: res.message });
        setShowModal(false);
        setFormData({ ...formData, description: '' });
        await loadComplaints();
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Ticket creation failed' });
      }
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Error submitting complaint ticket',
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout portalTitle="Complaints & Support" portalRole="customer" navItems={customerNav}>
      <div className="space-y-8">
        {/* Header */}
        <div className="sujju-gradient rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-sujju-gold text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Customer Satisfaction & Warranty Guarantee</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Returns, Replacements & Support Tickets
            </h2>
            <p className="text-xs text-sujju-green-200 mt-1">
              If your tea arrived with packaging damage, seal concerns, or dispatch issues, we resolve tickets within 2 hours.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-sujju-gold hover:bg-sujju-gold-600 text-sujju-green-950 font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow text-sm self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Raise Support Ticket</span>
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

        {/* Complaints List */}
        <div className="space-y-4">
          {complaints.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                    {ticket.id}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    Order Ref: <strong>{ticket.orderId}</strong>
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      ticket.resolutionStatus === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ticket.resolutionStatus === 'open'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {ticket.resolutionStatus.toUpperCase()}
                  </span>
                </div>

                <div className="text-sm font-semibold text-gray-900">
                  Category: <span className="capitalize">{ticket.category.replace('_', ' ')}</span>
                </div>
                <p className="text-xs text-gray-600">{ticket.description}</p>
                {ticket.resolutionNotes && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 mt-2">
                    <strong>Support Resolution:</strong> {ticket.resolutionNotes}
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-400 self-start md:self-center flex-shrink-0">
                Logged: {new Date(ticket.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Raise Complaint */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Log Customer Issue Ticket</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 font-bold">✕</button>
              </div>

              <form onSubmit={handleCreate} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Issue Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                  >
                    <option value="packaging_damaged">Damaged Pouch / Torn Barrier Seal</option>
                    <option value="delivery_delay">Delivery Exceeded 24-Hour SLA</option>
                    <option value="wrong_quantity">Incorrect Packet Count Handed Over</option>
                    <option value="taste_quality">Taste / Infusion Aroma Inquiry</option>
                    <option value="other">Other General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Description & Details
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what occurred with your delivery or tea packet..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm"
                  />
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
                    disabled={actionLoading || !formData.description.trim()}
                    className="flex-1 py-2 bg-sujju-green hover:bg-sujju-green-800 text-white rounded-xl text-sm font-bold shadow disabled:opacity-50"
                  >
                    {actionLoading ? 'Logging...' : 'Submit Support Ticket'}
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
