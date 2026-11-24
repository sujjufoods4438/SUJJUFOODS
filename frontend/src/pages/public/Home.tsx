import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Truck,
  Leaf,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Users,
  MapPin,
  ArrowRight,
  PhoneCall,
  Flame,
  Check,
} from 'lucide-react';
import { INITIAL_PRODUCT } from '../../constants';
import { checkPincode, PincodeInfo } from '../../services/api';

export const Home: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<PincodeInfo | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setPincodeError('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setPincodeError('');
    setPincodeLoading(true);
    try {
      const res = await checkPincode(pincode);
      setPincodeResult(res);
    } catch (err: any) {
      setPincodeError('Unable to check pincode at this moment');
    } finally {
      setPincodeLoading(false);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-sujju-green-950 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C69A48_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-sujju-green-900 border border-sujju-green-700/60 rounded-full px-4 py-1.5 text-xs font-semibold text-sujju-gold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Purest Farm-Fresh Blend • Sourced Directly</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif leading-tight">
                Authentic Taste, <br />
                <span className="text-sujju-gold">Golden Liquor</span> & Pure Aroma.
              </h1>

              <p className="text-lg text-sujju-green-200 max-w-2xl leading-relaxed">
                Experience SUJJU FOODS tea powder — precision manufactured with state-of-the-art hygienic processing. Sourced from high-elevation estates, delivering the perfect briskness in every cup.
              </p>

              {/* Price Callout */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3.5">
                  <span className="text-xs text-sujju-green-200 block uppercase font-medium">Standard Pack</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">₹180</span>
                    <span className="text-sm text-sujju-gold font-semibold">/ 250 grams pack</span>
                  </div>
                  <span className="text-[11px] text-sujju-green-300 block mt-0.5">Approved Configuration: No GST Added</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 bg-sujju-gold hover:bg-sujju-gold-600 text-sujju-green-950 font-bold px-7 py-3.5 rounded-xl shadow-lg transition"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Order Online</span>
                  </Link>
                  <Link
                    to="/distributor/dashboard"
                    className="inline-flex items-center justify-center gap-2 bg-sujju-green-900 hover:bg-sujju-green-800 text-white font-semibold px-6 py-3.5 rounded-xl border border-sujju-green-700 transition"
                  >
                    <span>Distributor Portal</span>
                  </Link>
                </div>
              </div>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-sujju-green-900 text-xs text-sujju-green-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sujju-gold" />
                  <span>100% Plantation Tea</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sujju-gold" />
                  <span>Target 24-Hr Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sujju-gold" />
                  <span>Batch Quality Tested</span>
                </div>
              </div>
            </div>

            {/* Hero Image & Pack Display */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-sujju-green-800 bg-sujju-green-900">
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
                  alt="SUJJU FOODS Tea Powder"
                  className="w-full h-96 object-cover hover:scale-105 transition duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-sujju-green-950 via-sujju-green-950/80 to-transparent p-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-sujju-gold font-bold">Flagship Product</span>
                  <h3 className="text-xl font-bold font-serif">SUJJU FOODS Tea Powder</h3>
                  <p className="text-xs text-sujju-green-200 mt-1">250g Net Weight • Vacuum Sealed Freshness</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE PINCODE & 24-HOUR SERVICEABILITY CHECKER */}
      <section className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-sujju-cream-300 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sujju-green font-bold text-sm">
                <MapPin className="w-4 h-4 text-sujju-gold" />
                <span>Check Your Delivery Location</span>
              </div>
              <h3 className="text-xl font-extrabold text-sujju-green-950 font-serif">
                Verify 24-Hour Delivery Eligibility
              </h3>
              <p className="text-xs text-gray-500">
                Enter your 6-digit PIN code to check instant distributor coverage across Andhra Pradesh & India.
              </p>
            </div>

            <form onSubmit={handlePincodeCheck} className="flex flex-col sm:flex-row gap-3 min-w-[320px]">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN (e.g. 530001)"
                className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wider text-center focus:ring-2 focus:ring-sujju-green outline-none"
              />
              <button
                type="submit"
                disabled={pincodeLoading}
                className="bg-sujju-green hover:bg-sujju-green-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition shadow"
              >
                {pincodeLoading ? 'Checking...' : 'Check Status'}
              </button>
            </form>
          </div>

          {pincodeError && <p className="text-xs text-red-600 mt-3">{pincodeError}</p>}

          {pincodeResult && (
            <div className={`mt-4 p-4 rounded-xl border text-sm flex items-start gap-3 ${
              pincodeResult.isServiceable
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <p className="font-bold">
                  {pincodeResult.city}, {pincodeResult.district}, {pincodeResult.state} ({pincodeResult.pincode})
                </p>
                <p className="text-xs mt-0.5">{pincodeResult.deliveryPromise}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. TEA MANUFACTURING & PROCESS INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-sujju-cream-200 text-sujju-green px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-sujju-leaf" />
              <span>Plantation to Packet</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-sujju-green-950 font-serif leading-snug">
              Scientifically Blended for Unmatched Aroma & Refreshing Liquor
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed">
              SUJJU FOODS adheres to strict quality manufacturing principles. Our tea leaves undergo careful grading, precise CTC rotorvane cutting, controlled fermentation, and optimum firing to lock in authentic natural antioxidants and rich tea polyphenols.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="border-l-2 border-sujju-gold pl-4">
                <h4 className="font-bold text-sujju-green-950 text-base">Select Estate Leaves</h4>
                <p className="text-xs text-gray-500 mt-1">High-elevation handpicked tea leaves sourced directly from vetted tea gardens.</p>
              </div>
              <div className="border-l-2 border-sujju-gold pl-4">
                <h4 className="font-bold text-sujju-green-950 text-base">Hygienic Packaging</h4>
                <p className="text-xs text-gray-500 mt-1">Automated airtight nitrogen-flushed pouch packaging prevents moisture ingress.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-sujju-green hover:text-sujju-gold transition"
              >
                <span>Read Full Manufacturing Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80"
              alt="Tea plantation"
              className="rounded-2xl shadow-md h-64 w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80"
              alt="Tea processing"
              className="rounded-2xl shadow-md h-64 w-full object-cover mt-8"
            />
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCT SHOWCASE */}
      <section className="bg-sujju-cream-100 py-16 border-y border-sujju-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-sujju-gold uppercase tracking-widest block">
              Direct From Manufacturer
            </span>
            <h2 className="text-3xl font-extrabold text-sujju-green-950 font-serif mt-1">
              Featured Product Catalogue
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Packaged in convenient retail packs, maintaining consistent batch freshness and guaranteed weight.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-sujju-cream-300 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-sujju-green-900 p-8 flex items-center justify-center relative">
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
                  alt="SUJJU FOODS Tea Powder 250g"
                  className="rounded-2xl max-h-72 object-cover shadow-2xl"
                />
                <span className="absolute top-4 left-4 bg-sujju-gold text-sujju-green-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Approved Standard
                </span>
              </div>

              <div className="p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-sujju-green-950 font-serif">
                    SUJJU FOODS Tea Powder
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Pack Size: <strong>250 grams</strong> | SKU: SF-TEA-250G
                  </p>

                  <div className="my-5 p-4 rounded-xl bg-sujju-cream-100 border border-sujju-cream-300">
                    <span className="text-xs text-gray-500 block uppercase font-medium">Approved Retail Price</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-extrabold text-sujju-green">₹180</span>
                      <span className="text-xs text-gray-600 font-semibold">per 250g packet</span>
                    </div>
                    <p className="text-[11px] text-sujju-leaf font-medium mt-1">
                      No GST added under current approved project configuration.
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-sujju-green" /> 100% Granulated CTC Orthodox Blend
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-sujju-green" /> Long-lasting aroma with rich golden-red color
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-sujju-green" /> 8 packs total: 8 × ₹180 = ₹1,440
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    to="/products"
                    className="w-full flex items-center justify-center gap-2 bg-sujju-green hover:bg-sujju-green-600 text-white font-bold py-3 px-6 rounded-xl transition shadow"
                  >
                    <ShoppingBag className="w-4 h-4 text-sujju-gold" />
                    <span>View Details & Order</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW ORDERING WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-sujju-gold uppercase tracking-widest block">
            Seamless Logistics
          </span>
          <h2 className="text-3xl font-extrabold text-sujju-green-950 font-serif mt-1">
            How The SUJJU FOODS Network Works
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Integrated end-to-end between customer, direct manufacturing, and local distributor delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              title: 'Select & Check Pincode',
              desc: 'Enter your 6-digit Indian PIN code to verify serviceability and prefill address.',
            },
            {
              step: '02',
              title: 'Confirm Order (₹180/pack)',
              desc: 'Select quantity. Price is verified strictly from server with ₹0 GST. Instant invoice generated.',
            },
            {
              step: '03',
              title: 'Automatic Distributor Match',
              desc: 'Our engine routes the order to the closest active distributor in your territory.',
            },
            {
              step: '04',
              title: 'Doorstep Delivery & Collection',
              desc: 'Receive fresh tea within 24 hours. Pay via Cash or UPI directly upon delivery.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-sujju-cream-300 shadow-sm hover:shadow-md transition relative group"
            >
              <span className="text-4xl font-extrabold text-sujju-gold/30 group-hover:text-sujju-gold transition font-mono">
                {item.step}
              </span>
              <h3 className="text-base font-bold text-sujju-green-950 mt-4 mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. DISTRIBUTOR ENQUIRY CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sujju-gradient rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="bg-sujju-gold text-sujju-green-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Business Opportunity
              </span>
              <h3 className="text-3xl font-bold font-serif">
                Join the SUJJU FOODS Authorized Distributor Network
              </h3>
              <p className="text-sm text-sujju-green-100 max-w-2xl leading-relaxed">
                We are actively appointing territory distributors across towns and mandals in Andhra Pradesh. Benefit from healthy margins, daily commission statements, automated order routing, and company marketing support.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-sujju-gold font-medium">
                <span>✓ High ROI & Quick Turnover</span>
                <span>✓ Automatic Mobile Order App</span>
                <span>✓ Direct Manufacturing Support</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                to="/contact"
                className="w-full text-center bg-sujju-gold hover:bg-sujju-gold-600 text-sujju-green-950 font-bold py-3.5 px-6 rounded-xl shadow-lg transition"
              >
                Apply for Dealership
              </Link>
              <Link
                to="/distributor/dashboard"
                className="w-full text-center bg-sujju-green-900 hover:bg-sujju-green-800 text-white font-semibold py-3 px-6 rounded-xl border border-sujju-green-700 transition text-sm"
              >
                Distributor Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
