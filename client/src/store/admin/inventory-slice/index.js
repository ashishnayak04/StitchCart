import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/admin/inventory";

export const getInventory = createAsyncThunk("inventory/get", async ({ page = 1, limit = 20, search = "", lowStock = "" } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set("search", search);
  if (lowStock) params.set("lowStock", lowStock);
  const res = await axios.get(`${API}/get?${params}`, { withCredentials: true });
  return res.data;
});

export const updateStock = createAsyncThunk("inventory/updateStock", async ({ id, totalStock }) => {
  const res = await axios.put(`${API}/update/${id}`, { totalStock }, { withCredentials: true });
  return res.data;
});

const inventorySlice = createSlice({
  name: "inventory",
  initialState: { items: [], total: 0, totalPages: 1, isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInventory.pending, (s) => { s.isLoading = true; })
      .addCase(getInventory.fulfilled, (s, a) => {
        s.isLoading = false;
        if (a.payload.success) { s.items = a.payload.data; s.total = a.payload.total; s.totalPages = a.payload.totalPages; }
      })
      .addCase(updateStock.fulfilled, (s, a) => {
        if (a.payload.success) {
          const idx = s.items.findIndex((i) => i._id === a.payload.data._id);
          if (idx >= 0) s.items[idx] = { ...s.items[idx], ...a.payload.data };
        }
      });
  },
});

export default inventorySlice.reducer;
