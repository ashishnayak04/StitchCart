import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/admin/brands";

export const getAllBrands = createAsyncThunk("brand/getAll", async () => {
  const res = await axios.get(`${API}/get`, { withCredentials: true });
  return res.data;
});

export const addBrand = createAsyncThunk("brand/add", async (data) => {
  const res = await axios.post(`${API}/add`, data, { withCredentials: true });
  return res.data;
});

export const updateBrand = createAsyncThunk("brand/update", async ({ id, ...data }) => {
  const res = await axios.put(`${API}/edit/${id}`, data, { withCredentials: true });
  return res.data;
});

export const deleteBrand = createAsyncThunk("brand/delete", async (id) => {
  const res = await axios.delete(`${API}/delete/${id}`, { withCredentials: true });
  return { ...res.data, id };
});

const brandSlice = createSlice({
  name: "brand",
  initialState: { items: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBrands.pending, (s) => { s.isLoading = true; })
      .addCase(getAllBrands.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload.success ? a.payload.data : []; })
      .addCase(addBrand.fulfilled, (s, a) => { if (a.payload.success) s.items.push(a.payload.data); })
      .addCase(deleteBrand.fulfilled, (s, a) => { s.items = s.items.filter((b) => b._id !== a.id); });
  },
});

export default brandSlice.reducer;
