import { createSelector } from "@reduxjs/toolkit";

export const selectCategory = (state) => state.filters.category;
export const selectArea = (state) => state.filters.area;
export const selectIngredient = (state) => state.filters.ingredient;
export const selectPage = (state) => state.filters.page;

export const selectSearchParams = createSelector(
  [selectCategory, selectArea, selectIngredient, selectPage],
  (category, area, ingredient, page) => ({ category, area, ingredient, page }),
);
