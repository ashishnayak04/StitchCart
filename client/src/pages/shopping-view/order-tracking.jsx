import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Package, Truck, CheckCircle, ArrowLeft } from "lucide-react";

export default function ShoppingOrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:9000/api/shop/tracking/${orderId}`, { withCredentials: true })
      .then((r) => { setOrder(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orderId]);

  const steps = [
    { key: "pending", label: "Order Placed", icon: Package },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const statusOrder = ["pending", "confirmed", "shipped", "delivered"];
  const currentIdx = statusOrder.indexOf(order?.orderStatus || "pending");

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8"><p className="text-gray-500">Loading...</p></div>;
  if (!order) return <div className="max-w-2xl mx-auto px-4 py-8"><p className="text-red-500">Order not found.</p></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/shop/account" className="flex items-center gap-1 text-sm text-gray-500 hover:underline mb-4"><ArrowLeft className="w-4 h-4" /> Back to orders</Link>
      <h1 className="text-2xl font-bold mb-2">Order Tracking</h1>
      <p className="text-sm text-gray-500 mb-6">Order #{order._id}</p>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i <= currentIdx;
            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isActive ? "bg-black text-white" : "bg-gray-200 text-gray-400"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs text-center ${isActive ? "font-medium" : "text-gray-400"}`}>{step.label}</span>
              </div>
            );
          })}
        </div>
        {order.trackingNumber && (
          <div className="text-sm text-gray-600 border-t pt-4">
            <p>Tracking: <span className="font-mono">{order.trackingNumber}</span></p>
            {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Track shipment</a>}
          </div>
        )}
      </div>

      <h2 className="font-semibold mb-3">Status History</h2>
      <div className="space-y-2">
        {(order.statusHistory || []).map((h, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <span className="text-gray-400 whitespace-nowrap">{new Date(h.date).toLocaleString()}</span>
            <div>
              <span className="font-medium capitalize">{h.status}</span>
              {h.note && <p className="text-gray-500">{h.note}</p>}
            </div>
          </div>
        ))}
        {(!order.statusHistory || order.statusHistory.length === 0) && <p className="text-gray-400 text-sm">No history available.</p>}
      </div>
    </div>
  );
}
