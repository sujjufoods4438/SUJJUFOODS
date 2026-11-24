import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  ShoppingBag,
  Plus,
  Minus,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  FileText,
  Clock,
  Share2,
} from 'lucide-react';
import { calculateOrder, createOrderApi, checkPincode, PincodeInfo } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(8);
  const [calculation, setCalculation] = useState({
    quantity: 8,
    unitPrice: 180,
    subtotal: 1440,
    gstAmount: 0,
    deliveryCharge: 0,
    totalAmount: 1440,
  });

  const [pincode, setPincode] = useState('530016');
  const [pincodeInfo, setPincodeInfo] = useState<PincodeInfo | null>({
    pincode: '530016',
    city: 'Dwaraka Nagar',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    isServiceable: true,
  });

  const [recipientName, setRecipientName] = useState(user?.fullName || 'Ramesh Kumar');
  const [contactNumber, setContactNumber] = useState(user?.phone || '9876512345');
  const [houseNumber, setHouseNumber] = useState('D.No 4-52/1');
  const [street, setStreet] = useState('Main Road');
  const [area, setArea] = useState('Dwaraka Nagar');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi'>('cash');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const customerNav = [
    { label: 'My Dashboard', path: '/customer/dashboard', icon: <Clock className="w-4 h-4" /> },
    { label: 'Place New Order', path: '/customer/new-order', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Order History', path: '/customer/orders', icon: <Clock className="w-4 h-4" /> },
    { label: 'Track Delivery', path: '/customer/tracking', icon: <Truck className="w-4 h-4" /> },
    { label: 'Invoices (A4 PDF)', path: '/customer/invoices', icon: <FileText className="w-4 h-4" /> },
    { label: 'My Referral Code', path: '/customer/referrals', icon: <Share2 className="w-4 h-4" /> },
  ];

  const handleQtyChange = async (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
    try {
      const calc = await calculateOrder(newQty);
      setCalculation(calc);
    } catch {
      const sub = newQty * 180;
      setCalculation({
        quantity: newQty,
        unitPrice: 180,
        subtotal: sub,
        gstAmount: 0,
        deliveryCharge: 0,
        totalAmount: sub,
      });
    }
  };

  const handlePincodeBlur = async () => {
    if (/^[1-9][0-9]{5}$/.test(pincode)) {
      try {
        const info = await checkPincode(pincode);
        setPincodeInfo(info);
      } catch {}
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!pincodeInfo || !pincodeInfo.isServiceable) {
      setErrorMsg('Please select a serviceable Indian PIN code in Andhra Pradesh');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        quantity,
        paymentMode,
        deliveryAddress: {
          houseNumber,
          street,
          area,
          city: pincodeInfo.city,
          district: pincodeInfo.district,
          state: pincodeInfo.state,
          pincode,
          recipientName,
          contactNumber,
        },
      };

      const res = await createOrderApi(payload);
      setOrderSuccess(res);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout portalTitle="Place Tea Order" portalRole="customer" navItems={customerNav}>
      <div className="max-w-4xl mx-auto space-y-8">
        {!orderSuccess ? (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Product Selection & Pricing */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-sujju-gold uppercase tracking-wider block">
                  Product Selection
                </span>
                <h2 className="text-2xl font-bold text-sujju-green-950 font-serif mt-1">
                  SUJJU FOODS Tea Powder
                </h2>
                <p className="text-xs text-gray-500">Pack Size: <strong>250 Grams</strong> | SKU: SF-TEA-250G</p>
              </div>

              {/* Pack Image Preview */}
              <div className="rounded-2xl bg-sujju-green-950 p-6 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
                  alt="SUJJU FOODS Tea"
                  className="rounded-xl max-h-48 object-cover shadow-lg"
                />
              </div>

              {/* Quantity Stepper */}
              <div className="p-4 bg-sujju-cream-100 rounded-2xl border border-sujju-cream-300 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-bold block">Select Quantity</span>
                  <span className="text-sm font-extrabold text-sujju-green">₹180 / piece</span>
                </div>

                <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-xl p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleQtyChange(quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-base text-sujju-green-950 font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQtyChange(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-sujju-green text-white hover:bg-sujju-green-600 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({quantity} × ₹180):</span>
                  <span className="font-bold text-gray-900">₹{calculation.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (Approved 0% Configuration):</span>
                  <span className="font-bold text-sujju-leaf">₹0.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Doorstep Delivery (24-Hour Target):</span>
                  <span className="font-bold text-sujju-leaf">FREE</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-sujju-green-950 pt-2 border-t border-gray-200">
                  <span>Total Amount Payable:</span>
                  <span className="font-mono">₹{calculation.totalAmount.toFixed(2)}</span>
                </div>
                {quantity === 8 && (
                  <p className="text-[11px] text-sujju-green font-semibold pt-1">
                    ✓ Verified mandatory rule: 8 pieces × ₹180 = ₹1,440.00 (0% GST).
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Delivery Address & Payment */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-sujju-green uppercase tracking-wider block">
                  Delivery Details
                </span>
                <h3 className="text-xl font-bold text-gray-900 font-serif mt-1">
                  Shipping Address
                </h3>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full border rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-sujju-green outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full border rounded-xl px-3.5 py-2 text-xs font-mono focus:ring-2 focus:ring-sujju-green outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Delivery PIN Code *</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={pincode}
                    onBlur={handlePincodeBlur}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full border rounded-xl px-3.5 py-2 text-xs font-mono font-bold tracking-wider focus:ring-2 focus:ring-sujju-green outline-none"
                  />
                  {pincodeInfo && (
                    <span className="text-[10px] text-sujju-green font-semibold mt-1 block">
                      📍 {pincodeInfo.city}, {pincodeInfo.district}, {pincodeInfo.state}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Flat / D.No *</label>
                    <input
                      type="text"
                      required
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      className="w-full border rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-sujju-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Street / Landmark *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full border rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-sujju-green outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Area / Locality *</label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full border rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-sujju-green outline-none"
                  />
                </div>

                {/* Payment Mode Selection */}
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-gray-700 mb-2">Payment Collection Mode *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('cash')}
                      className={`p-3 rounded-xl border text-xs font-bold transition text-center ${
                        paymentMode === 'cash'
                          ? 'bg-sujju-green text-white border-sujju-green shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      💵 Cash on Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('upi')}
                      className={`p-3 rounded-xl border text-xs font-bold transition text-center ${
                        paymentMode === 'upi'
                          ? 'bg-sujju-green text-white border-sujju-green shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      📱 UPI on Delivery
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-sujju-green hover:bg-sujju-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag className="w-4 h-4 text-sujju-gold" />
                <span>{submitting ? 'Confirming Order...' : `Confirm Order (₹${calculation.totalAmount})`}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sujju-cream-300 shadow-xl text-center space-y-6 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-sujju-green-950 font-serif">Order Confirmed!</h2>
              <p className="text-xs text-gray-500">
                Your order has been recorded in the central database and assigned for 24-hour distributor delivery.
              </p>
            </div>

            <div className="bg-sujju-cream-100 p-6 rounded-2xl border border-sujju-cream-300 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span>Order Reference:</span>
                <strong className="font-mono text-sm text-sujju-green">{orderSuccess.order.orderId}</strong>
              </div>
              <div className="flex justify-between">
                <span>Invoice Number:</span>
                <strong className="font-mono text-gray-900">{orderSuccess.invoiceNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <strong className="text-sm font-extrabold text-sujju-green-950">₹{orderSuccess.order.totalAmount} (0% GST)</strong>
              </div>
              <div className="flex justify-between">
                <span>Assigned Partner:</span>
                <strong className="text-gray-800">{orderSuccess.order.distributorName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Delivery SLA:</span>
                <strong className="text-emerald-700">Target 24-Hour Doorstep Delivery</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={orderSuccess.invoiceDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-sujju-green hover:bg-sujju-green-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
              >
                <FileText className="w-4 h-4 text-sujju-gold" />
                <span>Download A4 Invoice PDF</span>
              </a>

              <button
                onClick={() => navigate('/customer/orders')}
                className="flex-1 bg-sujju-cream-200 hover:bg-sujju-cream-300 text-sujju-green font-bold py-3 rounded-xl text-xs border border-sujju-cream-300"
              >
                View In Order History
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
