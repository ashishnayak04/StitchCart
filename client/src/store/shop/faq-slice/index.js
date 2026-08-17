import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getFAQs = createAsyncThunk("faq/get", async () => {
  const res = await axios.get("http://localhost:9000/api/shop/faq", { withCredentials: true });
  return res.data;
});

const faqSlice = createSlice({
  name: "faq",
  initialState: { items: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFAQs.pending, (s) => { s.isLoading = true; })
      .addCase(getFAQs.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload.success ? a.payload.data : []; });
  },
});

export default faqSlice.reducer;
