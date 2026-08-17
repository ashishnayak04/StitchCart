import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/shop/wishlist";

export const addToWishlist = createAsyncThunk("wishlist/add", async ({ userId, productId }) => {
  const res = await axios.post(`${API}/add`, { userId, productId }, { withCredentials: true });
  return res.data;
});

export const removeFromWishlist = createAsyncThunk("wishlist/remove", async ({ userId, productId }) => {
  const res = await axios.delete(`${API}/${userId}/${productId}`, { withCredentials: true });
  return res.data;
});

export const getWishlist = createAsyncThunk("wishlist/get", async (userId) => {
  const res = await axios.get(`${API}/get/${userId}`, { withCredentials: true });
  return res.data;
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (s) => { s.isLoading = true; })
      .addCase(getWishlist.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload.success ? a.payload.data : []; })
      .addCase(getWishlist.rejected, (s) => { s.isLoading = false; s.items = []; })
      .addCase(addToWishlist.fulfilled, (s, a) => { if (a.payload.success) s.items.push(a.payload.data); })
      .addCase(removeFromWishlist.fulfilled, (s, a) => { s.items = s.items.filter((i) => i.productId !== a.meta.arg.productId); });
  },
});

export default wishlistSlice.reducer;
