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
  pending: [],
  isLoading: false,
  error: null,
};

const listKey = (action) => action.type.split("/")[1];

const referencesSlice = createSlice({
  name: "references",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.areas = action.payload;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.testimonials = action.payload;
      })
      .addMatcher(
        isAnyOf(
          fetchCategories.pending,
          fetchAreas.pending,
          fetchIngredients.pending,
          fetchTestimonials.pending,
        ),
        (state, action) => {
          state.pending.push(listKey(action));
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
          state.error = action.payload;
        },
      )
      .addMatcher(
        (action) => /^references\/\w+\/(fulfilled|rejected)$/.test(action.type),
        (state, action) => {
          state.pending = state.pending.filter((key) => key !== listKey(action));
          state.isLoading = state.pending.length > 0;
        },
      );
  },
});

export default referencesSlice.reducer;
