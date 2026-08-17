import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/shop/recently-viewed";

export const addRecentlyViewed = createAsyncThunk("recentlyViewed/add", async ({ userId, productId }) => {
  const res = await axios.post(`${API}/add`, { userId, productId }, { withCredentials: true });
  return res.data;
});

export const getRecentlyViewed = createAsyncThunk("recentlyViewed/get", async (userId) => {
  const res = await axios.get(`${API}/get/${userId}`, { withCredentials: true });
  return res.data;
});

const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState: { items: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRecentlyViewed.pending, (s) => { s.isLoading = true; })
      .addCase(getRecentlyViewed.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload.success ? a.payload.data : []; })
      .addCase(getRecentlyViewed.rejected, (s) => { s.isLoading = false; });
  },
});

export default recentlyViewedSlice.reducer;
