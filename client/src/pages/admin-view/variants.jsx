import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "@/store/admin/products-slice";
import axios from "axios";
import { Layers, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminVariants() {
  const dispatch = useDispatch();
  const { productList } = useSelector((s) => s.adminProducts);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [variants, setVariants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ size: "", color: "", sku: "", stock: 0, price: "", salePrice: "" });
  const { toast } = useToast();

  useEffect(() => { dispatch(fetchAllProducts({ page: 1, limit: 200 })); }, [dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      axios.get(`http://localhost:9000/api/shop/variants/get/${selectedProduct}`, { withCredentials: true })
        .then((r) => setVariants(r.data.data || []));
    }
  }, [selectedProduct]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9000/api/admin/variants/add", { ...form, productId: selectedProduct }, { withCredentials: true });
      setForm({ size: "", color: "", sku: "", stock: 0, price: "", salePrice: "" });
      setShowForm(false);
      const r = await axios.get(`http://localhost:9000/api/shop/variants/get/${selectedProduct}`, { withCredentials: true });
      setVariants(r.data.data || []);
      toast({ title: "Variant added" });
    } catch (err) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete variant?")) return;
    await axios.delete(`http://localhost:9000/api/admin/variants/delete/${id}`, { withCredentials: true });
    setVariants(variants.filter((v) => v._id !== id));
    toast({ title: "Variant deleted" });
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-5 h-5" />
        <h1 className="text-2xl font-bold">Product Variants</h1>
      </div>
      <div className="mb-4">
        <label className="text-sm font-medium block mb-1">Select Product</label>
        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="border rounded-md px-3 py-2 text-sm w-full max-w-md">
          <option value="">-- Select a product --</option>
          {(productList || []).map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
      </div>
      {selectedProduct && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{variants.length} variants</p>
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-md text-sm">
              <Plus className="w-4 h-4" /> Add Variant
            </button>
          </div>
          {showForm && (
            <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded-lg border mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Size (e.g. M)" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
                <input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
                <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
                <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="border rounded-md px-3 py-2 text-sm" />
                <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
                <input type="number" placeholder="Sale Price" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-black text-white px-4 py-2 rounded-md text-sm">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-md text-sm">Cancel</button>
              </div>
            </form>
          )}
          {variants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left"><th className="py-3 px-2">Size</th><th className="py-3 px-2">Color</th><th className="py-3 px-2">SKU</th><th className="py-3 px-2">Stock</th><th className="py-3 px-2">Price</th><th className="py-3 px-2">Action</th></tr></thead>
                <tbody>
                  {variants.map((v) => (
                    <tr key={v._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">{v.size || "-"}</td>
                      <td className="py-3 px-2">{v.color || "-"}</td>
                      <td className="py-3 px-2 font-mono text-xs">{v.sku || "-"}</td>
                      <td className="py-3 px-2">{v.stock}</td>
                      <td className="py-3 px-2">₹{v.price || "-"}</td>
                      <td className="py-3 px-2"><button onClick={() => handleDelete(v._id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-gray-400 text-sm text-center py-8">No variants for this product.</p>}
        </>
      )}
    </div>
  );
}
