import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/admin/categories";

export const getAllCategories = createAsyncThunk("category/getAll", async () => {
  const res = await axios.get(`${API}/get`, { withCredentials: true });
  return res.data;
});

export const addCategory = createAsyncThunk("category/add", async (data) => {
  const res = await axios.post(`${API}/add`, data, { withCredentials: true });
  return res.data;
});

export const updateCategory = createAsyncThunk("category/update", async ({ id, ...data }) => {
  const res = await axios.put(`${API}/edit/${id}`, data, { withCredentials: true });
  return res.data;
});

export const deleteCategory = createAsyncThunk("category/delete", async (id) => {
  const res = await axios.delete(`${API}/delete/${id}`, { withCredentials: true });
  return { ...res.data, id };
});

const categorySlice = createSlice({
  name: "category",
  initialState: { items: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (s) => { s.isLoading = true; })
      .addCase(getAllCategories.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload.success ? a.payload.data : []; })
      .addCase(addCategory.fulfilled, (s, a) => { if (a.payload.success) s.items.push(a.payload.data); })
      .addCase(deleteCategory.fulfilled, (s, a) => { s.items = s.items.filter((c) => c._id !== a.id); });
  },
});

export default categorySlice.reducer;
