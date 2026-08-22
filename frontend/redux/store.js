import { configureStore } from "@reduxjs/toolkit";
// import filtersReducer from "./filters/filtersSlice";
// import campersReducer from "./campers/campersSlice";
// import favoritesReducer from "./favorites/favoritesSlice";
import { recipeDraftReducer } from "./recipeDraft/recipeDraftSlice";
import { recipesReducer } from "./recipes/recipesSlice";

export const store = configureStore({
  reducer: {
    // filters: filtersReducer,
    recipes: recipesReducer,
    // favorites: favoritesReducer,
    recipeDraft: recipeDraftReducer,
  },
});
