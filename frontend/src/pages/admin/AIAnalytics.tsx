import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Sparkles,
  Bot,
  Send,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  LayoutDashboard,
  Users,
  Truck,
  Package,
  Factory,
  Layers,
  DollarSign,
  CheckSquare
} from 'lucide-react';
import { fetchAiInsightsApi } from '../../services/api';

export const AIAnalytics: React.FC = () => {
  const adminNav = [
    { label: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Customers', path: '/admin/customers', icon: <Users className="w-4 h-4" /> },
    { label: 'Distributors', path: '/admin/distributors', icon: <Truck className="w-4 h-4" /> },
    { label: 'Orders & Dispatch', path: '/admin/orders', icon: <Package className="w-4 h-4" /> },
    { label: 'Manufacturing & Batches', path: '/admin/manufacturing', icon: <Factory className="w-4 h-4" /> },
    { label: 'Raw Material Inventory', path: '/admin/inventory', icon: <Layers className="w-4 h-4" /> },
    { label: 'Suppliers & POs', path: '/admin/suppliers', icon: <Truck className="w-4 h-4" /> },
    { label: 'AI Business Intelligence', path: '/admin/ai-analytics', icon: <Bot className="w-4 h-4" /> },
    { label: 'Collections & Reconciliation', path: '/admin/collections', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Daily Reports', path: '/admin/reports', icon: <CheckSquare className="w-4 h-4" /> },
  ];

  const [query, setQuery] = useState<string>('Assess weekly sales velocity, tea leaf depletion rates, and 24h delivery SLA risk');
  const [loading, setLoading] = useState<boolean>(false);
  const [insights, setInsights] = useState<any | null>(null);

  const runAnalysis = async (customQuery?: string) => {
    try {
      setLoading(true);
      const res = await fetchAiInsightsApi(customQuery || query);
      if (res?.success) {
        setInsights(res.insights);
      }
    } catch (err) {
      console.error('Failed to run AI analysis', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  return (
    <DashboardLayout portalTitle="AI Business Intelligence" portalRole="admin" navItems={adminNav}>
      <div className="space-y-8">
        {/* Header */}
        <div className="sujju-gradient rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-sujju-gold text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Predictive Decision Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
              SUJJU AI Executive Copilot
            </h2>
            <p className="text-xs text-sujju-green-200 mt-1">
              Analyzes real-time orders, distributor delivery speeds, raw inventory depletion, and margin optimization.
            </p>
          </div>
        </div>

        {/* AI Query Console */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-sujju-green" />
            <h3 className="text-lg font-bold text-gray-900">Ask Executive Copilot</h3>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              runAnalysis();
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about tea leaf reorder alerts, cash handover risks, territory demand..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-sujju-green focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-sujju-green hover:bg-sujju-green-800 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 shadow disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Analyzing...' : 'Generate Insights'}</span>
            </button>
          </form>

          {/* Quick Prompt Pills */}
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <span className="text-gray-400 self-center">Suggested queries:</span>
            <button
              type="button"
              onClick={() => {
                setQuery('Predict CTC tea stock depletion under 1,000 packs/week surge');
                runAnalysis('Predict CTC tea stock depletion under 1,000 packs/week surge');
              }}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
            >
              🍵 CTC Raw Stock Depletion
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('Check distributor 24-hour SLA delays in Visakhapatnam zone');
                runAnalysis('Check distributor 24-hour SLA delays in Visakhapatnam zone');
              }}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
            >
              🚚 24-Hour SLA Delivery Bottlenecks
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('Analyze cash vs UPI collection reconciliation ratio');
                runAnalysis('Analyze cash vs UPI collection reconciliation ratio');
              }}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
            >
              💵 Cash vs UPI Reconciliation Ratio
            </button>
          </div>
        </div>

        {/* AI Recommendations & Velocity Cards */}
        {insights && (
          <div className="space-y-6">
            {/* Executive Summary */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Executive Summary</span>
              </div>
              <p className="text-sm text-emerald-950 font-medium leading-relaxed">
                {insights.summary}
              </p>
            </div>

            {/* Velocity Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500">Daily Sales Velocity</span>
                <div className="text-2xl font-extrabold text-gray-900 mt-1">
                  {insights.salesVelocity.averageDailyPacksSold} <span className="text-xs font-medium">packs/day</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500">Gross Revenue Run-Rate</span>
                <div className="text-2xl font-extrabold text-sujju-green mt-1">
                  ₹{insights.salesVelocity.revenueRunRateDaily}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500">Active Customer Base</span>
                <div className="text-2xl font-extrabold text-gray-900 mt-1">
                  {insights.salesVelocity.activeCustomerCount}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500">Distributor Retention</span>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                  {insights.salesVelocity.distributorRetentionRate}
                </div>
              </div>
            </div>

            {/* Strategic Action Items */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-gray-900">Strategic Recommendations & Automated Signals</h3>
              </div>

              <div className="space-y-4">
                {insights.recommendations?.map((rec: any, idx: number) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase px-2.5 py-0.5 bg-sujju-green/10 text-sujju-green rounded">
                        {rec.area}
                      </span>
                      <span className="text-[11px] text-gray-400">High Impact</span>
                    </div>
                    <p className="text-xs text-gray-700">
                      <strong>Observation:</strong> {rec.observation}
                    </p>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-900 font-medium flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-sujju-gold-700 flex-shrink-0 mt-0.5" />
                      <span><strong>Recommended Action:</strong> {rec.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
