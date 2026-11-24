import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Truck,
  CheckCircle2,
  Clock,
  DollarSign,
  Camera,
  FileCheck,
  Award,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { fetchAssignedDeliveriesApi, acceptDeliveryApi } from '../../services/api';

export const AssignedOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const distributorNav = [
    { label: 'Delivery Dashboard', path: '/distributor/dashboard', icon: <Truck className="w-4 h-4" /> },
    { label: 'Assigned Orders', path: '/distributor/assigned', icon: <Clock className="w-4 h-4" />, badge: 'Active' },
    { label: 'Pickup Verification', path: '/distributor/pickup', icon: <Camera className="w-4 h-4" /> },
    { label: 'Delivery Proof & OTP', path: '/distributor/delivery', icon: <FileCheck className="w-4 h-4" /> },
    { label: 'Cash & UPI Collections', path: '/distributor/collections', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'My Commission & Bonus', path: '/distributor/commission', icon: <Award className="w-4 h-4" /> },
    { label: 'Territory Leaderboard', path: '/distributor/leaderboard', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const loadOrders = async () => {
    try {
      const res = await fetchAssignedDeliveriesApi();
      if (res.orders && res.orders.length > 0) {
        setOrders(res.orders);
      } else {
        setOrders([
          {
            orderId: 'SF-2026-894120',
            customerName: 'Ramesh Kumar',
            customerPhone: '+91 98765 12345',
            deliveryAddress: { houseNumber: 'D.No 4-52/1', street: 'Dwaraka Nagar', city: 'Visakhapatnam', pincode: '530016' },
            quantity: 8,
            totalAmount: 1440,
            status: 'Distributor Assigned',
            slaDueAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
          },
        ]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleAccept = async (orderId: string, accepted: boolean) => {
    try {
      const res = await acceptDeliveryApi(orderId, accepted, accepted ? undefined : 'Capacity limit');
      setActionMsg(res.message);
      loadOrders();
    } catch (err: any) {
      setActionMsg('Failed to update order acceptance status');
    }
  };

  return (
    <DashboardLayout portalTitle="Assigned Delivery Queue" portalRole="distributor" navItems={distributorNav}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Territory Assigned Orders</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Accept orders within 30 minutes. 24-hour delivery SLA clock starts upon order confirmation.
          </p>
        </div>

        {actionMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-sujju-green transition"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-gray-900 font-mono">{order.orderId}</span>
                  <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                    {order.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-gray-800">
                  {order.customerName} ({order.customerPhone})
                </p>
                <p className="text-xs text-gray-500">
                  📍 {order.deliveryAddress?.houseNumber}, {order.deliveryAddress?.street}, {order.deliveryAddress?.city} ({order.deliveryAddress?.pincode})
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                  <span className="font-extrabold text-sujju-green">
                    Collection Amount: ₹{order.totalAmount} ({order.quantity} Packs @ ₹180)
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md font-medium text-[11px]">
                    0% GST Approved
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {order.status === 'Distributor Assigned' ? (
                  <>
                    <button
                      onClick={() => handleAccept(order.orderId, true)}
                      className="bg-sujju-green hover:bg-sujju-green-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() => handleAccept(order.orderId, false)}
                      className="bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-gray-200 transition"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <Link
                    to="/distributor/pickup"
                    className="bg-sujju-green hover:bg-sujju-green-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-sujju-gold" />
                    <span>Proceed to Pickup Proof</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
