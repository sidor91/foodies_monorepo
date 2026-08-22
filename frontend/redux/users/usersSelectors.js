import { createSelector } from "@reduxjs/toolkit";

export const selectProfile = (state) => state.users.profile;
export const selectFollowers = (state) => state.users.followers.items;
export const selectFollowing = (state) => state.users.following.items;
export const selectFollowingIds = (state) => state.users.followingIds;
export const selectUsersIsLoading = (state) => state.users.isLoading;
export const selectUsersError = (state) => state.users.error;

const toPagination = ({ page, limit, total, totalPages }) => ({ page, limit, total, totalPages });

export const selectFollowersPagination = createSelector(
  (state) => state.users.followers,
  toPagination,
);

export const selectFollowingPagination = createSelector(
  (state) => state.users.following,
  toPagination,
);

export const selectIsFollowing = (userId) => (state) => state.users.followingIds.includes(userId);

export const selectIsFollowPending = (userId) => (state) => state.users.pendingIds.includes(userId);
