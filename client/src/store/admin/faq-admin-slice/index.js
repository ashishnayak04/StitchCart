import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/admin/faq";

export const getAdminFAQs = createAsyncThunk("faqAdmin/getAll", async () => {
  const res = await axios.get(`${API}/get`, { withCredentials: true });
  return res.data;
});

export const addFAQ = createAsyncThunk("faqAdmin/add", async (data) => {
  const res = await axios.post(`${API}/add`, data, { withCredentials: true });
  return res.data;
});

export const updateFAQ = createAsyncThunk("faqAdmin/update", async ({ id, ...data }) => {
  const res = await axios.put(`${API}/edit/${id}`, data, { withCredentials: true });
  return res.data;
});

export const deleteFAQ = createAsyncThunk("faqAdmin/delete", async (id) => {
  const res = await axios.delete(`${API}/delete/${id}`, { withCredentials: true });
  return { ...res.data, id };
});

const faqAdminSlice = createSlice({
  name: "faqAdmin",
  initialState: { items: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminFAQs.pending, (s) => { s.isLoading = true; })
      .addCase(getAdminFAQs.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload.success ? a.payload.data : []; })
      .addCase(addFAQ.fulfilled, (s, a) => { if (a.payload.success) s.items.push(a.payload.data); })
      .addCase(deleteFAQ.fulfilled, (s, a) => { s.items = s.items.filter((f) => f._id !== a.id); });
  },
});

export default faqAdminSlice.reducer;
