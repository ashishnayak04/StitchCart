import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/admin/analytics";

export const getDashboardStats = createAsyncThunk("analytics/stats", async () => {
  const res = await axios.get(`${API}/stats`, { withCredentials: true });
  return res.data;
});

export const getRevenueChart = createAsyncThunk("analytics/revenue", async (period = "30") => {
  const res = await axios.get(`${API}/revenue?period=${period}`, { withCredentials: true });
  return res.data;
});

export const getTopProducts = createAsyncThunk("analytics/topProducts", async () => {
  const res = await axios.get(`${API}/top-products`, { withCredentials: true });
  return res.data;
});

export const getAllCustomers = createAsyncThunk("analytics/customers", async ({ page = 1, limit = 20 } = {}) => {
  const res = await axios.get(`${API}/customers?page=${page}&limit=${limit}`, { withCredentials: true });
  return res.data;
});

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: { stats: null, revenue: [], topProducts: [], customers: [], total: 0, isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (s) => { s.isLoading = true; })
      .addCase(getDashboardStats.fulfilled, (s, a) => { s.isLoading = false; s.stats = a.payload.success ? a.payload.data : null; })
      .addCase(getRevenueChart.fulfilled, (s, a) => { s.revenue = a.payload.success ? a.payload.data : []; })
      .addCase(getTopProducts.fulfilled, (s, a) => { s.topProducts = a.payload.success ? a.payload.data : []; })
      .addCase(getAllCustomers.fulfilled, (s, a) => { s.customers = a.payload.success ? a.payload.data : []; s.total = a.payload.total || 0; });
  },
});

export default analyticsSlice.reducer;
