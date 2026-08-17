import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/shop/loyalty";

export const getLoyaltyPoints = createAsyncThunk("loyalty/get", async (userId) => {
  const res = await axios.get(`${API}/get/${userId}`, { withCredentials: true });
  return res.data;
});

export const redeemLoyaltyPoints = createAsyncThunk("loyalty/redeem", async ({ userId, points, orderId }) => {
  const res = await axios.post(`${API}/redeem`, { userId, points, orderId }, { withCredentials: true });
  return res.data;
});

const loyaltySlice = createSlice({
  name: "loyalty",
  initialState: { points: 0, history: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLoyaltyPoints.pending, (s) => { s.isLoading = true; })
      .addCase(getLoyaltyPoints.fulfilled, (s, a) => {
        s.isLoading = false;
        if (a.payload.success) { s.points = a.payload.data.points; s.history = a.payload.data.history; }
      })
      .addCase(redeemLoyaltyPoints.fulfilled, (s, a) => {
        if (a.payload.success) { s.points = a.payload.data.points; s.history = a.payload.data.history; }
      });
  },
});

export default loyaltySlice.reducer;
