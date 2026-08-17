import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAdminFAQs, addFAQ, deleteFAQ, updateFAQ } from "@/store/admin/faq-admin-slice";
import { Edit, HelpCircle, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminFAQ() {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((s) => s.faqAdmin);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ question: "", answer: "", category: "general", sortOrder: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({ question: "", answer: "", category: "general", sortOrder: 0 });
  const { toast } = useToast();

  useEffect(() => { dispatch(getAdminFAQs()); }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateFAQ({ id: editingId, ...editingForm }));
      setEditingId(null);
      setEditingForm({ question: "", answer: "", category: "general", sortOrder: 0 });
      setShowForm(false);
      toast({ title: "FAQ updated" });
    } else {
      dispatch(addFAQ(form));
      setForm({ question: "", answer: "", category: "general", sortOrder: 0 });
      setShowForm(false);
      toast({ title: "FAQ added" });
    }
  };

  const handleEdit = (faq) => {
    setEditingId(faq._id);
    setEditingForm({ question: faq.question, answer: faq.answer, category: faq.category, sortOrder: faq.sortOrder });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingForm({ question: "", answer: "", category: "general", sortOrder: 0 });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this FAQ?")) { dispatch(deleteFAQ(id)); toast({ title: "FAQ deleted" }); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          <h1 className="text-2xl font-bold">FAQ Management</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-md text-sm">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border mb-6 space-y-3">
          <input placeholder="Question" value={editingId ? editingForm.question : form.question} onChange={(e) => editingId ? setEditingForm({ ...editingForm, question: e.target.value }) : setForm({ ...form, question: e.target.value })} required className="w-full border rounded-md px-3 py-2 text-sm" />
          <textarea placeholder="Answer" value={editingId ? editingForm.answer : form.answer} onChange={(e) => editingId ? setEditingForm({ ...editingForm, answer: e.target.value }) : setForm({ ...form, answer: e.target.value })} required rows={3} className="w-full border rounded-md px-3 py-2 text-sm" />
          <div className="flex gap-3">
            <input placeholder="Category" value={editingId ? editingForm.category : form.category} onChange={(e) => editingId ? setEditingForm({ ...editingForm, category: e.target.value }) : setForm({ ...form, category: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
            <input type="number" placeholder="Sort order" value={editingId ? editingForm.sortOrder : form.sortOrder} onChange={(e) => editingId ? setEditingForm({ ...editingForm, sortOrder: Number(e.target.value) }) : setForm({ ...form, sortOrder: Number(e.target.value) })} className="border rounded-md px-3 py-2 text-sm w-24" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-md text-sm">{editingId ? "Update" : "Save"}</button>
            <button type="button" onClick={editingId ? handleCancelEdit : () => setShowForm(false)} className="border px-4 py-2 rounded-md text-sm">Cancel</button>
          </div>
        </form>
      )}
      {isLoading ? <p className="text-gray-500">Loading...</p> : (
        <div className="space-y-2">
          {items.map((faq) => (
            <div key={faq._id} className="border rounded-lg p-4 flex items-start justify-between">
              <div className="flex-1 mr-4">
                <p className="font-medium text-sm">{faq.question}</p>
                <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                <p className="text-xs text-gray-400 mt-1">Category: {faq.category}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleEdit(faq)} className="text-blue-500 hover:text-blue-700"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(faq._id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
