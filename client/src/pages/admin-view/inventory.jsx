import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getInventory, updateStock } from "@/store/admin/inventory-slice";
import { Search, Package, AlertTriangle, Edit2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminInventory() {
  const dispatch = useDispatch();
  const { items, total, totalPages, isLoading } = useSelector((s) => s.adminInventory);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [editingStock, setEditingStock] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    dispatch(getInventory({ page, limit: 20, search, lowStock: lowStockOnly ? "true" : "" }));
  }, [dispatch, page, lowStockOnly]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); dispatch(getInventory({ page: 1, limit: 20, search, lowStock: lowStockOnly ? "true" : "" })); };

  const handleSaveStock = (id) => {
    const newStock = editingStock[id];
    if (newStock === undefined) return;
    dispatch(updateStock({ id, totalStock: Number(newStock) }));
    setEditingStock({ ...editingStock, [id]: undefined });
    toast({ title: "Stock updated" });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4"><Package className="w-5 h-5" /><h1 className="text-2xl font-bold">Inventory</h1><span className="text-sm text-gray-400">({total})</span></div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full border rounded-md pl-9 pr-3 py-2 text-sm" /></div>
          <button type="submit" className="bg-black text-white px-4 py-2 rounded-md text-sm">Search</button>
        </form>
        <button onClick={() => { setLowStockOnly(!lowStockOnly); setPage(1); }} className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm border ${lowStockOnly ? "bg-orange-50 border-orange-300 text-orange-700" : ""}`}>
          <AlertTriangle className="w-4 h-4" /> Low Stock {lowStockOnly ? "ON" : "OFF"}
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b text-left">
            <th className="py-3 px-3">Product</th><th className="py-3 px-3">Category</th><th className="py-3 px-3">Stock</th><th className="py-3 px-3">Variants</th><th className="py-3 px-3">Action</th>
          </tr></thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <img src={p.image} alt="" className="w-8 h-8 rounded object-cover" />
                    <div><p className="font-medium truncate max-w-[200px]">{p.title}</p><p className="text-xs text-gray-400">{p.brand}</p></div>
                  </div>
                </td>
                <td className="py-3 px-3 text-xs">{p.category}</td>
                <td className="py-3 px-3">
                  {editingStock[p._id] !== undefined ? (
                    <input type="number" value={editingStock[p._id]} onChange={(e) => setEditingStock({ ...editingStock, [p._id]: e.target.value })} className="w-20 border rounded px-2 py-1 text-sm" />
                  ) : (
                    <span className={`font-mono ${p.totalStock <= 5 ? "text-red-600 font-bold" : p.totalStock <= 10 ? "text-yellow-600" : ""}`}>{p.totalStock}</span>
                  )}
                </td>
                <td className="py-3 px-3 text-xs">{p.variantCount} ({p.variantStock} in variants)</td>
                <td className="py-3 px-3">
                  {editingStock[p._id] !== undefined ? (
                    <button onClick={() => handleSaveStock(p._id)} className="text-green-600 hover:text-green-700"><Save className="w-4 h-4" /></button>
                  ) : (
                    <button onClick={() => setEditingStock({ ...editingStock, [p._id]: p.totalStock })} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">Page {page} of {totalPages || 1}</p>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="border px-3 py-1 rounded text-sm disabled:opacity-50">Prev</button>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="border px-3 py-1 rounded text-sm disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
