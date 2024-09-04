import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null
  },
  reducers: {
    register: (state, action) => { // Sửa lỗi chính tả từ 'regiser' thành 'register'
      console.log(action)
      state.isLoggedIn = action.payload.isLoggedIn;
      state.current = action.payload.userData;
      state.token = action.payload.token;
    }
  }
  // Uncomment and adjust the extraReducers if needed
  // extraReducers: (builder) => {
  //   builder.addCase(getNewProducts.pending, (state) => {
  //     state.isLoading = true;
  //   });
  //   builder.addCase(getNewProducts.fulfilled, (state, action) => {
  //     state.isLoading = false;
  //     state.newProducts = action.payload;
  //   });
  //   builder.addCase(getNewProducts.rejected, (state, action) => {
  //     state.isLoading = false;
  //     state.errorMessage = action.payload?.message || 'Failed to fetch categories';
  //   });
  // }
});

export const { register } = userSlice.actions; // Xuất ra action creator
export default userSlice.reducer;
