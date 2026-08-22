import { createSlice, createSelector } from "@reduxjs/toolkit";
import { fetchRecipeMetadata, addRecipe } from "./recipesOps";

const recipesSlice = createSlice({
  name: "recipes",
  initialState: {
    categories: [],
    areas: [],
    ingredientsList: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipeMetadata.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRecipeMetadata.fulfilled, (state, action) => {
        console.log("Fetched recipe metadata in slice11111111111:", action.payload);
        state.isLoading = false;
        state.categories = action.payload.categories;
        state.areas = action.payload.areas;
        state.ingredientsList = action.payload.ingredientsList;
      })
      .addCase(fetchRecipeMetadata.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addRecipe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addRecipe.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const recipesReducer = recipesSlice.reducer;

// Selector to get the recipe metadata from the state

const selectRecipesState = (state) => state.recipes;

export const selectRecipeMetadata = createSelector([selectRecipesState], (recipesState) => ({
  categories: recipesState.categories,
  areas: recipesState.areas,
  ingredientsList: recipesState.ingredientsList,
  isLoading: recipesState.isLoading,
  error: recipesState.error,
}));
