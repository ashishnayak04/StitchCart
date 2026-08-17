import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/store/shop/notification-slice";
import { useToast } from "@/components/ui/use-toast";
import { Bell, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function ShoppingNotifications() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items, unreadCount, isLoading } = useSelector((s) => s.notifications);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) dispatch(getNotifications(user.id));
  }, [dispatch, user]);

  const handleMarkAll = () => {
    if (user?.id) {
      dispatch(markAllNotificationsRead(user.id));
      toast({ title: "All notifications marked as read" });
    }
  };

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const typeColor = { order: "bg-blue-100 text-blue-700", promotion: "bg-green-100 text-green-700", system: "bg-gray-100 text-gray-700", support: "bg-yellow-100 text-yellow-700" };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAll} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div key={n._id} onClick={() => !n.isRead && handleMarkRead(n._id)} className={`p-4 rounded-lg border cursor-pointer transition ${n.isRead ? "bg-white" : "bg-gray-50 border-gray-300"}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor[n.type] || "bg-gray-100"}`}>{n.type}</span>
                    {!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                  <p className="font-medium text-sm">{n.title}</p>
                  <p className="text-gray-600 text-sm mt-1">{n.message}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
              {n.link && <Link to={n.link} className="text-xs text-blue-600 hover:underline mt-2 inline-block">View details</Link>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
