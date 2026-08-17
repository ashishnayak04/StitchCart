import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getReturnRequests, processReturn } from "@/store/admin/return-admin-slice";
import { RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminReturns() {
  const dispatch = useDispatch();
  const { returns, isLoading } = useSelector((s) => s.adminReturn);
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();

  useEffect(() => { dispatch(getReturnRequests(statusFilter)); }, [dispatch, statusFilter]);

  const handleProcess = async (id, action) => {
    if (!confirm(`Are you sure you want to ${action} this return?`)) return;
    await dispatch(processReturn({ id, action }));
    toast({ title: `Return ${action}d` });
  };

  const statusColors = { requested: "bg-yellow-100 text-yellow-700", approved: "bg-blue-100 text-blue-700", received: "bg-purple-100 text-purple-700", refunded: "bg-green-100 text-green-700" };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><RotateCcw className="w-5 h-5" /><h1 className="text-2xl font-bold">Return Requests</h1></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm">
          <option value="">All</option>
          <option value="requested">Requested</option>
          <option value="approved">Approved</option>
          <option value="received">Received</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {isLoading ? <p className="text-gray-500">Loading...</p> : returns.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No return requests.</p>
      ) : (
        <div className="space-y-3">
          {returns.map((o) => (
            <div key={o._id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs">#{o._id.slice(-8)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[o.returnStatus]}`}>{o.returnStatus}</span>
                  </div>
                  <p className="text-sm font-medium">{o.userId?.userName || o.userId?.email || "User"}</p>
                  <p className="text-sm text-gray-600 mt-1">Reason: {o.returnReason}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Requested: {o.returnRequestedAt ? new Date(o.returnRequestedAt).toLocaleString() : "-"}
                    {o.deliveredAt && <> · Delivered: {new Date(o.deliveredAt).toLocaleDateString()}</>}
                  </p>
                  <p className="text-xs text-gray-400">Total: ₹{Number(o.totalAmount).toLocaleString("en-IN")} · Items: {o.cartItems?.length}</p>
                </div>
                {o.returnStatus === "requested" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleProcess(o._id, "approve")} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md text-xs"><CheckCircle className="w-3 h-3" /> Approve</button>
                    <button onClick={() => handleProcess(o._id, "reject")} className="flex items-center gap-1 border border-red-300 text-red-600 px-3 py-1.5 rounded-md text-xs hover:bg-red-50"><XCircle className="w-3 h-3" /> Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
