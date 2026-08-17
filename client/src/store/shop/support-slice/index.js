import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/shop/support";

export const createSupportTicket = createAsyncThunk("support/create", async (data) => {
  const res = await axios.post(`${API}/create`, data, { withCredentials: true });
  return res.data;
});

export const getUserTickets = createAsyncThunk("support/getUser", async (userId) => {
  const res = await axios.get(`${API}/user/${userId}`, { withCredentials: true });
  return res.data;
});

export const getTicketDetails = createAsyncThunk("support/getDetails", async (id) => {
  const res = await axios.get(`${API}/${id}`, { withCredentials: true });
  return res.data;
});

export const addTicketReply = createAsyncThunk("support/reply", async ({ id, userId, message }) => {
  const res = await axios.post(`${API}/${id}/reply`, { userId, message }, { withCredentials: true });
  return res.data;
});

const supportSlice = createSlice({
  name: "support",
  initialState: { tickets: [], currentTicket: null, isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserTickets.pending, (s) => { s.isLoading = true; })
      .addCase(getUserTickets.fulfilled, (s, a) => { s.isLoading = false; s.tickets = a.payload.success ? a.payload.data : []; })
      .addCase(getTicketDetails.fulfilled, (s, a) => { s.currentTicket = a.payload.success ? a.payload.data : null; })
      .addCase(addTicketReply.fulfilled, (s, a) => { if (a.payload.success) s.currentTicket = a.payload.data; });
  },
});

export default supportSlice.reducer;
