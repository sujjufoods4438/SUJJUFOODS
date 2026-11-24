import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Menu, 
  X, 
  ShoppingBag, 
  User as UserIcon, 
  ShieldCheck, 
  CheckCircle,
  Truck
} from 'lucide-react';
import { checkPincode, PincodeInfo } from '../../services/api';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');
  const [locationData, setLocationData] = useState<PincodeInfo | null>({
    pincode: '530001',
    city: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    isServiceable: true,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const location = useLocation();

  const handlePincodeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[1-9][0-9]{5}$/.test(pincodeInput)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await checkPincode(pincodeInput);
      setLocationData(res);
      setPincodeModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Error checking pincode');
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Products', path: '/products' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact Us', path: '/contact' },
  ];

  return (
    <>
      {/* Top Banner Bar */}
      <div className="bg-sujju-green-900 text-sujju-gold-200 text-xs py-2 px-4 border-b border-sujju-green-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-white">
              <Truck className="w-3.5 h-3.5 text-sujju-gold" />
              Target 24-Hour Delivery in Serviceable Areas across Andhra Pradesh
            </span>
            <span className="hidden md:inline text-sujju-green-300">|</span>
            <span className="hidden md:inline text-sujju-green-200">
              ₹180 per 250g pack (No GST Added)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setPincodeModalOpen(true)}
              className="flex items-center gap-1 text-white hover:text-sujju-gold transition font-medium bg-sujju-green-800 hover:bg-sujju-green-700 px-2.5 py-1 rounded-full border border-sujju-green-700"
            >
              <MapPin className="w-3 h-3 text-sujju-gold" />
              <span>{locationData ? `${locationData.city} (${locationData.pincode})` : 'Select Pincode'}</span>
            </button>
            <a href="tel:+919876543210" className="flex items-center gap-1 text-sujju-green-200 hover:text-white">
              <Phone className="w-3 h-3" />
              <span>+91 98765 43210</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-sujju-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-sujju-green flex items-center justify-center text-sujju-gold font-extrabold text-2xl shadow-md group-hover:scale-105 transition">
              SF
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-sujju-green-900 block leading-none font-serif">
                SUJJU FOODS
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-sujju-gold-600 block mt-1">
                Purest Farm-Fresh Tea
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition ${
                  location.pathname === link.path
                    ? 'text-sujju-green font-bold border-b-2 border-sujju-green pb-1'
                    : 'text-sujju-charcoal hover:text-sujju-green'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Portal Switcher & Action CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-xs font-semibold text-sujju-green bg-sujju-green-50 hover:bg-sujju-green-100 px-3 py-2 rounded-lg border border-sujju-green-200 transition"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </Link>

            <div className="relative group">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-sujju-green bg-sujju-green-50 hover:bg-sujju-green-100 px-3 py-2 rounded-lg border border-sujju-green-200 transition">
                <span>Portals</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 hidden group-hover:block z-50">
                <Link to="/customer/dashboard" className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-sujju-green-50 hover:text-sujju-green">
                  Customer Portal
                </Link>
                <Link to="/distributor/dashboard" className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-sujju-green-50 hover:text-sujju-green">
                  Distributor Portal
                </Link>
                <Link to="/admin/dashboard" className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-sujju-green-50 hover:text-sujju-green">
                  Admin Management
                </Link>
                <Link to="/employee/dashboard" className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-sujju-green-50 hover:text-sujju-green">
                  Employee Portal
                </Link>
              </div>
            </div>

            <Link
              to="/products"
              className="flex items-center gap-2 bg-sujju-green hover:bg-sujju-green-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition"
            >
              <ShoppingBag className="w-4 h-4 text-sujju-gold" />
              <span>Order Tea Now</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-sujju-green rounded-lg hover:bg-sujju-cream-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-sujju-charcoal hover:text-sujju-green"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/customer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold py-2 px-3 rounded bg-sujju-cream text-sujju-green"
              >
                Customer Portal
              </Link>
              <Link
                to="/distributor/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold py-2 px-3 rounded bg-sujju-cream text-sujju-green"
              >
                Distributor Portal
              </Link>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold py-2 px-3 rounded bg-sujju-cream text-sujju-green"
              >
                Admin Management
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-sujju-green text-white font-semibold rounded-lg mt-2"
              >
                Order Tea (₹180/pack)
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Pincode Modal */}
      {pincodeModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setPincodeModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-sujju-green-100 flex items-center justify-center text-sujju-green">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-sujju-green-900">Choose Delivery Location</h3>
                <p className="text-xs text-gray-500">Enter your 6-digit Indian PIN code</p>
              </div>
            </div>

            <form onSubmit={handlePincodeSearch} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 530001, 520001, 522001"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-sujju-green text-center font-mono tracking-widest font-semibold"
                />
              </div>

              {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sujju-green hover:bg-sujju-green-600 text-white font-semibold py-3 rounded-xl transition"
              >
                {loading ? 'Checking Serviceability...' : 'Verify Location'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
              <p className="flex items-center gap-1.5 font-medium text-sujju-green">
                <CheckCircle className="w-3.5 h-3.5" /> Direct delivery network across Andhra Pradesh
              </p>
              <p className="text-[11px] text-gray-400">
                24-Hour delivery SLA applies to serviceable pincodes with verified stock and active distributors.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
