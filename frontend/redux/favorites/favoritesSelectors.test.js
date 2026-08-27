import { describe, expect, it } from "vitest";

import {
  selectFavoriteIds,
  selectFavorites,
  selectFavoritesError,
  selectFavoritesIsLoading,
  selectFavoritesPagination,
  selectIsFavorite,
  selectIsFavoritePending,
} from "./favoritesSelectors.js";

const state = {
  favorites: {
    items: [{ id: "recipe-1" }],
    ids: ["recipe-1"],
    pendingIds: ["recipe-2"],
    page: 2,
    limit: 6,
    total: 7,
    totalPages: 2,
    isLoading: true,
    error: "Request failed",
  },
};

describe("favoritesSelectors", () => {
  it("selects favorite recipes and IDs", () => {
    expect(selectFavorites(state)).toEqual([{ id: "recipe-1" }]);
    expect(selectFavoriteIds(state)).toEqual(["recipe-1"]);
  });

  it("selects the request status", () => {
    expect(selectFavoritesIsLoading(state)).toBe(true);
    expect(selectFavoritesError(state)).toBe("Request failed");
  });

  it("selects favorites pagination", () => {
    expect(selectFavoritesPagination(state)).toEqual({ page: 2, limit: 6, total: 7, totalPages: 2 });
  });

  it("checks whether a recipe is a favorite", () => {
    expect(selectIsFavorite("recipe-1")(state)).toBe(true);
    expect(selectIsFavorite("recipe-2")(state)).toBe(false);
  });

  it("checks whether a favorite request is pending", () => {
    expect(selectIsFavoritePending("recipe-2")(state)).toBe(true);
    expect(selectIsFavoritePending("recipe-1")(state)).toBe(false);
  });
});
