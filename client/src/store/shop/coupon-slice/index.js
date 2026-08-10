import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  appliedCoupon: null,
};

export const validateCoupon = createAsyncThunk(
  "/coupon/validateCoupon",
  async ({ code, cartAmount }) => {
    const response = await axios.post(
      "http://localhost:9000/api/shop/coupon/validate",
      {
        code,
        cartAmount,
      }
    );

    return response.data;
  }
);

const shopCouponSlice = createSlice({
  name: "shopCouponSlice",
  initialState,
  reducers: {
    resetCoupon: (state) => {
      state.appliedCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.appliedCoupon = action.payload.data;
        }
      })
      .addCase(validateCoupon.rejected, (state) => {
        state.isLoading = false;
        state.appliedCoupon = null;
      });
  },
});

export const { resetCoupon } = shopCouponSlice.actions;

export default shopCouponSlice.reducer;
