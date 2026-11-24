import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { sendOtpApi, verifyOtpApi, resetPasswordApi } from '../../services/api';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrorMsg('Enter your registered 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    try {
      await sendOtpApi(phone, 'phone');
      setOtpSent(true);
      setOtp('123456');
    } catch {
      setErrorMsg('Failed to send OTP');
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const res = await resetPasswordApi({
        phone,
        otp,
        newPassword,
        confirmPassword,
      });

      setSuccessMsg(res.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Password reset failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl border border-sujju-cream-300 p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-sujju-green-950 font-serif">
            Reset Password
          </h1>
          <p className="text-xs text-gray-500">
            Verify your registered mobile number using 6-digit OTP to set a new password.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Registered Mobile Number *</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile"
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-sujju-green outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                className="bg-sujju-cream-200 hover:bg-sujju-cream-300 text-sujju-green font-bold text-xs px-4 py-2.5 rounded-xl border border-sujju-cream-300"
              >
                {otpSent ? 'Resend' : 'Send OTP'}
              </button>
            </div>
          </div>

          {otpSent && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Enter 6-digit OTP *</label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono text-center tracking-widest font-bold"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">New Password (Min 10 chars) *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New strong password"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-sujju-green hover:bg-sujju-green-600 text-white font-bold py-3 rounded-xl shadow transition text-sm flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Resetting Password...' : 'Save New Password'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t text-xs text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-sujju-green font-bold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
