import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAuditLogs } from "@/store/admin/audit-slice";
import { ClipboardList } from "lucide-react";

export default function AdminAudit() {
  const dispatch = useDispatch();
  const { logs, total, isLoading } = useSelector((s) => s.audit);

  useEffect(() => { dispatch(getAuditLogs({ page: 1, limit: 100 })); }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="w-5 h-5" />
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <span className="text-sm text-gray-400">({total})</span>
      </div>
      {isLoading ? <p className="text-gray-500">Loading...</p> : logs.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No audit logs yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th className="py-3 px-2">Time</th><th className="py-3 px-2">User</th><th className="py-3 px-2">Action</th><th className="py-3 px-2">Entity</th><th className="py-3 px-2">Details</th></tr></thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 whitespace-nowrap">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-2">{l.userId?.userName || l.userId?.email || "-"}</td>
                  <td className="py-3 px-2 font-medium">{l.action}</td>
                  <td className="py-3 px-2">{l.entity} {l.entityId && <span className="text-gray-400">({l.entityId.substring(0, 8)}...)</span>}</td>
                  <td className="py-3 px-2 text-gray-500 max-w-xs truncate">{l.details ? JSON.stringify(l.details) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
