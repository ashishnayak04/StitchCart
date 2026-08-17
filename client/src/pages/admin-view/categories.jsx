import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllCategories, addCategory, deleteCategory } from "@/store/admin/category-slice";
import { FolderTree, Plus, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

export default function AdminCategories() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.adminCategory);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", sortOrder: 0 });
  const [editing, setEditing] = useState(null);
  const { toast } = useToast();

  useEffect(() => { dispatch(getAllCategories()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`http://localhost:9000/api/admin/categories/edit/${editing._id}`, form, { withCredentials: true });
      dispatch(getAllCategories());
      toast({ title: "Category updated" });
    } else {
      dispatch(addCategory(form));
      toast({ title: "Category added" });
    }
    setForm({ name: "", slug: "", description: "", sortOrder: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", sortOrder: cat.sortOrder || 0 }); setShowForm(true); };

  const handleDelete = (id) => { if (confirm("Delete?")) { dispatch(deleteCategory(id)); toast({ title: "Deleted" }); } };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2"><FolderTree className="w-5 h-5" /><h1 className="text-2xl font-bold">Categories</h1><span className="text-sm text-gray-400">({items.length})</span></div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: "", slug: "", description: "", sortOrder: 0 }); }} className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-md text-sm"><Plus className="w-4 h-4" /> Add</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="border rounded-md px-3 py-2 text-sm" />
            <input placeholder="Slug (e.g. blazers)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="border rounded-md px-3 py-2 text-sm" />
          </div>
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" />
          <input type="number" placeholder="Sort order" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-32 border rounded-md px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-md text-sm">{editing ? "Update" : "Save"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="border px-4 py-2 rounded-md text-sm">Cancel</button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((cat) => (
          <div key={cat._id} className="border rounded-lg p-4 flex items-start justify-between">
            <div>
              <p className="font-medium">{cat.name}</p>
              <p className="text-xs text-gray-400">/{cat.slug}</p>
              {cat.description && <p className="text-sm text-gray-600 mt-1">{cat.description}</p>}
              <p className="text-xs text-gray-400 mt-1">Order: {cat.sortOrder}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleEdit(cat)} className="text-blue-500 hover:text-blue-700 p-1"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
