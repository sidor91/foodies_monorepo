import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import {
  createRecipe,
  deleteRecipe,
  fetchOwnRecipes,
  fetchPopularRecipes,
  fetchRecipeById,
  fetchRecipes,
  addRecipe,
} from "./recipesOps.js";
import { logOut } from "../auth/authOps.js";

const createList = () => ({
  items: [],
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
});

const initialState = {
  list: createList(),
  own: createList(),
  popular: [],
  current: null,
  categories: [],
  areas: [],
  ingredientsList: [],
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
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        fillList(state.list, action.payload);
      })
      .addCase(fetchOwnRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        fillList(state.own, action.payload);
      })
      .addCase(fetchPopularRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.popular = action.payload;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        removeFromList(state.own, action.payload);
        removeFromList(state.list, action.payload);

        if (state.current?.id === action.payload) {
          state.current = null;
        }
      })
      .addCase(logOut.fulfilled, (state) => {
        state.own = createList();
      })
      .addCase(addRecipe.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(
          fetchRecipes.pending,
          fetchOwnRecipes.pending,
          fetchPopularRecipes.pending,
          fetchRecipeById.pending,
          createRecipe.pending,
          deleteRecipe.pending,
        ),
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          fetchRecipes.rejected,
          fetchOwnRecipes.rejected,
          fetchPopularRecipes.rejected,
          fetchRecipeById.rejected,
          createRecipe.rejected,
          deleteRecipe.rejected,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { clearCurrentRecipe } = recipesSlice.actions;

export default recipesSlice.reducer;
