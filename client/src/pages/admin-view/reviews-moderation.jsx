import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllReviews, deleteReview, updateReviewStatus } from "@/store/admin/review-moderation-slice";
import { Star, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const STATUS_TABS = ["all", "pending", "approved", "rejected"];

const statusBadge = (status) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return map[status] || map.pending;
};

export default function AdminReviews() {
  const dispatch = useDispatch();
  const { reviews, total, isLoading } = useSelector((s) => s.reviewModeration);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => { dispatch(getAllReviews({ page: 1, limit: 50 })); }, [dispatch]);

  const filtered = activeTab === "all" ? reviews : reviews.filter((r) => r.status === activeTab);

  const handleDelete = (id) => {
    if (confirm("Delete this review?")) {
      dispatch(deleteReview(id));
      toast({ title: "Review deleted" });
    }
  };

  const handleApprove = (id) => {
    dispatch(updateReviewStatus({ id, status: "approved" }));
    toast({ title: "Review approved" });
  };

  const handleReject = (id) => {
    dispatch(updateReviewStatus({ id, status: "rejected" }));
    toast({ title: "Review rejected" });
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5" />
        <h1 className="text-2xl font-bold">Review Moderation</h1>
        <span className="text-sm text-gray-400">({total})</span>
      </div>

      <div className="flex gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-sm rounded-md capitalize ${activeTab === tab ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? <p className="text-gray-500">Loading...</p> : filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No reviews.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r._id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < r.reviewValue ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusBadge(r.status || "pending")}`}>{r.status || "pending"}</span>
                  </div>
                  <p className="text-sm font-medium">{r.userName}</p>
                  <p className="text-sm text-gray-600 mt-1">{r.reviewMessage}</p>
                  <p className="text-xs text-gray-400 mt-1">Product: {r.productId} · {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleApprove(r._id)} className="text-green-500 hover:text-green-700" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                  <button onClick={() => handleReject(r._id)} className="text-orange-500 hover:text-orange-700" title="Reject"><XCircle className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
