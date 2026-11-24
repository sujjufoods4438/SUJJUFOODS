import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Camera,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  FileCheck,
  Clock,
  DollarSign,
  Award,
  TrendingUp,
} from 'lucide-react';
import { submitPickupProofApi, submitDispatchProofApi } from '../../services/api';

export const PickupProof: React.FC = () => {
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState('SF-2026-894120');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
  );
  const [quantityVerified, setQuantityVerified] = useState(true);
  const [gpsActive, setGpsActive] = useState(true);
  const [latitude, setLatitude] = useState(17.6868);
  const [longitude, setLongitude] = useState(83.2185);

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
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

  const handleCaptureGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setGpsActive(true);
        },
        () => {
          setGpsActive(true); // Dev default
        }
      );
    }
  };

  const handleConfirmPickup = async () => {
    if (!quantityVerified) {
      setErrorMsg('Please physically count and verify the tea pack quantity');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await submitPickupProofApi(orderId, {
        photoUrl,
        latitude,
        longitude,
      });

      // Also trigger dispatch status
      await submitDispatchProofApi(orderId, {
        photoUrl,
        latitude,
        longitude,
      });

      setMsg(res.message);
      setTimeout(() => navigate('/distributor/delivery'), 1500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit pickup proof');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout portalTitle="Pickup Verification & Proof" portalRole="distributor" navItems={distributorNav}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Pickup Verification</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Capture warehouse package photo, GPS location stamp, and verify product count before dispatch.
          </p>
        </div>

        {msg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Target Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono font-bold"
            />
          </div>

          {/* Photo Preview & Camera */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Pickup Custody Photograph *
            </label>
            <div className="rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 p-4 text-center space-y-3 bg-gray-50">
              <img
                src={photoUrl}
                alt="Consignment"
                className="rounded-xl max-h-48 mx-auto object-cover shadow"
              />
              <button
                type="button"
                onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80')}
                className="bg-white border text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-sujju-green" />
                <span>Retake / Upload Package Photo</span>
              </button>
            </div>
          </div>

          {/* GPS Coordinates Stamp */}
          <div className="p-4 rounded-2xl bg-sujju-cream-100 border border-sujju-cream-300 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-sujju-green-950 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sujju-gold" /> Geolocation Evidence
              </span>
              <p className="text-xs font-mono text-gray-600">
                Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)} (Visakhapatnam Hub)
              </p>
            </div>
            <button
              type="button"
              onClick={handleCaptureGps}
              className="bg-white border border-gray-300 text-xs px-3 py-1.5 rounded-lg font-bold"
            >
              Refresh GPS
            </button>
          </div>

          {/* Physical count verification checkbox */}
          <label className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={quantityVerified}
              onChange={(e) => setQuantityVerified(e.target.checked)}
              className="mt-0.5 rounded text-sujju-green focus:ring-sujju-green"
            />
            <span className="text-gray-700 font-medium">
              I have physically counted the sealed 250g tea packs (Total: 8 packs) and verified vacuum integrity.
            </span>
          </label>

          <button
            type="button"
            disabled={submitting}
            onClick={handleConfirmPickup}
            className="w-full bg-sujju-green hover:bg-sujju-green-600 text-white font-bold py-3.5 rounded-xl text-sm shadow transition"
          >
            {submitting ? 'Recording Custody...' : 'Confirm Pickup & Set Out for Delivery'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};
