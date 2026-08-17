import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ShoppingSupportTicket() {
  const { ticketId } = useParams();
  const { user } = useSelector((s) => s.auth);
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    axios.get(`http://localhost:9000/api/shop/support/${ticketId}`, { withCredentials: true })
      .then((r) => { setTicket(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ticketId]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    try {
      const res = await axios.post(`http://localhost:9000/api/shop/support/${ticketId}/reply`, { userId: user.id, message: reply }, { withCredentials: true });
      if (res.data.success) {
        setTicket(res.data.data);
        setReply("");
        toast({ title: "Reply sent" });
      }
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleClose = async () => {
    try {
      await axios.put(`http://localhost:9000/api/shop/support/${ticketId}/close`, {}, { withCredentials: true });
      setTicket({ ...ticket, status: "closed" });
      toast({ title: "Ticket closed" });
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8"><p className="text-gray-500">Loading...</p></div>;
  if (!ticket) return <div className="max-w-2xl mx-auto px-4 py-8"><p className="text-red-500">Ticket not found.</p></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/shop/support" className="flex items-center gap-1 text-sm text-gray-500 hover:underline mb-4"><ArrowLeft className="w-4 h-4" /> Back to tickets</Link>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">{ticket.subject}</h1>
          <p className="text-sm text-gray-400">Created {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${ticket.status === "open" ? "bg-green-100 text-green-700" : ticket.status === "closed" ? "bg-gray-100 text-gray-600" : "bg-yellow-100 text-yellow-700"}`}>{ticket.status}</span>
          {ticket.status !== "closed" && <button onClick={handleClose} className="text-xs border px-3 py-1 rounded-md hover:bg-gray-50">Close ticket</button>}
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <p className="text-sm">{ticket.message}</p>
      </div>
      <div className="space-y-3 mb-6">
        {(ticket.replies || []).map((r, i) => (
          <div key={i} className={`p-3 rounded-lg text-sm ${r.userId?._id === user?.id ? "bg-blue-50 ml-8" : "bg-gray-100 mr-8"}`}>
            <p className="text-xs text-gray-500 mb-1">{r.userId?.userName || "Support"} · {new Date(r.createdAt).toLocaleString()}</p>
            <p>{r.message}</p>
          </div>
        ))}
      </div>
      {ticket.status !== "closed" && (
        <form onSubmit={handleReply} className="flex gap-2">
          <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type a reply..." className="flex-1 border rounded-md px-3 py-2 text-sm" />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded-md"><Send className="w-4 h-4" /></button>
        </form>
      )}
    </div>
  );
}
