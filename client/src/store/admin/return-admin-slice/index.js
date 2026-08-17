import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/admin/returns";

export const getReturnRequests = createAsyncThunk("returnAdmin/get", async (status = "") => {
  const url = status ? `${API}/get?status=${status}` : `${API}/get`;
  const res = await axios.get(url, { withCredentials: true });
  return res.data;
});

export const processReturn = createAsyncThunk("returnAdmin/process", async ({ id, action }) => {
  const res = await axios.put(`${API}/process/${id}`, { action }, { withCredentials: true });
  return res.data;
});

const returnAdminSlice = createSlice({
  name: "returnAdmin",
  initialState: { returns: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReturnRequests.pending, (s) => { s.isLoading = true; })
      .addCase(getReturnRequests.fulfilled, (s, a) => { s.isLoading = false; s.returns = a.payload.success ? a.payload.data : []; })
      .addCase(processReturn.fulfilled, (s, a) => {
        if (a.payload.success) {
          const idx = s.returns.findIndex((r) => r._id === a.payload.data._id);
          if (idx >= 0) s.returns[idx] = a.payload.data;
        }
      });
  },
});

export default returnAdminSlice.reducer;
