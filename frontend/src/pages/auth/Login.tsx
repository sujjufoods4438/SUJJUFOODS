import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { loginApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('admin@sujjufoods.com');
  const [password, setPassword] = useState('SujjuAdmin@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await loginApi({ identifier, password });
      login(res.token, res.user);

      // Route to role-specific dashboard
      switch (res.user.role) {
        case 'super_admin':
        case 'operations_admin':
        case 'finance_admin':
        case 'content_manager':
          navigate('/admin/dashboard');
          break;
        case 'distributor':
          navigate('/distributor/dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard');
          break;
        case 'customer':
        default:
          navigate('/customer/dashboard');
          break;
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl border border-sujju-cream-300 p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sujju-green flex items-center justify-center text-sujju-gold font-extrabold text-2xl mx-auto shadow-md">
            SF
          </div>
          <h1 className="text-2xl font-extrabold text-sujju-green-950 font-serif">
            SUJJU FOODS Portal Sign In
          </h1>
          <p className="text-xs text-gray-500">
            Sign in to your Customer, Distributor, Employee or Admin workspace.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Registered Mobile Number or Email *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Mobile number or email"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-sujju-green outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">Password *</label>
              <Link to="/forgot-password" className="text-[11px] text-sujju-green hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sujju-green hover:bg-sujju-green-600 text-white font-bold py-3 rounded-xl shadow transition text-sm flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-sujju-cream-100 rounded-xl border border-sujju-cream-300 text-xs text-gray-600 space-y-1">
          <p className="font-bold text-sujju-green-950 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-sujju-gold" /> Default Built-in Admin Access:
          </p>
          <p className="font-mono text-[11px]">admin@sujjufoods.com / SujjuAdmin@2026!</p>
        </div>

        <div className="text-center pt-2 border-t text-xs text-gray-600 space-y-2">
          <p>
            New Customer?{' '}
            <Link to="/customer/register" className="text-sujju-green font-bold hover:underline">
              Create Customer Account
            </Link>
          </p>
          <p>
            Distributor Dealership?{' '}
            <Link to="/distributor/register" className="text-sujju-gold font-bold hover:underline">
              Apply as Distributor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
