import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./auth/authSlice.js";
import filtersReducer from "./filters/filtersSlice.js";
import recipesReducer from "./recipes/recipesSlice.js";
import favoritesReducer from "./favorites/favoritesSlice.js";
import referencesReducer from "./references/referencesSlice.js";
import usersReducer from "./users/usersSlice.js";
import recipeDraftReducer from "./recipeFormDraftSlice/recipeFormDraftSlice.js";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isLoggedIn"],
};

const referencesPersistConfig = {
  key: "references",
  storage,
  whitelist: ["categories", "areas", "ingredients", "testimonials"],
};

const recipeDraftPersistConfig = {
  key: "recipeDraft",
  storage,
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    filters: filtersReducer,
    recipes: recipesReducer,
    favorites: favoritesReducer,
    references: persistReducer(referencesPersistConfig, referencesReducer),
    users: usersReducer,
    recipeDraft: persistReducer(recipeDraftPersistConfig, recipeDraftReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
