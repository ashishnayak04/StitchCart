import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, RotateCcw } from "lucide-react";
import axios from "axios";

export default function ShoppingReturns() {
  const { orderId } = useParams();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:9000/api/shop/returns/request/${orderId}`, { returnReason: reason }, { withCredentials: true });
      if (res.data.success) {
        setDone(true);
        toast({ title: "Return requested" });
      }
    } catch (err) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/shop/account" className="flex items-center gap-1 text-sm text-gray-500 hover:underline mb-4"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <div className="flex items-center gap-2 mb-6">
        <RotateCcw className="w-5 h-5" />
        <h1 className="text-2xl font-bold">Request Return</h1>
      </div>
      {done ? (
        <div className="text-center py-12">
          <p className="text-green-600 text-lg font-semibold mb-2">Return request submitted!</p>
          <p className="text-gray-500 text-sm mb-4">We'll review your request within 2-3 business days.</p>
          <Link to="/shop/account" className="text-sm underline">View orders</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-500">Order #{orderId}</p>
          <p className="text-sm text-gray-500">Returns must be requested within 30 days of delivery.</p>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for return..." required rows={4} className="w-full border rounded-md px-3 py-2 text-sm" />
          <button type="submit" disabled={loading} className="bg-black text-white px-6 py-2 rounded-md text-sm disabled:opacity-50">
            {loading ? "Submitting..." : "Submit Return Request"}
          </button>
        </form>
      )}
    </div>
  );
}
