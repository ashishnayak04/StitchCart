import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  total: 0,
  totalPages: 1,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async ({ page = 1, limit = 15, search = "", status = "" } = {}) => {
    // We should allow parameters to be passed to the API
    const response = await axios.get(
      `http://localhost:9000/api/admin/orders/get?page=${page}&limit=${limit}&search=${search}&status=${status}`
    );

    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(
      `http://localhost:9000/api/admin/orders/details/${id}`
    );

    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus, trackingNumber, trackingUrl, note }) => {
    const response = await axios.put(
      `http://localhost:9000/api/admin/orders/update/${id}`,
      {
        orderStatus,
        trackingNumber,
        trackingUrl,
        note
      }
    );

    return response.data;
  }
);

export const refundOrder = createAsyncThunk(
  "/order/refundOrder",
  async ({ id, refundReason }) => {
    const response = await axios.post(
      `http://localhost:9000/api/admin/orders/refund/${id}`,
      {
        refundReason,
      }
    );

    return response.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");

      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
        state.total = 0;
        state.totalPages = 1;
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
