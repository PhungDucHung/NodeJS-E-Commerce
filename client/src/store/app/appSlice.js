import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncActions';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    categories: null,
    isLoading: false,
    errorMessage: null
  },
  reducers: {
    // Các reducers khác nếu có
  },
  extraReducers: (builder) => {
    builder.addCase(actions.getCategories.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null; // Xóa lỗi khi đang tải
    });

    builder.addCase(actions.getCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    });

    builder.addCase(actions.getCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload?.message || 'Failed to fetch categories';
    });
  }
});
export default appSlice.reducer;
