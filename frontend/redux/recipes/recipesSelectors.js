import { createSelector } from "@reduxjs/toolkit";

export const selectRecipes = (state) => state.recipes.list.items;
export const selectOwnRecipes = (state) => state.recipes.own.items;
export const selectPopularRecipes = (state) => state.recipes.popular;
export const selectCurrentRecipe = (state) => state.recipes.current;
export const selectRecipesIsLoading = (state) => state.recipes.isLoading;
export const selectRecipesError = (state) => state.recipes.error;

const toPagination = ({ page, limit, total, totalPages }) => ({ page, limit, total, totalPages });

export const selectRecipesPagination = createSelector((state) => state.recipes.list, toPagination);

export const selectOwnRecipesPagination = createSelector(
  (state) => state.recipes.own,
  toPagination,
);
