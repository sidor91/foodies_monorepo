import { createSlice } from "@reduxjs/toolkit";

import {
  deleteRecipe,
  fetchOwnRecipes,
  fetchPopularRecipes,
  fetchRecipeById,
  fetchRecipes,
} from "./recipesOps.js";
import { logOut } from "../auth/authOps.js";

const createList = () => ({
  items: [],
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
});

const initialState = {
  list: createList(),
  own: createList(),
  popular: { items: [], isLoading: false, error: null },
  current: { data: null, isLoading: false, error: null },
};

const fillList = (list, payload) => {
  list.items = payload.items;
  list.page = payload.page;
  list.limit = payload.limit;
  list.total = payload.total;
  list.totalPages = payload.totalPages;
};

const removeFromList = (list, id) => {
  const index = list.items.findIndex((recipe) => recipe.id === id);

  if (index !== -1) {
    list.items.splice(index, 1);
    list.total = Math.max(list.total - 1, 0);
    list.totalPages = Math.ceil(list.total / list.limit);
  }
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    clearCurrentRecipe: (state) => {
      state.current.data = null;
      state.current.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.list.isLoading = true;
        state.list.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.list.isLoading = false;
        fillList(state.list, action.payload);
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.list.isLoading = false;
        state.list.error = action.payload;
      })
      .addCase(fetchOwnRecipes.pending, (state) => {
        state.own.isLoading = true;
        state.own.error = null;
      })
      .addCase(fetchOwnRecipes.fulfilled, (state, action) => {
        state.own.isLoading = false;
        fillList(state.own, action.payload);
      })
      .addCase(fetchOwnRecipes.rejected, (state, action) => {
        state.own.isLoading = false;
        state.own.error = action.payload;
      })
      .addCase(fetchPopularRecipes.pending, (state) => {
        state.popular.isLoading = true;
        state.popular.error = null;
      })
      .addCase(fetchPopularRecipes.fulfilled, (state, action) => {
        state.popular.isLoading = false;
        state.popular.items = action.payload;
      })
      .addCase(fetchPopularRecipes.rejected, (state, action) => {
        state.popular.isLoading = false;
        state.popular.error = action.payload;
      })
      .addCase(fetchRecipeById.pending, (state) => {
        state.current.isLoading = true;
        state.current.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.current.isLoading = false;
        state.current.data = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.current.isLoading = false;
        state.current.error = action.payload;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        removeFromList(state.own, action.payload);
        removeFromList(state.list, action.payload);

        if (state.current.data?.id === action.payload) {
          state.current.data = null;
        }
      })
      .addCase(logOut.fulfilled, (state) => {
        state.own = createList();
      });
  },
});

export const { clearCurrentRecipe } = recipesSlice.actions;

export default recipesSlice.reducer;
