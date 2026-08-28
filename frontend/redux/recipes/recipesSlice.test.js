import { describe, expect, it } from "vitest";

import { logOut } from "../auth/authOps.js";
import {
  addRecipe,
  deleteRecipe,
  fetchOwnRecipes,
  fetchPopularRecipes,
  fetchRecipeById,
  fetchRecipes,
} from "./recipesOps.js";
import recipesReducer, { clearCurrentRecipe } from "./recipesSlice.js";

const createList = (items = []) => ({
  items,
  page: 1,
  limit: 2,
  total: items.length,
  totalPages: Math.ceil(items.length / 2),
});

const createInitialState = () => ({
  list: { items: [], page: 1, limit: 12, total: 0, totalPages: 0 },
  own: { items: [], page: 1, limit: 12, total: 0, totalPages: 0 },
  popular: [],
  current: null,
  categories: [],
  areas: [],
  ingredientsList: [],
  isLoading: false,
  error: null,
});

const pagePayload = {
  items: [{ id: "recipe-1", title: "Soup" }],
  page: 2,
  limit: 6,
  total: 7,
  totalPages: 2,
};

describe("recipesSlice", () => {
  it("returns the initial state", () => {
    expect(recipesReducer(undefined, { type: "unknown" })).toEqual(createInitialState());
  });

  it("clears the current recipe", () => {
    const state = { ...createInitialState(), current: { id: "recipe-1" } };

    expect(recipesReducer(state, clearCurrentRecipe()).current).toBeNull();
  });

  it("stores the recipes list", () => {
    const nextState = recipesReducer(
      createInitialState(),
      fetchRecipes.fulfilled(pagePayload, "request-1", {}),
    );

    expect(nextState.list).toEqual(pagePayload);
    expect(nextState.isLoading).toBe(false);
  });

  it("stores the authenticated user's recipes", () => {
    const nextState = recipesReducer(
      createInitialState(),
      fetchOwnRecipes.fulfilled(pagePayload, "request-1", {}),
    );

    expect(nextState.own).toEqual(pagePayload);
  });

  it("stores popular recipes", () => {
    const recipes = [{ id: "recipe-1" }];

    const nextState = recipesReducer(
      createInitialState(),
      fetchPopularRecipes.fulfilled(recipes, "request-1", 5),
    );

    expect(nextState.popular).toEqual(recipes);
  });

  it("stores the selected recipe", () => {
    const recipe = { id: "recipe-1", title: "Soup" };

    const nextState = recipesReducer(
      createInitialState(),
      fetchRecipeById.fulfilled(recipe, "request-1", "recipe-1"),
    );

    expect(nextState.current).toEqual(recipe);
  });

  it("removes a deleted recipe from all lists and clears it as current", () => {
    const recipe = { id: "recipe-1" };
    const otherRecipe = { id: "recipe-2" };
    const state = {
      ...createInitialState(),
      list: createList([recipe, otherRecipe]),
      own: createList([recipe, otherRecipe]),
      current: recipe,
      isLoading: true,
    };

    const nextState = recipesReducer(
      state,
      deleteRecipe.fulfilled("recipe-1", "request-1", "recipe-1"),
    );

    expect(nextState.list.items).toEqual([otherRecipe]);
    expect(nextState.own.items).toEqual([otherRecipe]);
    expect(nextState.list.total).toBe(1);
    expect(nextState.list.totalPages).toBe(1);
    expect(nextState.current).toBeNull();
    expect(nextState.isLoading).toBe(false);
  });

  it("clears only the user's recipes after logout", () => {
    const state = {
      ...createInitialState(),
      list: createList([{ id: "recipe-1" }]),
      own: createList([{ id: "recipe-2" }]),
    };

    const nextState = recipesReducer(state, logOut.fulfilled(undefined, "request-1"));

    expect(nextState.own).toEqual({ items: [], page: 1, limit: 12, total: 0, totalPages: 0 });
    expect(nextState.list.items).toEqual([{ id: "recipe-1" }]);
  });

  it("marks a recipe request as pending", () => {
    const state = { ...createInitialState(), error: "Old error" };

    const nextState = recipesReducer(state, fetchRecipes.pending("request-1", {}));

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it("stores a rejected recipe request error", () => {
    const action = fetchRecipes.rejected(
      new Error("Request failed"),
      "request-1",
      {},
      "Request failed",
    );

    const nextState = recipesReducer({ ...createInitialState(), isLoading: true }, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe("Request failed");
  });

  it("finishes loading after a recipe is added", () => {
    const nextState = recipesReducer(
      { ...createInitialState(), isLoading: true },
      addRecipe.fulfilled({ id: "recipe-1" }, "request-1", new FormData()),
    );

    expect(nextState.isLoading).toBe(false);
  });
});
