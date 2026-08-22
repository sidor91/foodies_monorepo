import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import { addFavorite, fetchFavorites, removeFavorite } from "./favoritesOps.js";
import { logOut } from "../auth/authOps.js";

const initialState = {
  items: [],
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
  ids: [],
  pendingIds: [],
  isLoading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        const { items, page, limit, total, totalPages } = action.payload;

        state.isLoading = false;
        state.items = items;
        state.page = page;
        state.limit = limit;
        state.total = total;
        state.totalPages = totalPages;
        state.ids = items.map((recipe) => recipe.id);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        if (!state.ids.includes(action.payload)) {
          state.ids.push(action.payload);
        }
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.ids = state.ids.filter((id) => id !== action.payload);

        const index = state.items.findIndex((recipe) => recipe.id === action.payload);
        if (index !== -1) {
          state.items.splice(index, 1);
          state.total = Math.max(state.total - 1, 0);
          state.totalPages = Math.ceil(state.total / state.limit);
        }
      })
      .addCase(logOut.fulfilled, () => initialState)
      .addMatcher(isAnyOf(addFavorite.pending, removeFavorite.pending), (state, action) => {
        state.error = null;
        state.pendingIds.push(action.meta.arg);
      })
      .addMatcher(
        isAnyOf(
          addFavorite.fulfilled,
          removeFavorite.fulfilled,
          addFavorite.rejected,
          removeFavorite.rejected,
        ),
        (state, action) => {
          state.pendingIds = state.pendingIds.filter((id) => id !== action.meta.arg);

          if (action.type.endsWith("/rejected")) {
            state.error = action.payload;
          }
        },
      );
  },
});

export default favoritesSlice.reducer;
