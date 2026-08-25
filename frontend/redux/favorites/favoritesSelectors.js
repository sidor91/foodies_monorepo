import { createSelector } from "@reduxjs/toolkit";

export const selectFavorites = (state) => state.favorites.items;
export const selectFavoriteIds = (state) => state.favorites.ids;
export const selectFavoritesIsLoading = (state) => state.favorites.isLoading;
export const selectFavoritesError = (state) => state.favorites.error;

export const selectFavoritesPagination = createSelector(
  (state) => state.favorites,
  ({ page, limit, total, totalPages }) => ({ page, limit, total, totalPages }),
);

export const selectIsFavorite = (recipeId) => (state) => state.favorites.ids.includes(recipeId);

export const selectIsFavoritePending = (recipeId) => (state) =>
  state.favorites.pendingIds.includes(recipeId);
