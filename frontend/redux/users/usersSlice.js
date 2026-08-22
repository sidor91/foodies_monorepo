import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import {
  fetchFollowers,
  fetchFollowing,
  fetchUserById,
  followUser,
  unfollowUser,
} from "./usersOps.js";
import { logOut } from "../auth/authOps.js";

const createList = () => ({
  items: [],
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
});

const initialState = {
  profile: null,
  followers: createList(),
  following: createList(),
  followingIds: [],
  pendingIds: [],
  isLoading: false,
  error: null,
};

const fillList = (list, payload) => {
  list.items = payload.items;
  list.page = payload.page;
  list.limit = payload.limit;
  list.total = payload.total;
  list.totalPages = payload.totalPages;
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.isLoading = false;
        fillList(state.followers, action.payload);
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.isLoading = false;
        fillList(state.following, action.payload);
        state.followingIds = action.payload.items.map((user) => user.id);
      })
      .addCase(followUser.fulfilled, (state, action) => {
        if (!state.followingIds.includes(action.payload)) {
          state.followingIds.push(action.payload);
        }

        if (state.profile?.id === action.payload) {
          state.profile.followersCount += 1;
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.followingIds = state.followingIds.filter((id) => id !== action.payload);

        const index = state.following.items.findIndex((user) => user.id === action.payload);
        if (index !== -1) {
          state.following.items.splice(index, 1);
          state.following.total = Math.max(state.following.total - 1, 0);
          state.following.totalPages = Math.ceil(state.following.total / state.following.limit);
        }

        if (state.profile?.id === action.payload) {
          state.profile.followersCount = Math.max(state.profile.followersCount - 1, 0);
        }
      })
      .addCase(logOut.fulfilled, () => initialState)
      .addMatcher(isAnyOf(followUser.pending, unfollowUser.pending), (state, action) => {
        state.error = null;
        state.pendingIds.push(action.meta.arg);
      })
      .addMatcher(
        isAnyOf(
          followUser.fulfilled,
          unfollowUser.fulfilled,
          followUser.rejected,
          unfollowUser.rejected,
        ),
        (state, action) => {
          state.pendingIds = state.pendingIds.filter((id) => id !== action.meta.arg);
        },
      )
      .addMatcher(
        isAnyOf(fetchUserById.pending, fetchFollowers.pending, fetchFollowing.pending),
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          fetchUserById.rejected,
          fetchFollowers.rejected,
          fetchFollowing.rejected,
          followUser.rejected,
          unfollowUser.rejected,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { clearProfile } = usersSlice.actions;

export default usersSlice.reducer;
