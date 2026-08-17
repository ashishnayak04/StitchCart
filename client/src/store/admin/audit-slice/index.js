import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/admin/audit";

export const getAuditLogs = createAsyncThunk("audit/get", async ({ page = 1, limit = 50 } = {}) => {
  const res = await axios.get(`${API}/get?page=${page}&limit=${limit}`, { withCredentials: true });
  return res.data;
});

const auditSlice = createSlice({
  name: "audit",
  initialState: { logs: [], total: 0, isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAuditLogs.pending, (s) => { s.isLoading = true; })
      .addCase(getAuditLogs.fulfilled, (s, a) => { s.isLoading = false; s.logs = a.payload.success ? a.payload.data : []; s.total = a.payload.total || 0; });
  },
});

export default auditSlice.reducer;
