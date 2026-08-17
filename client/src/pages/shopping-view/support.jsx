import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { Plus, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ShoppingSupport() {
  const { user } = useSelector((s) => s.auth);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "", priority: "medium", orderId: "" });
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:9000/api/shop/support/user/${user.id}`, { withCredentials: true })
        .then((r) => { setTickets(r.data.data || []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:9000/api/shop/support/create", { ...form, userId: user.id }, { withCredentials: true });
      if (res.data.success) {
        setTickets([res.data.data, ...tickets]);
        setShowForm(false);
        setForm({ subject: "", message: "", priority: "medium", orderId: "" });
        toast({ title: "Ticket created" });
      }
    } catch (err) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed", variant: "destructive" });
    }
  };

  const statusColors = { open: "bg-green-100 text-green-700", in_progress: "bg-yellow-100 text-yellow-700", resolved: "bg-blue-100 text-blue-700", closed: "bg-gray-100 text-gray-600" };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Support Tickets</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-md text-sm">
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border mb-6 space-y-3">
          <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="w-full border rounded-md px-3 py-2 text-sm" />
          <textarea placeholder="Describe your issue..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={4} className="w-full border rounded-md px-3 py-2 text-sm" />
          <div className="flex gap-3">
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="border rounded-md px-3 py-2 text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input placeholder="Order ID (optional)" value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })} className="flex-1 border rounded-md px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-md text-sm">Submit</button>
            <button type="button" onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-md text-sm">Cancel</button>
          </div>
        </form>
      )}

      {loading ? <p className="text-gray-500">Loading...</p> : tickets.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No tickets yet. Create one if you need help.</p>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Link key={t._id} to={`/shop/support/${t._id}`} className="block p-4 border rounded-lg hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{t.subject}</p>
                  <p className="text-sm text-gray-500 mt-1">{t.message.substring(0, 100)}...</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[t.status]}`}>{t.status}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{new Date(t.createdAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
