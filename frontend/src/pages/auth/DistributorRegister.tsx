import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Lock,
  User,
  MapPin,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { sendOtpApi, verifyOtpApi, validateSponsor, registerDistributorApi } from '../../services/api';

export const DistributorRegister: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [adminSponsorId, setAdminSponsorId] = useState('SUJJU001');
  const [sponsorInfo, setSponsorInfo] = useState<any>({
    sponsorId: 'SUJJU001',
    sponsorName: 'SUJJU FOODS Central Administration',
    role: 'super_admin',
    isActive: true,
  });
  const [sponsorValidating, setSponsorValidating] = useState(false);
  const [sponsorError, setSponsorError] = useState('');

  const [servicePincodes, setServicePincodes] = useState('530001, 530002, 530016');
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleValidateAdminSponsor = async (code: string) => {
    if (!code || code.length < 3) return;
    setSponsorValidating(true);
    setSponsorError('');
    try {
      const data = await validateSponsor(code);
      if (!['SUJJU001', 'SUJJUADMIN'].includes(data.sponsorId)) {
        setSponsorError('Distributors require an official Admin Sponsor ID (e.g. SUJJU001).');
        setSponsorInfo(null);
        return;
      }
      setSponsorInfo(data);
    } catch (err: any) {
      setSponsorInfo(null);
      setSponsorError('Invalid Admin-issued Sponsor ID');
    } finally {
      setSponsorValidating(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrorMsg('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setErrorMsg('');
    try {
      await sendOtpApi(phone, 'phone');
      setPhoneOtpSent(true);
      setPhoneOtp('123456');
    } catch (err: any) {
      setErrorMsg('Failed to send Phone OTP');
    }
  };

  const handleVerifyPhoneOtp = async () => {
    try {
      await verifyOtpApi(phone, 'phone', phoneOtp);
      setIsPhoneVerified(true);
    } catch (err: any) {
      setErrorMsg('Invalid Phone OTP');
    }
  };

  const handleSendEmailOtp = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Enter a valid email');
      return;
    }
    setErrorMsg('');
    try {
      await sendOtpApi(email, 'email');
      setEmailOtpSent(true);
      setEmailOtp('123456');
    } catch (err: any) {
      setErrorMsg('Failed to send Email OTP');
    }
  };

  const handleVerifyEmailOtp = async () => {
    try {
      await verifyOtpApi(email, 'email', emailOtp);
      setIsEmailVerified(true);
    } catch (err: any) {
      setErrorMsg('Invalid Email OTP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (!sponsorInfo) {
      setErrorMsg('An Admin-approved Sponsor ID is mandatory for distributor onboarding');
      return;
    }

    const pincodesArray = servicePincodes.split(',').map((p) => p.trim()).filter((p) => /^[1-9][0-9]{5}$/.test(p));
    if (pincodesArray.length === 0) {
      setErrorMsg('Provide at least one valid 6-digit Indian PIN code for territory coverage');
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerDistributorApi({
        fullName,
        phone,
        email,
        password,
        confirmPassword,
        adminSponsorId: sponsorInfo.sponsorId,
        servicePincodes: pincodesArray,
      });

      setSuccessInfo(res);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Distributor registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl border border-sujju-cream-300 p-8 sm:p-12 space-y-8">
        {!successInfo ? (
          <>
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-sujju-gold uppercase tracking-wider block">
                Partner With Us
              </span>
              <h1 className="text-3xl font-extrabold text-sujju-green-950 font-serif">
                Distributor Onboarding
              </h1>
              <p className="text-xs text-gray-500">
                Register as an authorized territory distributor. Subject to Super Admin approval.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name / Agency */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Distributor / Agency Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vijay Agency / Srinivas Traders"
                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
                  />
                </div>
              </div>

              {/* Phone + OTP */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">Official Mobile Number *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-sujju-green outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendPhoneOtp}
                    className="bg-sujju-cream-200 hover:bg-sujju-cream-300 text-sujju-green font-bold text-xs px-4 py-2.5 rounded-xl border border-sujju-cream-300"
                  >
                    {phoneOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
                {phoneOtpSent && !isPhoneVerified && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      placeholder="Enter OTP (123456)"
                      className="flex-1 border rounded-xl px-4 py-2 text-xs font-mono text-center tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyPhoneOtp}
                      className="bg-sujju-green text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Verify
                    </button>
                  </div>
                )}
                {isPhoneVerified && (
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified successfully
                  </p>
                )}
              </div>

              {/* Email + OTP */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">Business Email Address *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="business@domain.com"
                      className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    className="bg-sujju-cream-200 hover:bg-sujju-cream-300 text-sujju-green font-bold text-xs px-4 py-2.5 rounded-xl border border-sujju-cream-300"
                  >
                    {emailOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
                {emailOtpSent && !isEmailVerified && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder="Enter OTP (123456)"
                      className="flex-1 border rounded-xl px-4 py-2 text-xs font-mono text-center tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      className="bg-sujju-green text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Verify
                    </button>
                  </div>
                )}
                {isEmailVerified && (
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified successfully
                  </p>
                )}
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 10 chars"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
                  />
                </div>
              </div>

              {/* Admin Sponsor ID */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">Admin-Issued Sponsor ID *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={adminSponsorId}
                    onChange={(e) => setAdminSponsorId(e.target.value.toUpperCase())}
                    placeholder="SUJJU001"
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-sujju-green outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleValidateAdminSponsor(adminSponsorId)}
                    className="bg-sujju-green text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                  >
                    Validate
                  </button>
                </div>
                {sponsorError && <p className="text-xs text-red-600">{sponsorError}</p>}
                {sponsorInfo && (
                  <div className="p-3 bg-sujju-cream-100 rounded-xl border border-sujju-cream-300 text-xs">
                    <span className="text-gray-500">Authorized Admin Sponsor:</span>
                    <strong className="block text-sujju-green font-bold">{sponsorInfo.sponsorName} ({sponsorInfo.sponsorId})</strong>
                  </div>
                )}
              </div>

              {/* Territory Pincodes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Territory Pincodes *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={servicePincodes}
                    onChange={(e) => setServicePincodes(e.target.value)}
                    placeholder="e.g. 530001, 530002, 530016"
                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-xs focus:ring-2 focus:ring-sujju-green outline-none"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Comma-separated list of 6-digit Indian postal codes you wish to serve.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-sujju-green hover:bg-sujju-green-600 text-white font-bold py-3.5 rounded-xl shadow transition text-sm flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Submitting Application...' : 'Submit Distributor Application'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-sujju-green-950 font-serif">Application Submitted!</h2>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              {successInfo.message}
            </p>
            <div className="p-4 bg-gray-50 rounded-2xl border text-xs max-w-sm mx-auto space-y-1 text-left">
              <p><strong>Generated Distributor ID:</strong> {successInfo.distributorId}</p>
              <p><strong>Status:</strong> <span className="text-amber-700 font-bold">Pending Admin Approval</span></p>
              <p><strong>Sponsor ID:</strong> {adminSponsorId}</p>
            </div>
            <div className="pt-4">
              <Link
                to="/login"
                className="bg-sujju-green text-white font-bold px-6 py-2.5 rounded-xl text-xs"
              >
                Go to Portal Login
              </Link>
            </div>
          </div>
        )}

        <div className="text-center pt-4 border-t text-xs text-gray-600">
          Already registered?{' '}
          <Link to="/login" className="text-sujju-green font-bold hover:underline">
            Log In
          </Link>
          <span className="mx-2">•</span>
          <Link to="/customer/register" className="text-sujju-gold font-bold hover:underline">
            Register as Customer
          </Link>
        </div>
      </div>
    </div>
  );
};
