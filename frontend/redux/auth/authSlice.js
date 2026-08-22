import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import { logIn, logOut, refreshUser, register, updateAvatar } from "./authOps.js";

const initialState = {
  user: null,
  isLoggedIn: false,
  isRefreshing: false,
  isLoading: false,
  error: null,
};

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const handleAuthSuccess = (state, action) => {
  state.user = action.payload;
  state.isLoggedIn = true;
  state.isLoading = false;
  state.error = null;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, handleAuthSuccess)
      .addCase(logIn.fulfilled, handleAuthSuccess)
      .addCase(logOut.fulfilled, () => initialState)
      .addCase(refreshUser.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(refreshUser.rejected, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.isRefreshing = false;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.isLoading = false;

        if (state.user) {
          state.user.avatarUrl = action.payload.avatarUrl;
        }
      })
      .addMatcher(
        isAnyOf(register.pending, logIn.pending, logOut.pending, updateAvatar.pending),
        handlePending,
      )
      .addMatcher(
        isAnyOf(register.rejected, logIn.rejected, logOut.rejected, updateAvatar.rejected),
        handleRejected,
      );
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
