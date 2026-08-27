import { createSelector } from "@reduxjs/toolkit";

export const selectRecipes = (state) => state.recipes.list.items;
export const selectOwnRecipes = (state) => state.recipes.own.items;
export const selectPopularRecipes = (state) => state.recipes.popular.items;
export const selectPopularRecipesIsLoading = (state) => state.recipes.popular.isLoading;
export const selectPopularRecipesError = (state) => state.recipes.popular.error;
export const selectCurrentRecipe = (state) => state.recipes.current.data;
export const selectCurrentRecipeIsLoading = (state) => state.recipes.current.isLoading;
export const selectCurrentRecipeError = (state) => state.recipes.current.error;
export const selectRecipesIsLoading = (state) => state.recipes.list.isLoading;
export const selectRecipesError = (state) => state.recipes.list.error;

const toPagination = ({ page, limit, total, totalPages }) => ({ page, limit, total, totalPages });

export const selectRecipesPagination = createSelector((state) => state.recipes.list, toPagination);

export const selectOwnRecipesPagination = createSelector(
  (state) => state.recipes.own,
  toPagination,
);
