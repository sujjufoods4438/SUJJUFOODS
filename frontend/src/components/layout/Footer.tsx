import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-sujju-green-950 text-sujju-cream-200 border-t border-sujju-green-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sujju-gold flex items-center justify-center text-sujju-green-900 font-extrabold text-xl shadow">
                SF
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                SUJJU FOODS
              </span>
            </div>
            <p className="text-sm text-sujju-green-200 leading-relaxed">
              Manufacturing and distributing highest grade, farm-fresh tea powder across Andhra Pradesh and India. Bringing unmatched aroma, brisk liquor, and true refreshing flavor to every home and cup.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-sujju-gold">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Hygienic & Direct Plantation Blends</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-sujju-green-800 pb-2">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-sujju-gold transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-sujju-gold transition">
                  About Our Tea & Process
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-sujju-gold transition">
                  Products (250g Pack - ₹180)
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-sujju-gold transition">
                  Manufacturing Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-sujju-gold transition">
                  Contact & Dealership Enquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Portals */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-sujju-green-800 pb-2">
              Business Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/customer/dashboard" className="hover:text-sujju-gold transition">
                  Customer Portal & Ordering
                </Link>
              </li>
              <li>
                <Link to="/distributor/dashboard" className="hover:text-sujju-gold transition">
                  Distributor Delivery Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-sujju-gold transition">
                  Admin Command Center
                </Link>
              </li>
              <li>
                <Link to="/employee/dashboard" className="hover:text-sujju-gold transition">
                  Employee Attendance & Tasks
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-sujju-green-800 pb-2">
              Headquarters
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sujju-gold flex-shrink-0 mt-1" />
                <span>SUJJU FOODS Manufacturing Unit, Industrial Estate, Andhra Pradesh, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sujju-gold flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sujju-gold flex-shrink-0" />
                <a href="mailto:support@sujjufoods.com" className="hover:text-white transition">
                  support@sujjufoods.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-sujju-green-900 flex flex-col md:flex-row items-center justify-between text-xs text-sujju-green-400 gap-4">
          <p>© {new Date().getFullYear()} SUJJU FOODS. All Rights Reserved. Built with precision for Andhra Pradesh & India.</p>
          <div className="flex items-center gap-6">
            <span>Price: ₹180 per 250g | No GST Configuration Approved</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-sujju-gold fill-sujju-gold" /> for Tea Lovers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
