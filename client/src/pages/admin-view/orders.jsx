import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrdersForAdmin, updateOrderStatus, refundOrder } from "@/store/admin/order-slice";
import { Search, Package, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { listOfOrders, total, totalPages } = useSelector((s) => s.adminOrder);
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updateForm, setUpdateForm] = useState({ orderStatus: "", trackingNumber: "", trackingUrl: "", note: "" });

  useEffect(() => {
    dispatch(getAllOrdersForAdmin({ page, limit: 15, search, status: statusFilter }));
  }, [dispatch, page, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(getAllOrdersForAdmin({ page: 1, limit: 15, search, status: statusFilter }));
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setUpdateForm({ orderStatus: order.orderStatus, trackingNumber: order.trackingNumber || "", trackingUrl: order.trackingUrl || "", note: "" });
    setShowDetails(true);
  };

  const handleUpdate = async () => {
    await dispatch(updateOrderStatus({ id: selectedOrder._id, ...updateForm }));
    dispatch(getAllOrdersForAdmin({ page, limit: 15, search, status: statusFilter }));
    setShowDetails(false);
    toast({ title: "Order updated" });
  };

  const handleRefund = async () => {
    if (!confirm("Process refund?")) return;
    await dispatch(refundOrder({ id: selectedOrder._id, refundReason: "Admin refund" }));
    dispatch(getAllOrdersForAdmin({ page, limit: 15, search, status: statusFilter }));
    toast({ title: "Refund processed" });
  };

  const statusColors = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4"><Package className="w-5 h-5" /><h1 className="text-2xl font-bold">Orders</h1><span className="text-sm text-gray-400">({total})</span></div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order ID, email..." className="w-full border rounded-md pl-9 pr-3 py-2 text-sm" />
          </div>
          <button type="submit" className="bg-black text-white px-4 py-2 rounded-md text-sm">Search</button>
        </form>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="border rounded-md px-3 py-2 text-sm">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b text-left">
            <th className="py-3 px-3">Order ID</th><th className="py-3 px-3">Customer</th><th className="py-3 px-3">Items</th><th className="py-3 px-3">Total</th><th className="py-3 px-3">Status</th><th className="py-3 px-3">Payment</th><th className="py-3 px-3">Date</th><th className="py-3 px-3">Action</th>
          </tr></thead>
          <tbody>
            {(listOfOrders || []).map((o) => (
              <tr key={o._id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => openDetails(o)}>
                <td className="py-3 px-3 font-mono text-xs">{o._id.slice(-8)}</td>
                <td className="py-3 px-3">{o.userId?.userName || o.addressInfo?.phone || "-"}</td>
                <td className="py-3 px-3">{o.cartItems?.length || 0}</td>
                <td className="py-3 px-3 font-mono">₹{Number(o.totalAmount).toLocaleString("en-IN")}</td>
                <td className="py-3 px-3"><span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[o.orderStatus]}`}>{o.orderStatus}</span></td>
                <td className="py-3 px-3 text-xs">{o.paymentMethod}</td>
                <td className="py-3 px-3 text-xs">{new Date(o.orderDate).toLocaleDateString()}</td>
                <td className="py-3 px-3"><button className="text-blue-600 text-xs hover:underline">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">Page {page} of {totalPages || 1}</p>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="border px-3 py-1 rounded text-sm disabled:opacity-50">Prev</button>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="border px-3 py-1 rounded text-sm disabled:opacity-50">Next</button>
        </div>
      </div>

      {/* Order Detail Dialog */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetails(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Order #{selectedOrder._id.slice(-8)}</h2>
              <button onClick={() => setShowDetails(false)}><X className="w-5 h-5" /></button>
            </div>

            {/* Items */}
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">Items</h3>
              <div className="space-y-2">
                {selectedOrder.cartItems?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />
                    <span className="flex-1">{item.title}</span>
                    <span className="font-mono">₹{Number(item.price) * item.quantity}</span>
                    <span className="text-gray-400">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm space-y-1">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">₹{Number(selectedOrder.subtotalAmount || 0).toLocaleString("en-IN")}</span></div>
              {selectedOrder.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-mono">-₹{Number(selectedOrder.discountAmount).toLocaleString("en-IN")}</span></div>}
              <div className="flex justify-between"><span>Shipping</span><span className="font-mono">₹{Number(selectedOrder.shippingAmount || 0).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span>GST</span><span className="font-mono">₹{Number(selectedOrder.taxAmount || 0).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between font-bold border-t pt-1"><span>Total</span><span className="font-mono">₹{Number(selectedOrder.totalAmount).toLocaleString("en-IN")}</span></div>
            </div>

            {/* Address */}
            <div className="mb-4 text-sm">
              <h3 className="font-semibold mb-1">Shipping Address</h3>
              <p>{selectedOrder.addressInfo?.address}, {selectedOrder.addressInfo?.city} - {selectedOrder.addressInfo?.pincode}</p>
              <p>{selectedOrder.addressInfo?.phone}</p>
            </div>

            {/* Status History */}
            {selectedOrder.statusHistory?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-2">Status History</h3>
                <div className="space-y-1">
                  {selectedOrder.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-400">{new Date(h.date).toLocaleString()}</span>
                      <span className="capitalize font-medium">{h.status}</span>
                      {h.note && <span className="text-gray-500">— {h.note}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Update Form */}
            <div className="border-t pt-4 space-y-3">
              <h3 className="font-semibold text-sm">Update Order</h3>
              <div className="grid grid-cols-2 gap-3">
                <select value={updateForm.orderStatus} onChange={(e) => setUpdateForm({ ...updateForm, orderStatus: e.target.value })} className="border rounded-md px-3 py-2 text-sm">
                  <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                </select>
                <input value={updateForm.trackingNumber} onChange={(e) => setUpdateForm({ ...updateForm, trackingNumber: e.target.value })} placeholder="Tracking number" className="border rounded-md px-3 py-2 text-sm" />
                <input value={updateForm.trackingUrl} onChange={(e) => setUpdateForm({ ...updateForm, trackingUrl: e.target.value })} placeholder="Tracking URL" className="border rounded-md px-3 py-2 text-sm" />
                <input value={updateForm.note} onChange={(e) => setUpdateForm({ ...updateForm, note: e.target.value })} placeholder="Note (optional)" className="border rounded-md px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleUpdate} className="bg-black text-white px-4 py-2 rounded-md text-sm">Update Status</button>
                {selectedOrder.paymentStatus === "paid" && selectedOrder.refundStatus === "none" && (
                  <button onClick={handleRefund} className="border border-red-300 text-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-50">Refund</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
