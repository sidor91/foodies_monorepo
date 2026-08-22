import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import {
  fetchAreas,
  fetchCategories,
  fetchIngredients,
  fetchTestimonials,
} from "./referencesOps.js";

const initialState = {
  categories: [],
  areas: [],
  ingredients: [],
  testimonials: [],
  isLoading: false,
  error: null,
};

const referencesSlice = createSlice({
  name: "references",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.areas = action.payload;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.testimonials = action.payload;
      })
      .addMatcher(
        isAnyOf(
          fetchCategories.pending,
          fetchAreas.pending,
          fetchIngredients.pending,
          fetchTestimonials.pending,
        ),
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          fetchCategories.rejected,
          fetchAreas.rejected,
          fetchIngredients.rejected,
          fetchTestimonials.rejected,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      );
  },
});

export default referencesSlice.reducer;
