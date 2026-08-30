import { describe, expect, it } from "vitest";

import {
  selectCurrentRecipe,
  selectCurrentRecipeError,
  selectCurrentRecipeIsLoading,
  selectOwnRecipes,
  selectOwnRecipesPagination,
  selectPopularRecipes,
  selectPopularRecipesError,
  selectPopularRecipesIsLoading,
  selectRecipes,
  selectRecipesError,
  selectRecipesIsLoading,
  selectRecipesPagination,
} from "./recipesSelectors.js";

const state = {
  recipes: {
    list: {
      items: [{ id: "recipe-1" }],
      page: 2,
      limit: 6,
      total: 7,
      totalPages: 2,
      isLoading: true,
      error: "List failed",
    },
    own: {
      items: [{ id: "recipe-2" }],
      page: 1,
      limit: 12,
      total: 1,
      totalPages: 1,
      isLoading: false,
      error: null,
    },
    popular: { items: [{ id: "recipe-3" }], isLoading: true, error: "Popular failed" },
    current: { data: { id: "recipe-1" }, isLoading: true, error: "Current failed" },
  },
};

describe("recipesSelectors", () => {
  it("selects recipe collections and the current recipe", () => {
    expect(selectRecipes(state)).toEqual([{ id: "recipe-1" }]);
    expect(selectOwnRecipes(state)).toEqual([{ id: "recipe-2" }]);
    expect(selectPopularRecipes(state)).toEqual([{ id: "recipe-3" }]);
    expect(selectCurrentRecipe(state)).toEqual({ id: "recipe-1" });
  });

  it("selects the public recipes request status", () => {
    expect(selectRecipesIsLoading(state)).toBe(true);
    expect(selectRecipesError(state)).toBe("List failed");
  });

  it("selects the popular recipes request status", () => {
    expect(selectPopularRecipesIsLoading(state)).toBe(true);
    expect(selectPopularRecipesError(state)).toBe("Popular failed");
  });

  it("selects the current recipe request status", () => {
    expect(selectCurrentRecipeIsLoading(state)).toBe(true);
    expect(selectCurrentRecipeError(state)).toBe("Current failed");
  });

  it("selects public recipes pagination", () => {
    expect(selectRecipesPagination(state)).toEqual({ page: 2, limit: 6, total: 7, totalPages: 2 });
  });

  it("selects the user's recipes pagination", () => {
    expect(selectOwnRecipesPagination(state)).toEqual({
      page: 1,
      limit: 12,
      total: 1,
      totalPages: 1,
    });
  });
});
