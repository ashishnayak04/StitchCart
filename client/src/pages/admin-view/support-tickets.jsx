import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAdminTickets, updateTicketStatus, adminReplyTicket } from "@/store/admin/support-admin-slice";
import { MessageSquare, Filter, Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminSupport() {
  const dispatch = useDispatch();
  const { tickets, isLoading } = useSelector((s) => s.supportAdmin);
  const { user } = useSelector((s) => s.auth);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState("");
  const { toast } = useToast();

  useEffect(() => { dispatch(getAdminTickets(statusFilter)); }, [dispatch, statusFilter]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    await dispatch(adminReplyTicket({ id: selectedTicket._id, userId: user?.id, message: reply }));
    setReply("");
    const updated = await dispatch(getAdminTickets(statusFilter));
    const t = updated.payload?.data?.find((ticket) => ticket._id === selectedTicket._id);
    if (t) setSelectedTicket(t);
    toast({ title: "Reply sent" });
  };

  const handleStatusChange = async (id, status) => {
    await dispatch(updateTicketStatus({ id, status }));
    dispatch(getAdminTickets(statusFilter));
  };

  const statusColors = { open: "bg-green-100 text-green-700", in_progress: "bg-yellow-100 text-yellow-700", resolved: "bg-blue-100 text-blue-700", closed: "bg-gray-100 text-gray-600" };

  if (selectedTicket) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:underline mb-4"><ArrowLeft className="w-4 h-4" /> Back to tickets</button>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">{selectedTicket.subject}</h2>
            <p className="text-sm text-gray-500">From: {selectedTicket.userId?.userName || selectedTicket.userId?.email} · {new Date(selectedTicket.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[selectedTicket.status]}`}>{selectedTicket.status}</span>
            <select value={selectedTicket.status} onChange={(e) => handleStatusChange(selectedTicket._id, e.target.value)} className="border rounded px-2 py-1 text-xs">
              <option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm">
          <p className="text-xs text-gray-400 mb-1">Customer message:</p>
          <p>{selectedTicket.message}</p>
        </div>
        <div className="space-y-3 mb-4">
          {(selectedTicket.replies || []).map((r, i) => (
            <div key={i} className={`p-3 rounded-lg text-sm ${r.userId?._id === user?.id ? "bg-blue-50 ml-8" : "bg-gray-100 mr-8"}`}>
              <p className="text-xs text-gray-500 mb-1">{r.userId?.userName || "Admin"} · {new Date(r.createdAt).toLocaleString()}</p>
              <p>{r.message}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleReply} className="flex gap-2">
          <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply..." className="flex-1 border rounded-md px-3 py-2 text-sm" />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded-md"><Send className="w-4 h-4" /></button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><MessageSquare className="w-5 h-5" /><h1 className="text-2xl font-bold">Support Tickets</h1></div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm">
            <option value="">All</option><option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
          </select>
        </div>
      </div>
      {isLoading ? <p className="text-gray-500">Loading...</p> : tickets.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No tickets.</p>
      ) : (
        <div className="space-y-2">
          {tickets.map((t) => (
            <div key={t._id} onClick={() => setSelectedTicket(t)} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{t.subject}</p>
                  <p className="text-sm text-gray-500 mt-1">{t.message.substring(0, 120)}...</p>
                  <p className="text-xs text-gray-400 mt-1">{t.userId?.userName || t.userId?.email} · {new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[t.status]}`}>{t.status}</span>
                  {t.replies?.length > 0 && <span className="text-xs text-gray-400">{t.replies.length} replies</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
