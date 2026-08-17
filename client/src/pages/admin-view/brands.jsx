import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllBrands, addBrand, deleteBrand } from "@/store/admin/brand-slice";
import { Crown, Plus, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

export default function AdminBrands() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.adminBrand);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", sortOrder: 0 });
  const [editing, setEditing] = useState(null);
  const { toast } = useToast();

  useEffect(() => { dispatch(getAllBrands()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`http://localhost:9000/api/admin/brands/edit/${editing._id}`, form, { withCredentials: true });
      dispatch(getAllBrands());
      toast({ title: "Brand updated" });
    } else {
      dispatch(addBrand(form));
      toast({ title: "Brand added" });
    }
    setForm({ name: "", slug: "", description: "", sortOrder: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (b) => { setEditing(b); setForm({ name: b.name, slug: b.slug, description: b.description || "", sortOrder: b.sortOrder || 0 }); setShowForm(true); };

  const handleDelete = (id) => { if (confirm("Delete?")) { dispatch(deleteBrand(id)); toast({ title: "Deleted" }); } };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2"><Crown className="w-5 h-5" /><h1 className="text-2xl font-bold">Brands</h1><span className="text-sm text-gray-400">({items.length})</span></div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: "", slug: "", description: "", sortOrder: 0 }); }} className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-md text-sm"><Plus className="w-4 h-4" /> Add</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="border rounded-md px-3 py-2 text-sm" />
            <input placeholder="Slug (e.g. raymond)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="border rounded-md px-3 py-2 text-sm" />
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
        {items.map((b) => (
          <div key={b._id} className="border rounded-lg p-4 flex items-start justify-between">
            <div>
              <p className="font-medium">{b.name}</p>
              <p className="text-xs text-gray-400">/{b.slug}</p>
              {b.description && <p className="text-sm text-gray-600 mt-1">{b.description}</p>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleEdit(b)} className="text-blue-500 hover:text-blue-700 p-1"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(b._id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
