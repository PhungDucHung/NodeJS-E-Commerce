import { createSlice } from "@reduxjs/toolkit";
import {getNewProducts} from './asyncActions';

export const productSlice = createSlice({
  name: 'product',
  initialState: {
    newProducts: null,
    errorMessage: '',
    currentCart: []
  },
  reducers: {
    // Các reducers khác nếu có
  },
  extraReducers: (builder) => {
    builder.addCase(getNewProducts.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getNewProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.newProducts = action.payload;
    });
    builder.addCase(getNewProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload?.message || 'Failed to fetch categories';
    });
  }
});

export default productSlice.reducer;
