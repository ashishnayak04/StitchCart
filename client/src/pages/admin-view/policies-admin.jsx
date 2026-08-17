import { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminPolicies() {
  const [policies, setPolicies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ slug: "", title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({ slug: "", title: "", content: "" });
  const { toast } = useToast();

  const fetchPolicies = () => {
    axios.get("http://localhost:9000/api/admin/policies/get", { withCredentials: true })
      .then((r) => setPolicies(r.data.data || []));
  };

  useEffect(() => { fetchPolicies(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:9000/api/admin/policies/edit/${editingId}`, editingForm, { withCredentials: true });
        setEditingId(null);
        setEditingForm({ slug: "", title: "", content: "" });
        setShowForm(false);
        fetchPolicies();
        toast({ title: "Policy updated" });
      } else {
        await axios.post("http://localhost:9000/api/admin/policies/add", form, { withCredentials: true });
        setForm({ slug: "", title: "", content: "" });
        setShowForm(false);
        fetchPolicies();
        toast({ title: "Policy added" });
      }
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleEdit = (policy) => {
    setEditingId(policy._id);
    setEditingForm({ slug: policy.slug, title: policy.title, content: policy.content });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingForm({ slug: "", title: "", content: "" });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this policy?")) return;
    await axios.delete(`http://localhost:9000/api/admin/policies/delete/${id}`, { withCredentials: true });
    fetchPolicies();
    toast({ title: "Policy deleted" });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Policy Pages</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-md text-sm">
          <Plus className="w-4 h-4" /> Add Policy
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border mb-6 space-y-3">
          <input placeholder="Slug (e.g. privacy-policy)" value={editingId ? editingForm.slug : form.slug} onChange={(e) => editingId ? setEditingForm({ ...editingForm, slug: e.target.value }) : setForm({ ...form, slug: e.target.value })} required className="w-full border rounded-md px-3 py-2 text-sm" />
          <input placeholder="Title" value={editingId ? editingForm.title : form.title} onChange={(e) => editingId ? setEditingForm({ ...editingForm, title: e.target.value }) : setForm({ ...form, title: e.target.value })} required className="w-full border rounded-md px-3 py-2 text-sm" />
          <textarea placeholder="Content" value={editingId ? editingForm.content : form.content} onChange={(e) => editingId ? setEditingForm({ ...editingForm, content: e.target.value }) : setForm({ ...form, content: e.target.value })} required rows={6} className="w-full border rounded-md px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-md text-sm">{editingId ? "Update" : "Save"}</button>
            <button type="button" onClick={editingId ? handleCancelEdit : () => setShowForm(false)} className="border px-4 py-2 rounded-md text-sm">Cancel</button>
          </div>
        </form>
      )}
      <div className="space-y-2">
        {policies.map((p) => (
          <div key={p._id} className="border rounded-lg p-4 flex items-start justify-between">
            <div className="flex-1 mr-4">
              <p className="font-medium text-sm">{p.title}</p>
              <p className="text-xs text-gray-400">/{p.slug}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.content.substring(0, 200)}...</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
