import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  Camera,
  MapPin,
  Clock,
  DollarSign,
  Award,
  TrendingUp,
} from 'lucide-react';
import { submitDeliveryProofApi } from '../../services/api';

export const DeliveryProof: React.FC = () => {
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState('SF-2026-894120');
  const [deliveryOtp, setDeliveryOtp] = useState('789123'); // Customer delivery OTP
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80'
  );
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi'>('cash');
  const [collectedAmount, setCollectedAmount] = useState('1440');
  const [upiReferenceId, setUpiReferenceId] = useState('UPI-REF-992144');
  const [latitude, setLatitude] = useState(17.6868);
  const [longitude, setLongitude] = useState(83.2185);

  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const distributorNav = [
    { label: 'Delivery Dashboard', path: '/distributor/dashboard', icon: <Truck className="w-4 h-4" /> },
    { label: 'Assigned Orders', path: '/distributor/assigned', icon: <Clock className="w-4 h-4" /> },
    { label: 'Pickup Verification', path: '/distributor/pickup', icon: <Camera className="w-4 h-4" /> },
    { label: 'Delivery Proof & OTP', path: '/distributor/delivery', icon: <FileCheck className="w-4 h-4" /> },
    { label: 'Cash & UPI Collections', path: '/distributor/collections', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'My Commission & Bonus', path: '/distributor/commission', icon: <Award className="w-4 h-4" /> },
    { label: 'Territory Leaderboard', path: '/distributor/leaderboard', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const handleCompleteDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!deliveryOtp) {
      setErrorMsg('Customer delivery OTP is mandatory');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitDeliveryProofApi(orderId, {
        deliveryOtp,
        photoUrl,
        latitude,
        longitude,
        paymentMode,
        collectedAmount: parseFloat(collectedAmount) || 1440,
        upiReferenceId: paymentMode === 'upi' ? upiReferenceId : undefined,
      });

      setSuccessResult(res);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to complete delivery');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout portalTitle="Doorstep Delivery & Collection Proof" portalRole="distributor" navItems={distributorNav}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Delivery Proof & Collection</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Verify the customer's 6-digit delivery OTP, record handover photo, GPS stamp, and collect Cash or UPI.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!successResult ? (
          <form onSubmit={handleCompleteDelivery} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Order ID</label>
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Customer Delivery OTP *</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={deliveryOtp}
                  onChange={(e) => setDeliveryOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full border border-sujju-green rounded-xl px-4 py-2.5 text-xs font-mono font-extrabold text-center tracking-widest bg-emerald-50 text-emerald-900"
                />
              </div>
            </div>

            {/* Delivery Photo */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Delivery Handover Photograph *</label>
              <div className="rounded-2xl border-2 border-dashed border-gray-300 p-4 text-center space-y-3 bg-gray-50">
                <img
                  src={photoUrl}
                  alt="Delivery Proof"
                  className="rounded-xl max-h-44 mx-auto object-cover shadow"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80')}
                  className="bg-white border text-gray-700 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5 text-sujju-green" />
                  <span>Retake Handover Photo</span>
                </button>
              </div>
            </div>

            {/* Payment Collection Details */}
            <div className="p-5 rounded-2xl bg-sujju-cream-100 border border-sujju-cream-300 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sujju-green-950 uppercase">Mandatory Bill Collection</span>
                <span className="text-xs text-gray-500 font-semibold">Strict Standard: ₹180 / piece</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMode('cash')}
                  className={`p-3 rounded-xl border text-xs font-bold transition text-center ${
                    paymentMode === 'cash' ? 'bg-sujju-green text-white border-sujju-green' : 'bg-white text-gray-700'
                  }`}
                >
                  💵 Cash Collected (₹{collectedAmount})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('upi')}
                  className={`p-3 rounded-xl border text-xs font-bold transition text-center ${
                    paymentMode === 'upi' ? 'bg-sujju-green text-white border-sujju-green' : 'bg-white text-gray-700'
                  }`}
                >
                  📱 UPI Collected (₹{collectedAmount})
                </button>
              </div>

              {paymentMode === 'upi' && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">UPI Transaction Reference ID *</label>
                  <input
                    type="text"
                    required
                    value={upiReferenceId}
                    onChange={(e) => setUpiReferenceId(e.target.value)}
                    placeholder="e.g. 423188992100"
                    className="w-full border rounded-xl px-4 py-2 text-xs font-mono font-bold"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-sujju-green hover:bg-sujju-green-600 text-white font-bold py-3.5 rounded-xl text-sm shadow transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-sujju-gold" />
              <span>{submitting ? 'Confirming Handover...' : 'Confirm Delivery & Record Collection'}</span>
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-sujju-green-950 font-serif">Delivery Recorded & Reconciled!</h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              {successResult.message}
            </p>

            <div className="p-4 bg-gray-50 rounded-2xl border text-xs max-w-sm mx-auto space-y-2 text-left">
              <p><strong>Order ID:</strong> {orderId}</p>
              <p><strong>Collection Mode:</strong> {paymentMode.toUpperCase()}</p>
              <p><strong>Collected Amount:</strong> ₹{collectedAmount}</p>
              <p><strong>Status:</strong> <span className="text-emerald-700 font-bold">Delivered (SLA Fulfilled)</span></p>
            </div>

            <button
              onClick={() => navigate('/distributor/assigned')}
              className="bg-sujju-green text-white font-bold px-6 py-2.5 rounded-xl text-xs"
            >
              Back to Assigned Orders
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
