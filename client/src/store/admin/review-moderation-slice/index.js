import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/admin/reviews";

export const getAllReviews = createAsyncThunk("reviewMod/getAll", async ({ page = 1, limit = 20 } = {}) => {
  const res = await axios.get(`${API}/get?page=${page}&limit=${limit}`, { withCredentials: true });
  return res.data;
});

export const deleteReview = createAsyncThunk("reviewMod/delete", async (id) => {
  const res = await axios.delete(`${API}/delete/${id}`, { withCredentials: true });
  return { ...res.data, id };
});

export const updateReviewStatus = createAsyncThunk("reviewMod/updateStatus", async ({ id, status }) => {
  const res = await axios.put(`${API}/status/${id}`, { status }, { withCredentials: true });
  return { ...res.data, id, status };
});

const reviewModerationSlice = createSlice({
  name: "reviewModeration",
  initialState: { reviews: [], total: 0, isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllReviews.pending, (s) => { s.isLoading = true; })
      .addCase(getAllReviews.fulfilled, (s, a) => { s.isLoading = false; s.reviews = a.payload.success ? a.payload.data : []; s.total = a.payload.total || 0; })
      .addCase(deleteReview.fulfilled, (s, a) => { s.reviews = s.reviews.filter((r) => r._id !== a.id); })
      .addCase(updateReviewStatus.fulfilled, (s, a) => { const idx = s.reviews.findIndex((r) => r._id === a.id); if (idx !== -1) s.reviews[idx].status = a.payload.status; });
  },
});

export default reviewModerationSlice.reducer;
