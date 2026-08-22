import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice.js";
import filtersReducer from "./filters/filtersSlice.js";
import recipesReducer from "./recipes/recipesSlice.js";
import favoritesReducer from "./favorites/favoritesSlice.js";
import referencesReducer from "./references/referencesSlice.js";
import usersReducer from "./users/usersSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filtersReducer,
    recipes: recipesReducer,
    favorites: favoritesReducer,
    references: referencesReducer,
    users: usersReducer,
  },
});
