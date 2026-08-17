import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/admin/support";

export const getAdminTickets = createAsyncThunk("supportAdmin/getAll", async (status = "") => {
  const url = status ? `${API}/get?status=${status}` : `${API}/get`;
  const res = await axios.get(url, { withCredentials: true });
  return res.data;
});

export const updateTicketStatus = createAsyncThunk("supportAdmin/updateStatus", async ({ id, status }) => {
  const res = await axios.put(`${API}/${id}/status`, { status }, { withCredentials: true });
  return res.data;
});

export const adminReplyTicket = createAsyncThunk("supportAdmin/reply", async ({ id, userId, message }) => {
  const res = await axios.post(`${API}/${id}/reply`, { userId, message }, { withCredentials: true });
  return res.data;
});

const supportAdminSlice = createSlice({
  name: "supportAdmin",
  initialState: { tickets: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminTickets.pending, (s) => { s.isLoading = true; })
      .addCase(getAdminTickets.fulfilled, (s, a) => { s.isLoading = false; s.tickets = a.payload.success ? a.payload.data : []; });
  },
});

export default supportAdminSlice.reducer;
