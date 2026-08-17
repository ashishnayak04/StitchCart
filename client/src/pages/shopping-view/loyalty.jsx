import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLoyaltyPoints } from "@/store/shop/loyalty-slice";
import { Gift, TrendingUp, TrendingDown } from "lucide-react";

export default function ShoppingLoyalty() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { points, history, isLoading } = useSelector((s) => s.loyalty);

  useEffect(() => { if (user?.id) dispatch(getLoyaltyPoints(user.id)); }, [dispatch, user]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Gift className="w-5 h-5" />
        <h1 className="text-2xl font-bold">Loyalty Points</h1>
      </div>
      <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-xl p-6 mb-6">
        <p className="text-sm opacity-75">Your Balance</p>
        <p className="text-4xl font-bold mt-1">{points.toLocaleString()}</p>
        <p className="text-sm opacity-75 mt-1">points</p>
      </div>

      <h2 className="font-semibold mb-3">History</h2>
      {isLoading ? <p className="text-gray-500">Loading...</p> : history.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No points history yet.</p>
      ) : (
        <div className="space-y-2">
          {[...history].reverse().map((h, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {h.type === "earned" ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                <div>
                  <p className="text-sm font-medium">{h.description}</p>
                  <p className="text-xs text-gray-400">{new Date(h.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`font-mono text-sm ${h.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                {h.type === "earned" ? "+" : "-"}{h.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
