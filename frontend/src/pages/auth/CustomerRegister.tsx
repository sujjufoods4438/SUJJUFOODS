import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  Lock, 
  User, 
  Share2, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { sendOtpApi, verifyOtpApi, validateSponsor, registerCustomerApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export const CustomerRegister: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

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

  const [sponsorCode, setSponsorCode] = useState('SUJJU001');
  const [sponsorInfo, setSponsorInfo] = useState<any>({
    sponsorId: 'SUJJU001',
    sponsorName: 'SUJJU FOODS Central Administration',
    role: 'super_admin',
    isActive: true,
  });
  const [sponsorValidating, setSponsorValidating] = useState(false);
  const [sponsorError, setSponsorError] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 10) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[a-z]/.test(password) && /[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  };

  const strength = getPasswordStrength();

  const handleValidateSponsor = async (code: string) => {
    if (!code || code.length < 3) return;
    setSponsorValidating(true);
    setSponsorError('');
    try {
      const data = await validateSponsor(code);
      setSponsorInfo(data);
    } catch (err: any) {
      setSponsorInfo(null);
      setSponsorError(err.response?.data?.message || 'Invalid sponsor code');
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
      setPhoneOtp('123456'); // Pre-fill mock in dev
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to send OTP');
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
      setErrorMsg('Enter a valid email address');
      return;
    }
    setErrorMsg('');
    try {
      await sendOtpApi(email, 'email');
      setEmailOtpSent(true);
      setEmailOtp('123456'); // Pre-fill mock in dev
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to send Email OTP');
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

    if (strength < 75) {
      setErrorMsg('Password must be at least 10 characters long, including uppercase, lowercase, numbers, and special symbols');
      return;
    }

    if (!sponsorInfo) {
      setErrorMsg('A valid active Sponsor or Referral code is required for registration');
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerCustomerApi({
        fullName,
        phone,
        email,
        password,
        confirmPassword,
        sponsorCode: sponsorInfo.sponsorId,
      });

      login(res.token, res.user);
      navigate('/customer/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl border border-sujju-cream-300 p-8 sm:p-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sujju-green flex items-center justify-center text-sujju-gold font-extrabold text-2xl mx-auto shadow-md">
            SF
          </div>
          <h1 className="text-3xl font-extrabold text-sujju-green-950 font-serif">
            Customer Registration
          </h1>
          <p className="text-xs text-gray-500">
            Create your account to order farm-fresh SUJJU FOODS tea with 24-hour delivery.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Legal Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
              />
            </div>
          </div>

          {/* Phone + OTP */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">Mobile Number (India +91) *</label>
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
                className="bg-sujju-cream-200 hover:bg-sujju-cream-300 text-sujju-green font-bold text-xs px-4 py-2.5 rounded-xl border border-sujju-cream-300 transition"
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
                  placeholder="Enter 6-digit OTP (123456)"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-xs font-mono text-center tracking-widest"
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
                <CheckCircle2 className="w-3.5 h-3.5" /> Mobile number verified successfully
              </p>
            )}
          </div>

          {/* Email + OTP */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">Email Address *</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleSendEmailOtp}
                className="bg-sujju-cream-200 hover:bg-sujju-cream-300 text-sujju-green font-bold text-xs px-4 py-2.5 rounded-xl border border-sujju-cream-300 transition"
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
                  placeholder="Enter 6-digit OTP (123456)"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-xs font-mono text-center tracking-widest"
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
                <CheckCircle2 className="w-3.5 h-3.5" /> Email address verified successfully
              </p>
            )}
          </div>

          {/* Password & Confirm */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Create Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 10 chars, uppercase, lowercase, number & symbol"
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength < 50 ? 'bg-red-500' : strength < 100 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Strength: {strength < 50 ? 'Weak' : strength < 100 ? 'Moderate' : 'Strong & Compliant'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sponsor / Referral Code */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">Sponsor / Referral Code *</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Share2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={sponsorCode}
                  onChange={(e) => setSponsorCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUJJU001 or Distributor Code"
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono uppercase font-bold focus:ring-2 focus:ring-sujju-green outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => handleValidateSponsor(sponsorCode)}
                className="bg-sujju-green-100 text-sujju-green hover:bg-sujju-green-200 text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                {sponsorValidating ? 'Checking...' : 'Check'}
              </button>
            </div>

            {sponsorError && <p className="text-xs text-red-600">{sponsorError}</p>}

            {sponsorInfo && (
              <div className="p-3 bg-sujju-cream-100 rounded-xl border border-sujju-cream-300 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 block">Verified Sponsor:</span>
                  <strong className="text-sujju-green-950 font-bold">{sponsorInfo.sponsorName}</strong>
                </div>
                <span className="bg-sujju-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ID: {sponsorInfo.sponsorId}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-sujju-green hover:bg-sujju-green-600 text-white font-bold py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
          >
            <span>{submitting ? 'Creating Customer Account...' : 'Complete Customer Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 border-t text-xs text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-sujju-green font-bold hover:underline">
            Log In Here
          </Link>
          <span className="mx-2">•</span>
          <Link to="/distributor/register" className="text-sujju-gold font-bold hover:underline">
            Apply as Distributor
          </Link>
        </div>
      </div>
    </div>
  );
};
