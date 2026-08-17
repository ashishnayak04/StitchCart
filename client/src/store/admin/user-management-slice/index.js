import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/admin/users";

export const getAllUsers = createAsyncThunk(
  "userMgmt/getAll",
  async ({ page = 1, limit = 20, search = "", role = "" } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);
    if (role) params.append("role", role);
    const res = await axios.get(`${API}/get?${params}`, { withCredentials: true });
    return res.data;
  }
);

export const getUserDetails = createAsyncThunk("userMgmt/getDetails", async (id) => {
  const res = await axios.get(`${API}/details/${id}`, { withCredentials: true });
  return res.data;
});

export const createUser = createAsyncThunk("userMgmt/create", async (data) => {
  const res = await axios.post(`${API}/add`, data, { withCredentials: true });
  return res.data;
});

export const updateUser = createAsyncThunk("userMgmt/update", async ({ id, ...data }) => {
  const res = await axios.put(`${API}/update/${id}`, data, { withCredentials: true });
  return res.data;
});

export const deleteUser = createAsyncThunk("userMgmt/delete", async (id) => {
  const res = await axios.delete(`${API}/delete/${id}`, { withCredentials: true });
  return { ...res.data, id };
});

export const toggleBlockUser = createAsyncThunk("userMgmt/toggleBlock", async (id) => {
  const res = await axios.put(`${API}/toggle-block/${id}`, {}, { withCredentials: true });
  return { ...res.data, id };
});

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState: {
    users: [],
    total: 0,
    totalPages: 0,
    page: 1,
    selectedUser: null,
    isLoading: false,
  },
  reducers: {
    resetSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.users = action.payload.data;
          state.total = action.payload.total || action.payload.data.length;
          state.totalPages = action.payload.totalPages || 1;
          state.page = action.payload.page || 1;
        }
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.users = [];
      })
      .addCase(getUserDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.selectedUser = action.payload.data;
        }
      })
      .addCase(getUserDetails.rejected, (state) => {
        state.isLoading = false;
        state.selectedUser = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.users.unshift(action.payload.data);
          state.total += 1;
        }
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const idx = state.users.findIndex((u) => u._id === action.payload.data._id);
          if (idx !== -1) state.users[idx] = action.payload.data;
          if (state.selectedUser && state.selectedUser._id === action.payload.data._id) {
            state.selectedUser = action.payload.data;
          }
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.users = state.users.filter((u) => u._id !== action.id);
          state.total = Math.max(0, state.total - 1);
        }
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const idx = state.users.findIndex((u) => u._id === action.id);
          if (idx !== -1) {
            state.users[idx].role = action.payload.data.role;
          }
        }
      });
  },
});

export const { resetSelectedUser } = userManagementSlice.actions;

export default userManagementSlice.reducer;
