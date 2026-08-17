import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleBlockUser,
} from "@/store/admin/user-management-slice";
import { Users, Plus, Trash2, Shield, ShieldOff, Edit, X, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const emptyForm = { userName: "", email: "", password: "", phone: "", role: "user" };

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users, total, totalPages, isLoading } = useSelector((s) => s.adminUserManagement);
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    dispatch(getAllUsers({ page, limit: 20, search, role: roleFilter }));
  }, [dispatch, page, roleFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(getAllUsers({ page: 1, limit: 20, search, role: roleFilter }));
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ userName: user.userName, email: user.email, password: "", phone: user.phone || "", role: user.role });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      const payload = { id: editingUser._id, userName: form.userName, email: form.email, phone: form.phone, role: form.role };
      const result = await dispatch(updateUser(payload));
      if (updateUser.fulfilled.match(result)) {
        toast({ title: "User updated" });
      } else {
        toast({ title: "Failed to update user", variant: "destructive" });
      }
    } else {
      const result = await dispatch(createUser(form));
      if (createUser.fulfilled.match(result)) {
        toast({ title: "User created" });
      } else {
        toast({ title: "Failed to create user", variant: "destructive" });
      }
    }
    setShowForm(false);
    setEditingUser(null);
    setForm(emptyForm);
    dispatch(getAllUsers({ page, limit: 20, search, role: roleFilter }));
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const result = await dispatch(deleteUser(id));
    if (deleteUser.fulfilled.match(result)) {
      toast({ title: "User deleted" });
    } else {
      toast({ title: "Failed to delete user", variant: "destructive" });
    }
  };

  const handleToggleBlock = async (user) => {
    if (!confirm(`Are you sure you want to ${user.role === "blocked" ? "unblock" : "block"} this user?`)) return;
    const result = await dispatch(toggleBlockUser(user._id));
    if (toggleBlockUser.fulfilled.match(result)) {
      toast({ title: user.role === "blocked" ? "User unblocked" : "User blocked" });
    } else {
      toast({ title: "Action failed", variant: "destructive" });
    }
  };

  const roleBadge = (role) => {
    const styles = {
      admin: "bg-blue-100 text-blue-700",
      user: "bg-green-100 text-green-700",
      blocked: "bg-red-100 text-red-700",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${styles[role] || "bg-gray-100 text-gray-700"}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h1 className="text-2xl font-bold">User Management</h1>
          <span className="text-sm text-gray-400">({total})</span>
        </div>
        <button onClick={openCreate} className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full border rounded-md pl-9 pr-3 py-2 text-sm"
            />
          </div>
          <button type="submit" className="bg-black text-white px-4 py-2 rounded-md text-sm">Search</button>
        </form>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-left">
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Created</th>
                <th className="py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">{u.userName}</td>
                  <td className="py-3 px-3">{u.email}</td>
                  <td className="py-3 px-3">{u.phone || "-"}</td>
                  <td className="py-3 px-3">{roleBadge(u.role)}</td>
                  <td className="py-3 px-3 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(u)} className="text-blue-500 hover:text-blue-700 p-1" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleBlock(u)}
                        className={`${u.role === "blocked" ? "text-green-500" : "text-orange-500"} hover:opacity-70 p-1`}
                        title={u.role === "blocked" ? "Unblock" : "Block"}
                      >
                        {u.role === "blocked" ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700 p-1" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">Page {page} of {totalPages || 1}</p>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="border px-3 py-1 rounded text-sm disabled:opacity-50">Prev</button>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="border px-3 py-1 rounded text-sm disabled:opacity-50">Next</button>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowForm(false); setEditingUser(null); }}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editingUser ? "Edit User" : "Add User"}</h2>
              <button onClick={() => { setShowForm(false); setEditingUser(null); }}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    required
                    value={form.userName}
                    onChange={(e) => setForm({ ...form, userName: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="user@example.com"
                  />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      required
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      placeholder="Min 6 characters"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => { setShowForm(false); setEditingUser(null); }} className="border px-4 py-2 rounded-md text-sm">Cancel</button>
                <button type="submit" className="bg-black text-white px-4 py-2 rounded-md text-sm">{editingUser ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
