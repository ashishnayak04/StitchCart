import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDashboardStats, getRevenueChart, getTopProducts } from "@/store/admin/analytics-slice";
import { BarChart3, DollarSign, ShoppingCart, TrendingUp, AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AdminAnalytics() {
  const dispatch = useDispatch();
  const { stats, revenue, topProducts } = useSelector((s) => s.adminAnalytics);
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [revenueByBrand, setRevenueByBrand] = useState([]);
  const [couponPerf, setCouponPerf] = useState([]);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getRevenueChart(period));
    dispatch(getTopProducts());
    axios.get(`http://localhost:9000/api/admin/analytics/revenue-by-category`, { withCredentials: true }).then((r) => setRevenueByCategory(r.data.data || []));
    axios.get(`http://localhost:9000/api/admin/analytics/revenue-by-brand`, { withCredentials: true }).then((r) => setRevenueByBrand(r.data.data || []));
    axios.get(`http://localhost:9000/api/admin/analytics/coupon-performance`, { withCredentials: true }).then((r) => setCouponPerf(r.data.data || []));
  }, [period]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { dispatch(getRevenueChart(period)); }, [dispatch, period]);

  const kpis = [
    { label: "Today's Revenue", value: `₹${Number(stats?.todayRevenue || 0).toLocaleString("en-IN")}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Today's Orders", value: stats?.todayOrders || 0, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Month Revenue", value: `₹${Number(stats?.monthRevenue || 0).toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50", sub: stats?.revenueChange ? `${stats.revenueChange > 0 ? "+" : ""}${stats.revenueChange}% vs last month` : null },
    { label: "Avg Order Value", value: `₹${Number(stats?.avgOrderValue || 0).toLocaleString("en-IN")}`, icon: BarChart3, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const statusColors = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };

  const maxRevenue = Math.max(...revenue.map((r) => r.revenue || 0), 1);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className={`${k.bg} rounded-xl p-4 border`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">{k.label}</span>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className="text-xl md:text-2xl font-bold">{k.value}</p>
              {k.sub && <p className="text-xs text-gray-500 mt-1">{k.sub}</p>}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Pending Orders", value: stats?.pendingOrders || 0, to: "/admin/orders", color: "text-yellow-600" },
          { label: "Return Requests", value: stats?.pendingReturns || 0, to: "/admin/returns", color: "text-red-600" },
          { label: "Low Stock Items", value: stats?.lowStockProducts?.length || 0, to: "/admin/inventory", color: "text-orange-600" },
          { label: "Support Tickets", value: stats?.unreadTickets || 0, to: "/admin/support", color: "text-blue-600" },
        ].map((q, i) => (
          <Link key={i} to={q.to} className="border rounded-lg p-3 hover:bg-gray-50 transition group">
            <p className={`text-2xl font-bold ${q.color}`}>{q.value}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">{q.label} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" /></p>
          </Link>
        ))}
      </div>

      {/* Revenue Chart (visual bars) + Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Revenue Trend</h2>
          {revenue.length === 0 ? <p className="text-gray-400 text-sm">No data</p> : (
            <div className="flex items-end gap-1 h-48 overflow-x-auto">
              {revenue.map((r, i) => (
                <div key={i} className="flex flex-col items-center flex-1 min-w-[20px]" title={`${r._id}: ₹${Number(r.revenue).toLocaleString("en-IN")} (${r.orders} orders)`}>
                  <div className="w-full bg-black rounded-t" style={{ height: `${(r.revenue / maxRevenue) * 100}%`, minHeight: 2 }} />
                  {revenue.length <= 15 && <span className="text-[9px] text-gray-400 mt-1 rotate-45 origin-left">{r._id?.slice(5)}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Orders by Status</h2>
          <div className="space-y-2">
            {(stats?.ordersByStatus || []).map((s) => (
              <div key={s._id} className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[s._id] || "bg-gray-100"}`}>{s._id}</span>
                <span className="font-mono text-sm">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Category + Brand + Coupons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Revenue by Category</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {revenueByCategory.slice(0, 8).map((c) => (
              <div key={c._id || "uncategorized"} className="flex items-center justify-between text-sm">
                <span className="truncate">{c._id || "Uncategorized"}</span>
                <span className="font-mono">₹{Number(c.revenue).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Revenue by Brand</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {revenueByBrand.slice(0, 8).map((b) => (
              <div key={b._id || "unknown"} className="flex items-center justify-between text-sm">
                <span className="truncate">{b._id || "Unknown"}</span>
                <span className="font-mono">₹{Number(b.revenue).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Top Coupons</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {couponPerf.length === 0 ? <p className="text-gray-400 text-sm">No coupon usage</p> : couponPerf.slice(0, 8).map((c) => (
              <div key={c._id} className="flex items-center justify-between text-sm">
                <span className="font-mono">{c._id}</span>
                <div className="text-right">
                  <span className="text-xs text-gray-500">{c.orders} uses</span>
                  <span className="block font-mono">-₹{Number(c.totalDiscount).toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Products + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {(stats?.recentOrders || []).map((o) => (
              <div key={o._id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-mono text-xs">{o._id.slice(-6)}</span>
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${statusColors[o.orderStatus]}`}>{o.orderStatus}</span>
                </div>
                <span className="font-mono">₹{Number(o.totalAmount).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Top Products</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {topProducts.slice(0, 8).map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="truncate flex-1 mr-2">{p.title}</span>
                <span className="text-gray-500">{p.totalSold} sold</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-orange-600 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Low Stock</h2>
            <Link to="/admin/inventory" className="text-xs text-blue-600 hover:underline">Manage</Link>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {(stats?.lowStockProducts || []).slice(0, 8).map((p) => (
              <div key={p._id} className="flex items-center justify-between text-sm">
                <span className="truncate">{p.title}</span>
                <span className={`font-mono ${p.totalStock <= 2 ? "text-red-600 font-bold" : "text-yellow-600"}`}>{p.totalStock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentActivity?.length > 0 && (
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3 flex items-center gap-1"><Clock className="w-4 h-4" /> Recent Activity</h2>
          <div className="space-y-2">
            {stats.recentActivity.map((a) => (
              <div key={a._id} className="flex items-center justify-between text-sm">
                <span>{a.userId?.userName || "System"} — <span className="font-medium">{a.action}</span> {a.entity}</span>
                <span className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
