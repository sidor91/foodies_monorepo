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

const createList = (items = [], limit = 12) => ({
  items,
  page: 1,
  limit,
  total: items.length,
  totalPages: items.length ? Math.ceil(items.length / limit) : 0,
  isLoading: false,
  error: null,
});

const createInitialState = () => ({
  list: createList(),
  own: createList(),
  popular: { items: [], isLoading: false, error: null },
  current: { data: null, isLoading: false, error: null },
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

  it("clears the current recipe and its error", () => {
    const state = {
      ...createInitialState(),
      current: { data: { id: "recipe-1" }, isLoading: false, error: "Old error" },
    };

    expect(recipesReducer(state, clearCurrentRecipe()).current).toEqual({
      data: null,
      isLoading: false,
      error: null,
    });
  });

  it("stores the public recipes list", () => {
    const nextState = recipesReducer(
      createInitialState(),
      fetchRecipes.fulfilled(pagePayload, "request-1", {}),
    );

    expect(nextState.list).toEqual({ ...pagePayload, isLoading: false, error: null });
  });

  it("stores the authenticated user's recipes", () => {
    const nextState = recipesReducer(
      createInitialState(),
      fetchOwnRecipes.fulfilled(pagePayload, "request-1", {}),
    );

    expect(nextState.own).toEqual({ ...pagePayload, isLoading: false, error: null });
  });

  it("stores popular recipes", () => {
    const recipes = [{ id: "recipe-1" }];
    const nextState = recipesReducer(
      createInitialState(),
      fetchPopularRecipes.fulfilled(recipes, "request-1", 5),
    );

    expect(nextState.popular).toEqual({ items: recipes, isLoading: false, error: null });
  });

  it("stores the selected recipe", () => {
    const recipe = { id: "recipe-1", title: "Soup" };
    const nextState = recipesReducer(
      createInitialState(),
      fetchRecipeById.fulfilled(recipe, "request-1", "recipe-1"),
    );

    expect(nextState.current).toEqual({ data: recipe, isLoading: false, error: null });
  });

  it("removes a deleted recipe from lists and clears it as current", () => {
    const recipe = { id: "recipe-1" };
    const otherRecipe = { id: "recipe-2" };
    const state = {
      ...createInitialState(),
      list: createList([recipe, otherRecipe], 2),
      own: createList([recipe, otherRecipe], 2),
      current: { data: recipe, isLoading: false, error: null },
    };

    const nextState = recipesReducer(
      state,
      deleteRecipe.fulfilled("recipe-1", "request-1", "recipe-1"),
    );

    expect(nextState.list.items).toEqual([otherRecipe]);
    expect(nextState.own.items).toEqual([otherRecipe]);
    expect(nextState.list.total).toBe(1);
    expect(nextState.list.totalPages).toBe(1);
    expect(nextState.current.data).toBeNull();
  });

  it("clears only the user's recipes after logout", () => {
    const state = {
      ...createInitialState(),
      list: createList([{ id: "recipe-1" }]),
      own: createList([{ id: "recipe-2" }]),
    };

    const nextState = recipesReducer(state, logOut.fulfilled(undefined, "request-1"));

    expect(nextState.own).toEqual(createList());
    expect(nextState.list.items).toEqual([{ id: "recipe-1" }]);
  });

  it("marks only the public recipes request as pending", () => {
    const state = createInitialState();
    state.list.error = "Old error";

    const nextState = recipesReducer(state, fetchRecipes.pending("request-1", {}));

    expect(nextState.list.isLoading).toBe(true);
    expect(nextState.list.error).toBeNull();
    expect(nextState.own.isLoading).toBe(false);
  });

  it("stores an error for the rejected public recipes request", () => {
    const action = fetchRecipes.rejected(
      new Error("Request failed"),
      "request-1",
      {},
      "Request failed",
    );

    const state = createInitialState();
    state.list.isLoading = true;
    const nextState = recipesReducer(state, action);

    expect(nextState.list.isLoading).toBe(false);
    expect(nextState.list.error).toBe("Request failed");
  });

  it("tracks pending state for the user's recipes", () => {
    const nextState = recipesReducer(
      createInitialState(),
      fetchOwnRecipes.pending("request-1", {}),
    );

    expect(nextState.own.isLoading).toBe(true);
    expect(nextState.own.error).toBeNull();
  });

  it("stores an error for the user's recipes", () => {
    const action = fetchOwnRecipes.rejected(
      new Error("Own recipes failed"),
      "request-1",
      {},
      "Own recipes failed",
    );

    const nextState = recipesReducer(createInitialState(), action);

    expect(nextState.own.isLoading).toBe(false);
    expect(nextState.own.error).toBe("Own recipes failed");
  });

  it("tracks pending state for popular recipes", () => {
    const nextState = recipesReducer(
      createInitialState(),
      fetchPopularRecipes.pending("request-1", 5),
    );

    expect(nextState.popular.isLoading).toBe(true);
    expect(nextState.popular.error).toBeNull();
  });

  it("stores an error for popular recipes", () => {
    const action = fetchPopularRecipes.rejected(
      new Error("Popular recipes failed"),
      "request-1",
      5,
      "Popular recipes failed",
    );

    const nextState = recipesReducer(createInitialState(), action);

    expect(nextState.popular.isLoading).toBe(false);
    expect(nextState.popular.error).toBe("Popular recipes failed");
  });

  it("tracks pending state for the current recipe", () => {
    const nextState = recipesReducer(
      createInitialState(),
      fetchRecipeById.pending("request-1", "recipe-1"),
    );

    expect(nextState.current.isLoading).toBe(true);
    expect(nextState.current.error).toBeNull();
  });

  it("stores an error for the current recipe", () => {
    const action = fetchRecipeById.rejected(
      new Error("Recipe failed"),
      "request-1",
      "recipe-1",
      "Recipe failed",
    );

    const nextState = recipesReducer(createInitialState(), action);

    expect(nextState.current.isLoading).toBe(false);
    expect(nextState.current.error).toBe("Recipe failed");
  });

  it("tracks pending state while a recipe is added", () => {
    const state = createInitialState();
    state.current.error = "Old error";

    const nextState = recipesReducer(state, addRecipe.pending("request-1", new FormData()));

    expect(nextState.current.isLoading).toBe(true);
    expect(nextState.current.error).toBeNull();
  });

  it("stores an error when adding a recipe fails", () => {
    const action = addRecipe.rejected(
      new Error("Add failed"),
      "request-1",
      new FormData(),
      "Add failed",
    );

    const nextState = recipesReducer(createInitialState(), action);

    expect(nextState.current.isLoading).toBe(false);
    expect(nextState.current.error).toBe("Add failed");
  });

  it("finishes current loading after a recipe is added", () => {
    const state = createInitialState();
    state.current.isLoading = true;
    const nextState = recipesReducer(
      state,
      addRecipe.fulfilled({ id: "recipe-1" }, "request-1", new FormData()),
    );

    expect(nextState.current).toEqual({ data: null, isLoading: false, error: null });
  });
});
