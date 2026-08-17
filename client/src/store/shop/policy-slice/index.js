import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getPolicy = createAsyncThunk("policy/get", async (slug) => {
  const res = await axios.get(`http://localhost:9000/api/shop/policies/${slug}`, { withCredentials: true });
  return res.data;
});

const policySlice = createSlice({
  name: "policy",
  initialState: { current: null, isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPolicy.pending, (s) => { s.isLoading = true; })
      .addCase(getPolicy.fulfilled, (s, a) => { s.isLoading = false; s.current = a.payload.success ? a.payload.data : null; });
  },
});

export default policySlice.reducer;
