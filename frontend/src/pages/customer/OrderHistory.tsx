import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Clock,
  ShoppingBag,
  Truck,
  FileText,
  Share2,
  ChevronRight,
  Download,
  AlertCircle,
} from 'lucide-react';
import { fetchMyOrdersApi } from '../../services/api';

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const customerNav = [
    { label: 'My Dashboard', path: '/customer/dashboard', icon: <Clock className="w-4 h-4" /> },
    { label: 'Place New Order', path: '/customer/new-order', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Order History', path: '/customer/orders', icon: <Clock className="w-4 h-4" /> },
    { label: 'Track Delivery', path: '/customer/tracking', icon: <Truck className="w-4 h-4" /> },
    { label: 'Invoices (A4 PDF)', path: '/customer/invoices', icon: <FileText className="w-4 h-4" /> },
    { label: 'My Referral Code', path: '/customer/referrals', icon: <Share2 className="w-4 h-4" /> },
  ];

  useEffect(() => {
    fetchMyOrdersApi()
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout portalTitle="Customer Order History" portalRole="customer" navItems={customerNav}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-serif">My Placed Orders</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review your current and historical tea orders, delivery statuses, and download A4 tax invoices.
            </p>
          </div>

          <Link
            to="/customer/new-order"
            className="bg-sujju-green hover:bg-sujju-green-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-sujju-gold" />
            <span>Place New Order</span>
          </Link>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b">
                <tr>
                  <th className="py-4 px-6">Order ID & Date</th>
                  <th className="py-4 px-6">Items & Pack Size</th>
                  <th className="py-4 px-6">Amount Payable</th>
                  <th className="py-4 px-6">Assigned Distributor</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {orders.map((o, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition">
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900 font-mono text-sm block">{o.orderId}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-800">{o.quantity} Packs</span>
                      <span className="text-[10px] text-gray-400 block">{o.packSize || '250g'} (₹180/pack)</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-sujju-green font-mono text-sm block">₹{o.totalAmount}</span>
                      <span className="text-[10px] text-sujju-leaf">0% GST Approved</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-800 font-semibold">{o.distributorName || 'AP Territory Partner'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full text-[10px] border border-blue-200">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        to={`/customer/tracking`}
                        className="text-sujju-green hover:underline font-bold text-xs"
                      >
                        Track
                      </Link>
                      <a
                        href={`/api/v1/orders/${o.orderId}/invoice`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 bg-sujju-cream-200 hover:bg-sujju-cream-300 text-sujju-green px-3 py-1.5 rounded-lg text-[11px] font-bold border border-sujju-cream-300 transition"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </a>
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
