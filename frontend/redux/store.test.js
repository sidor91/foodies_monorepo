import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { logIn } from "./auth/authOps.js";
import { addFavorite } from "./favorites/favoritesOps.js";
import { setCategory } from "./filters/filtersSlice.js";
import { updateDraft } from "./recipeFormDraftSlice/recipeFormDraftSlice.js";
import { fetchRecipeById } from "./recipes/recipesOps.js";
import { fetchCategories } from "./references/referencesOps.js";
import { fetchUserById } from "./users/usersOps.js";

let store;
let persistor;

const waitForRehydration = () =>
  new Promise((resolve) => {
    if (persistor.getState().bootstrapped) {
      resolve();
      return;
    }

    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        unsubscribe();
        resolve();
      }
    });
  });

const expectOnlyBranchToChange = (branch, action) => {
  const previousState = store.getState();

  store.dispatch(action);

  const nextState = store.getState();
  expect(nextState[branch]).not.toBe(previousState[branch]);

  for (const otherBranch of Object.keys(previousState).filter((key) => key !== branch)) {
    expect(nextState[otherBranch]).toBe(previousState[otherBranch]);
  }
};

describe("Redux store", () => {
  beforeAll(async () => {
    localStorage.clear();
    ({ store, persistor } = await import("./store.js"));
    await waitForRehydration();
  });

  afterAll(() => {
    persistor.pause();
  });

  it("contains all Redux state branches", () => {
    expect(Object.keys(store.getState())).toEqual([
      "auth",
      "filters",
      "recipes",
      "favorites",
      "references",
      "users",
      "recipeDraft",
    ]);
  });

  it("initializes all persisted reducers", () => {
    expect(persistor.getState().bootstrapped).toBe(true);
  });

  it("routes an authentication action only to auth", () => {
    expectOnlyBranchToChange(
      "auth",
      logIn.fulfilled({ id: "user-1" }, "request-auth", { email: "alex@example.com" }),
    );
  });

  it("routes a filter action only to filters", () => {
    expectOnlyBranchToChange("filters", setCategory("Beef"));
  });

  it("routes a recipe action only to recipes", () => {
    expectOnlyBranchToChange(
      "recipes",
      fetchRecipeById.fulfilled({ id: "recipe-1" }, "request-recipes", "recipe-1"),
    );
  });

  it("routes a favorite action only to favorites", () => {
    expectOnlyBranchToChange(
      "favorites",
      addFavorite.fulfilled("recipe-1", "request-favorites", "recipe-1"),
    );
  });

  it("routes a references action only to references", () => {
    expectOnlyBranchToChange(
      "references",
      fetchCategories.fulfilled([{ id: "category-1" }], "request-references"),
    );
  });

  it("routes a user action only to users", () => {
    expectOnlyBranchToChange(
      "users",
      fetchUserById.fulfilled({ id: "user-2" }, "request-users", "user-2"),
    );
  });

  it("routes a recipe draft action only to recipeDraft", () => {
    expectOnlyBranchToChange("recipeDraft", updateDraft({ title: "Vegetable Soup" }));
  });
});
