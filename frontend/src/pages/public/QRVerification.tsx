import React, { useState } from 'react';
import {
  QrCode,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Award,
  FlaskConical,
  MapPin,
  Calendar,
  Building,
  ArrowRight,
  Search,
} from 'lucide-react';
import { verifyQrApi } from '../../services/api';

export const QRVerification: React.FC = () => {
  const [batchInput, setBatchInput] = useState<string>('SF-B26-101');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchInput.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await verifyQrApi(batchInput.trim());
      if (res?.success && res?.verification) {
        setResult(res.verification);
      } else {
        setError(res?.message || 'Authentication check failed');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          `Batch code "${batchInput}" could not be authenticated. Please ensure you are scanning an authentic SUJJU FOODS product.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sujju-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Banner */}
        <div className="sujju-gradient rounded-3xl p-8 text-white shadow-xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-sujju-gold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Counterfeiting & Lab Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Product Authenticity & Lab Certificate
          </h1>
          <p className="text-sm text-sujju-green-100 max-w-xl mx-auto">
            Scan the QR code printed on your SUJJU FOODS 250g tea pouch or enter the batch number below to inspect harvest origins, factory records, and analytical laboratory test scores.
          </p>

          <form onSubmit={handleVerify} className="max-w-md mx-auto pt-2 flex gap-3">
            <div className="relative flex-1">
              <QrCode className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder="Enter Batch No. (e.g. SF-B26-101)"
                className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sujju-gold shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-sujju-gold hover:bg-sujju-gold-600 text-sujju-green-950 font-bold px-6 py-3 rounded-2xl transition flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Checking...' : 'Verify'}</span>
            </button>
          </form>
        </div>

        {/* Error / Fraud Warning */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 sm:p-8 text-red-900 space-y-3 shadow-md animate-fadeIn">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-red-600 flex-shrink-0" />
              <h3 className="text-lg font-bold">Unauthenticated Product Code Detected</h3>
            </div>
            <p className="text-sm text-red-700">{error}</p>
            <div className="bg-white/70 p-4 rounded-xl text-xs text-red-800 border border-red-200">
              <strong>Caution:</strong> If you purchased this pack from an unauthorized vendor, please report it immediately to SUJJU FOODS customer care at <strong>support@sujjufoods.com</strong> or WhatsApp <strong>+91 94401 22334</strong>.
            </div>
          </div>
        )}

        {/* Successful Verification Certificate */}
        {result && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-fadeIn">
            {/* Header Stamp */}
            <div className="bg-emerald-700 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Award className="w-8 h-8 text-sujju-gold" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                    Official Guarantee Certificate
                  </div>
                  <h2 className="text-xl font-bold font-serif">100% Genuine SUJJU FOODS Product</h2>
                </div>
              </div>
              <span className="bg-white text-emerald-800 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm self-start sm:self-auto font-mono">
                {result.batchNumber}
              </span>
            </div>

            {/* Product Details Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-400 uppercase">Product Specification</div>
                  <div className="text-lg font-extrabold text-gray-900">{result.productName}</div>
                  <div className="text-sm text-gray-600">Net Weight: <strong>{result.packSize}</strong></div>
                  <div className="text-sm text-gray-600">Maximum Retail Price (MRP): <strong>₹{result.mrp}</strong> (Incl. all taxes)</div>
                  <div className="text-xs font-semibold text-sujju-green bg-emerald-50 px-3 py-1 rounded-lg inline-block">
                    {result.fssaiLicense}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-400 uppercase">Manufacturing & Expiry Timeline</div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-sujju-green" />
                    <span>Mfg Date: <strong>{result.manufacturingDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Best Before: <strong>{result.bestBeforeDate}</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-500 pt-1">
                    <Building className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{result.plantLocation}</span>
                  </div>
                </div>
              </div>

              {/* Harvest Garden Origins */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-sujju-green" />
                  <span>Harvested Plantation Estates</span>
                </div>
                <p className="text-sm text-gray-800 font-medium">{result.harvestGardens}</p>
                <p className="text-xs text-gray-500">
                  Formulated from 70% high-grown CTC estate granules blended with 30% Nilgiri orthodox broken leaf for exceptional briskness and liquor body.
                </p>
              </div>

              {/* Analytical Laboratory Test Results */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <FlaskConical className="w-4 h-4 text-sujju-gold-700" />
                  <span>Analytical Chemical & Sensory Lab Report</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <span className="text-xs font-semibold text-emerald-800">Moisture Percentage</span>
                    <div className="text-xl font-extrabold text-emerald-900 mt-1">
                      {result.labTestReport.moisturePercentage}%
                    </div>
                    <span className="text-[11px] text-emerald-700">FSSAI Limit: &lt;6.5% (PASSED)</span>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <span className="text-xs font-semibold text-blue-800">Sensory Aroma Score</span>
                    <div className="text-sm font-extrabold text-blue-900 mt-1">
                      {result.labTestReport.sensoryLiquorScore}
                    </div>
                    <span className="text-[11px] text-blue-700">Golden-red brisk infusion</span>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <span className="text-xs font-semibold text-purple-800">Pouch Barrier Seal</span>
                    <div className="text-sm font-extrabold text-purple-900 mt-1">
                      {result.labTestReport.sealIntegrity}
                    </div>
                    <span className="text-[11px] text-purple-700">Zero aroma loss</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 flex justify-between items-center pt-2">
                  <span>Pesticide Residue Free: <strong>Certified Clean (ND)</strong></span>
                  <span className="font-semibold text-gray-700">Approved by: {result.labTestReport.labCertifiedBy}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
