import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./filters/filtersSlice";
import campersReducer from "./campers/campersSlice";
import favoritesReducer from "./favorites/favoritesSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    recipes: recipesReducer,
    favorites: favoritesReducer,
  },
});