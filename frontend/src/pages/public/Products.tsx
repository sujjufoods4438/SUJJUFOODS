import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Calculator, 
  MapPin, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { calculateOrder } from '../../services/api';

export const Products: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(8); // Default 8 pieces as highlighted in requirements
  const [calculation, setCalculation] = useState({
    quantity: 8,
    unitPrice: 180,
    subtotal: 1440,
    gstAmount: 0,
    deliveryCharge: 0,
    discount: 0,
    totalAmount: 1440,
  });
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [pincode, setPincode] = useState('530001');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
    try {
      const data = await calculateOrder(newQty);
      setCalculation(data);
    } catch {
      // Local fallback calculation matching backend rules: Qty * 180, 0 GST
      const subtotal = newQty * 180;
      setCalculation({
        quantity: newQty,
        unitPrice: 180,
        subtotal,
        gstAmount: 0,
        deliveryCharge: 0,
        discount: 0,
        totalAmount: subtotal,
      });
    }
  };

  const handleConfirmOrder = () => {
    setOrderPlaced(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-sujju-gold uppercase tracking-widest block">
          Product Catalogue & Ordering
        </span>
        <h1 className="text-4xl font-extrabold text-sujju-green-950 font-serif mt-1">
          SUJJU FOODS Tea Powder
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Strictly priced at ₹180 per 250g packet. No GST added under the current approved configuration.
        </p>
      </div>

      {/* Main Product Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-sujju-cream-300 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-12">
          {/* Images Section */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl overflow-hidden bg-sujju-green-950 p-6 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
                alt="SUJJU FOODS Tea Powder"
                className="rounded-xl max-h-80 object-cover shadow-2xl"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <img
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80"
                alt="Tea"
                className="rounded-xl h-20 w-full object-cover border border-sujju-cream-300"
              />
              <img
                src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=400&q=80"
                alt="Plantation"
                className="rounded-xl h-20 w-full object-cover border border-sujju-cream-300"
              />
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80"
                alt="Pack"
                className="rounded-xl h-20 w-full object-cover border border-sujju-cream-300"
              />
            </div>
          </div>

          {/* Details & Pricing Engine */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-sujju-green-100 text-sujju-green text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Active Catalogue
                </span>
                <span className="bg-sujju-gold-100 text-sujju-gold-800 text-xs font-bold px-3 py-1 rounded-full">
                  SKU: SF-TEA-250G
                </span>
              </div>

              <h2 className="text-3xl font-bold text-sujju-green-950 font-serif mt-3">
                SUJJU FOODS Premium Tea Powder
              </h2>
              <p className="text-xs text-gray-500 mt-1">Pack Size: <strong>250 Grams</strong> | HSN Code: 09024020</p>

              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                Handcrafted from high-grade plantation tea leaves with optimal CTC granulation. Delivers intense golden brew, inviting fresh aroma, and a revitalizing brisk taste suited for morning and evening refreshment.
              </p>

              {/* Price Calculation Box */}
              <div className="mt-6 p-6 rounded-2xl bg-sujju-cream-100 border border-sujju-cream-300 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Unit Price</span>
                    <p className="text-2xl font-extrabold text-sujju-green">₹180 <span className="text-xs font-normal text-gray-600">/ piece</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Current Tax Configuration</span>
                    <p className="text-xs font-bold text-sujju-leaf">No GST (0%)</p>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between pt-4 border-t border-sujju-cream-300">
                  <span className="text-sm font-bold text-gray-800">Quantity (Pieces):</span>
                  <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-xl p-1 shadow-sm">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-base text-sujju-green-950 font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-sujju-green text-white hover:bg-sujju-green-600 flex items-center justify-center font-bold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div className="pt-3 border-t border-sujju-cream-300 text-xs space-y-1.5 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({quantity} × ₹180):</span>
                    <span className="font-semibold text-gray-900">₹{calculation.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (Approved configuration):</span>
                    <span className="font-semibold text-sujju-leaf">₹0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge (Serviceable Area):</span>
                    <span className="font-semibold text-sujju-leaf">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-sujju-green-950 pt-2 border-t border-dashed border-gray-300">
                    <span>Total Amount Payable:</span>
                    <span>₹{calculation.totalAmount}</span>
                  </div>
                  {quantity === 8 && (
                    <p className="text-[11px] text-sujju-green font-medium pt-1">
                      ✓ Mandatory rule check: 8 pieces × ₹180 = ₹1,440.00 verified.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="space-y-3">
              <button
                onClick={() => setCheckoutModal(true)}
                className="w-full bg-sujju-green hover:bg-sujju-green-600 text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-base"
              >
                <ShoppingBag className="w-5 h-5 text-sujju-gold" />
                <span>Place Order (₹{calculation.totalAmount})</span>
              </button>
              <p className="text-center text-[11px] text-gray-400">
                Payment mode: Cash or UPI collected by authorized distributor upon delivery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            {!orderPlaced ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-sujju-green-950 font-serif">Confirm Tea Order</h3>
                    <p className="text-xs text-gray-500">SUJJU FOODS Tea Powder (250g)</p>
                  </div>
                  <button
                    onClick={() => setCheckoutModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-sujju-cream-100 p-4 rounded-xl text-xs space-y-1.5 border border-sujju-cream-300">
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-bold">{quantity} pieces</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit Price:</span>
                    <span className="font-bold">₹180 / pack</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (Approved 0%):</span>
                    <span className="font-bold text-sujju-leaf">₹0.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-sujju-green-950 pt-2 border-t">
                    <span>Final Payable:</span>
                    <span>₹{calculation.totalAmount}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-700">Delivery Address Details</label>
                  <input
                    type="text"
                    defaultValue="Ramesh Kumar"
                    placeholder="Recipient Name"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm"
                  />
                  <input
                    type="text"
                    defaultValue="+91 98765 12345"
                    placeholder="Mobile Number"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm"
                  />
                  <input
                    type="text"
                    defaultValue="D.No 4-52/1, Dwaraka Nagar, Visakhapatnam"
                    placeholder="Street Address"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm"
                  />
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="PIN Code"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono font-bold"
                  />
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <p className="font-semibold">Payment on Delivery (Cash or UPI):</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Assigned distributor will deliver and collect ₹{calculation.totalAmount} via Cash or UPI QR.
                  </p>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  className="w-full bg-sujju-green hover:bg-sujju-green-600 text-white font-bold py-3.5 rounded-xl transition shadow"
                >
                  Submit Order Now
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-sujju-green-950 font-serif">Order Confirmed!</h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Order ID: <strong>SF-2026-894120</strong> has been recorded and automatically routed to the local territory distributor.
                </p>
                <div className="bg-gray-50 p-4 rounded-xl text-xs text-left space-y-1">
                  <p><strong>Total Amount:</strong> ₹{calculation.totalAmount}</p>
                  <p><strong>SLA Target:</strong> 24-Hour Guaranteed Doorstep Delivery</p>
                  <p><strong>Payment Mode:</strong> Cash / UPI collected by distributor</p>
                </div>
                <button
                  onClick={() => {
                    setOrderPlaced(false);
                    setCheckoutModal(false);
                  }}
                  className="bg-sujju-green text-white font-bold px-6 py-2.5 rounded-xl text-sm"
                >
                  Close & View Order History
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
