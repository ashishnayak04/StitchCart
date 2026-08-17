import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/shop/notifications";

export const getNotifications = createAsyncThunk("notifications/get", async (userId) => {
  const res = await axios.get(`${API}/get/${userId}`, { withCredentials: true });
  return res.data;
});

export const markNotificationRead = createAsyncThunk("notifications/read", async (id) => {
  const res = await axios.put(`${API}/read/${id}`, {}, { withCredentials: true });
  return res.data;
});

export const markAllNotificationsRead = createAsyncThunk("notifications/readAll", async (userId) => {
  const res = await axios.put(`${API}/read-all/${userId}`, {}, { withCredentials: true });
  return res.data;
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { items: [], unreadCount: 0, isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (s) => { s.isLoading = true; })
      .addCase(getNotifications.fulfilled, (s, a) => {
        s.isLoading = false;
        s.items = a.payload.success ? a.payload.data : [];
        s.unreadCount = a.payload.unreadCount || 0;
      })
      .addCase(markAllNotificationsRead.fulfilled, (s) => { s.unreadCount = 0; s.items.forEach((n) => { n.isRead = true; }); });
  },
});

export default notificationSlice.reducer;
