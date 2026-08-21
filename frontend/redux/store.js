import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./filters/filtersSlice";
import favoritesReducer from "./favorites/favoritesSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    // recipes: recipesReducer,
    favorites: favoritesReducer,
  },
});
