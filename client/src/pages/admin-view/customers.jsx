import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllCustomers } from "@/store/admin/analytics-slice";
import { Users, Download, Search, Eye, Ban, ArrowLeft, Package, Star, ShoppingBag } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

export default function AdminCustomers() {
  const dispatch = useDispatch();
  const { customers, total, totalPages, isLoading } = useSelector((s) => s.adminAnalytics);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const { toast } = useToast();

  useEffect(() => { dispatch(getAllCustomers({ page, limit: 20, search })); }, [dispatch, page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); dispatch(getAllCustomers({ page: 1, limit: 20, search })); };

  const loadDetail = async (id) => {
    setLoadingDetail(true);
    try {
      const res = await axios.get(`http://localhost:9000/api/admin/analytics/customers/${id}`, { withCredentials: true });
      if (res.data.success) setDetail(res.data.data);
    } catch (e) { console.log(e); }
    setLoadingDetail(false);
  };

  const handleBlock = async (id) => {
    if (!confirm("Toggle block this user?")) return;
    try {
      const res = await axios.put(`http://localhost:9000/api/admin/analytics/customers/${id}/block`, {}, { withCredentials: true });
      toast({ title: res.data.data.role === "blocked" ? "User blocked" : "User unblocked" });
      dispatch(getAllCustomers({ page, limit: 20, search }));
    } catch (e) { toast({ title: "Error", variant: "destructive" }); }
  };

  if (detail) {
    return (
      <div className="p-4 md:p-6">
        <button onClick={() => setDetail(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:underline mb-4"><ArrowLeft className="w-4 h-4" /> Back</button>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">{detail.user.userName?.[0]?.toUpperCase()}</div>
          <div>
            <h2 className="text-xl font-bold">{detail.user.userName}</h2>
            <p className="text-sm text-gray-500">{detail.user.email}</p>
            {detail.user.phone && <p className="text-sm text-gray-500">{detail.user.phone}</p>}
            <div className="flex gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1"><ShoppingBag className="w-4 h-4" /> {detail.totalOrders} orders</span>
              <span className="flex items-center gap-1"><Package className="w-4 h-4" /> ₹{Number(detail.totalSpent).toLocaleString("en-IN")} spent</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4" /> {detail.loyalty?.points || 0} points</span>
            </div>
          </div>
        </div>
        <h3 className="font-semibold mb-3">Order History</h3>
        {detail.orders.length === 0 ? <p className="text-gray-400 text-sm">No orders.</p> : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b text-left"><th className="py-3 px-3">Order</th><th className="py-3 px-3">Date</th><th className="py-3 px-3">Status</th><th className="py-3 px-3">Total</th></tr></thead>
              <tbody>
                {detail.orders.map((o) => (
                  <tr key={o._id} className="border-b"><td className="py-3 px-3 font-mono text-xs">{o._id.slice(-8)}</td><td className="py-3 px-3">{new Date(o.orderDate).toLocaleDateString()}</td><td className="py-3 px-3 capitalize">{o.orderStatus}</td><td className="py-3 px-3 font-mono">₹{Number(o.totalAmount).toLocaleString("en-IN")}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><Users className="w-5 h-5" /><h1 className="text-2xl font-bold">Customers</h1><span className="text-sm text-gray-400">({total})</span></div>
        <button onClick={() => window.open("http://localhost:9000/api/admin/export/customers", "_blank")} className="flex items-center gap-1 border px-3 py-2 rounded-md text-sm hover:bg-gray-50"><Download className="w-4 h-4" /> Export CSV</button>
      </div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, phone..." className="w-full border rounded-md pl-9 pr-3 py-2 text-sm" /></div>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded-md text-sm">Search</button>
      </form>
      {isLoading ? <p className="text-gray-500">Loading...</p> : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b text-left">
              <th className="py-3 px-3">Name</th><th className="py-3 px-3">Email</th><th className="py-3 px-3">Phone</th><th className="py-3 px-3">Orders</th><th className="py-3 px-3">Spent</th><th className="py-3 px-3">Verified</th><th className="py-3 px-3">Actions</th>
            </tr></thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">{c.userName}</td>
                  <td className="py-3 px-3">{c.email}</td>
                  <td className="py-3 px-3">{c.phone || "-"}</td>
                  <td className="py-3 px-3">{c.orderCount || 0}</td>
                  <td className="py-3 px-3 font-mono">₹{Number(c.totalSpent || 0).toLocaleString("en-IN")}</td>
                  <td className="py-3 px-3">{c.isEmailVerified ? <span className="text-green-600 text-xs">Yes</span> : <span className="text-gray-400 text-xs">No</span>}</td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1">
                      <button onClick={() => loadDetail(c._id)} className="text-blue-500 hover:text-blue-700 p-1"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleBlock(c._id)} className={`${c.role === "blocked" ? "text-green-500" : "text-red-500"} hover:opacity-70 p-1`}><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">Page {page} of {totalPages || 1}</p>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="border px-3 py-1 rounded text-sm disabled:opacity-50">Prev</button>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="border px-3 py-1 rounded text-sm disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
