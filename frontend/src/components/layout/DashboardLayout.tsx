import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  Layers,
  Factory,
  CheckSquare,
  DollarSign,
  TrendingUp,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  ShieldCheck,
  Award,
  Sparkles,
} from 'lucide-react';
import { CustomerChatbot } from '../common/CustomerChatbot';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

interface DashboardLayoutProps {
  portalTitle: string;
  portalRole: 'admin' | 'customer' | 'distributor' | 'employee';
  navItems: NavItem[];
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  portalTitle,
  portalRole,
  navItems,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getRoleBadge = () => {
    switch (portalRole) {
      case 'admin':
        return { label: 'Admin Command', bg: 'bg-red-900/40 text-red-300 border-red-700' };
      case 'distributor':
        return { label: 'Distributor Operations', bg: 'bg-amber-900/40 text-amber-300 border-amber-700' };
      case 'customer':
        return { label: 'Verified Customer', bg: 'bg-emerald-900/40 text-emerald-300 border-emerald-700' };
      case 'employee':
        return { label: 'Staff Portal', bg: 'bg-blue-900/40 text-blue-300 border-blue-700' };
    }
  };

  const badge = getRoleBadge();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-sujju-green-950 text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-sujju-green-900 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-sujju-green-900 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sujju-gold flex items-center justify-center text-sujju-green-900 font-extrabold text-xl shadow">
              SF
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight font-serif block">
                SUJJU FOODS
              </span>
              <span className="text-[10px] text-sujju-gold tracking-widest uppercase font-semibold">
                Enterprise Hub
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Portal Info Badge */}
        <div className="px-6 py-4 bg-sujju-green-900/50 border-b border-sujju-green-900/80">
          <p className="text-xs text-sujju-green-300 font-medium">{portalTitle}</p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}
            >
              {badge.label}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-sujju-green-800 text-white shadow-sm font-semibold'
                    : 'text-sujju-green-200 hover:bg-sujju-green-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-sujju-gold' : 'text-sujju-green-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-sujju-gold/20 text-sujju-gold text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User / Portal Switcher */}
        <div className="p-4 border-t border-sujju-green-900 bg-sujju-green-950/80">
          <div className="flex items-center justify-between mb-3 px-2">
            <Link to="/" className="text-xs text-sujju-green-300 hover:text-white transition">
              ← Back to Main Website
            </Link>
          </div>
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-sujju-green-900 hover:bg-sujju-green-800 text-sujju-green-200 hover:text-white py-2 rounded-lg text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>{portalTitle}</span>
              <ChevronRight className="w-4 h-4 text-gray-400 hidden sm:inline" />
              <span className="text-sm font-medium text-gray-500 hidden sm:inline">
                Real-Time Database Operations
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sujju-gold rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-sujju-green text-sujju-gold flex items-center justify-center font-bold text-xs shadow-sm">
              SF
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>

        {portalRole === 'customer' && <CustomerChatbot />}
      </div>
    </div>
  );
};
