import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  FileText,
  Clock,
  ShoppingBag,
  Truck,
  Share2,
  Download,
} from 'lucide-react';
import { fetchMyOrdersApi } from '../../services/api';

export const Invoices: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

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
      .catch(() => setOrders([]));
  }, []);

  return (
    <DashboardLayout portalTitle="My A4 Tax Invoices" portalRole="customer" navItems={customerNav}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Tax Invoices (A4 PDF)</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Original computer-generated A4 tax invoices with SUJJU FOODS legal business details, ₹180/pack pricing, and 0% GST.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((o, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="font-bold text-sm text-gray-900 font-mono">
                    {o.invoiceNumber || `INV-2026-${o.orderId.slice(-6)}`}
                  </span>
                  <span className="text-[10px] text-gray-400 block">Ref: {o.orderId}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  Tax Invoice
                </span>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Item:</strong> SUJJU FOODS Tea Powder ({o.quantity} Packs @ ₹180)</p>
                <p><strong>Subtotal:</strong> ₹{o.subtotal || o.quantity * 180}</p>
                <p><strong>GST (Approved):</strong> ₹0.00 (0%)</p>
                <p className="text-sm font-extrabold text-sujju-green pt-1">Total Payable: ₹{o.totalAmount || o.quantity * 180}</p>
              </div>

              <a
                href={`/api/v1/orders/${o.orderId}/invoice`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-sujju-green hover:bg-sujju-green-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
              >
                <Download className="w-3.5 h-3.5 text-sujju-gold" />
                <span>Download Print-Ready PDF</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
