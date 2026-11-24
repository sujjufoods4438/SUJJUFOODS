import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { submitContact } from '../../services/api';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    purpose: 'dealership',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    try {
      await submitContact(formData);
      setSuccessMsg('Thank you! Your enquiry has been registered in the SUJJU FOODS management portal.');
      setFormData({ name: '', phone: '', email: '', purpose: 'dealership', message: '' });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Error submitting enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-sujju-gold uppercase tracking-widest block">
          Get In Touch
        </span>
        <h1 className="text-4xl font-extrabold text-sujju-green-950 font-serif mt-1">
          Contact SUJJU FOODS
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Reach out for corporate orders, retail distribution dealership, customer support, or product queries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="sujju-gradient rounded-3xl p-8 text-white space-y-6 shadow-xl">
            <h3 className="text-2xl font-bold font-serif text-sujju-gold">Corporate Headquarters</h3>
            <p className="text-xs text-sujju-green-200 leading-relaxed">
              SUJJU FOODS Manufacturing Unit & Administrative Office, Andhra Pradesh, India.
            </p>

            <div className="space-y-4 pt-2 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sujju-gold flex-shrink-0 mt-0.5" />
                <span>Plot 42, Industrial Development Area, Visakhapatnam, Andhra Pradesh, 530016</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sujju-gold flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-sujju-gold transition">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sujju-gold flex-shrink-0" />
                <a href="mailto:support@sujjufoods.com" className="hover:text-sujju-gold transition">
                  support@sujjufoods.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-sujju-gold flex-shrink-0" />
                <span>Mon – Sat: 8:00 AM – 7:00 PM IST</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-sujju-cream-300 shadow-sm space-y-2">
            <h4 className="font-bold text-sujju-green-950 text-sm">Territory Dealership Applications</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Distributor agreements are processed under admin-issued sponsor codes with full territorial exclusivity.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-sujju-cream-300">
          <h3 className="text-2xl font-bold text-sujju-green-950 font-serif mb-6">
            Send an Official Enquiry
          </h3>

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Anand Varma"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (10 digits) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  placeholder="e.g. 9876543210"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Purpose of Enquiry</label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none bg-white"
                >
                  <option value="dealership">Territory Dealership / Distributor</option>
                  <option value="bulk_order">Bulk / Corporate Order</option>
                  <option value="general">General Enquiry</option>
                  <option value="feedback">Product Feedback</option>
                  <option value="complaint">Complaint / Quality Issue</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Message / Requirements *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention your territory pincode, estimated volume or details..."
                className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-sujju-green hover:bg-sujju-green-600 text-white font-bold py-3.5 rounded-xl transition shadow flex items-center justify-center gap-2 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Enquiry to Admin'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
