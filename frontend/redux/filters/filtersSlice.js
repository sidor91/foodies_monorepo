import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: null,
  area: null,
  ingredient: null,
  page: 1,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 1;
    },
    setArea: (state, action) => {
      state.area = action.payload;
      state.page = 1;
    },
    setIngredient: (state, action) => {
      state.ingredient = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setCategory, setArea, setIngredient, setPage, resetFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
