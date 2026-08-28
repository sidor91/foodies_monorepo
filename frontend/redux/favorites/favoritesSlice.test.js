import { describe, expect, it } from "vitest";

import { logOut } from "../auth/authOps.js";
import { addFavorite, fetchFavorites, removeFavorite } from "./favoritesOps.js";
import favoritesReducer from "./favoritesSlice.js";

const createInitialState = () => ({
  items: [],
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
  ids: [],
  pendingIds: [],
  isLoading: false,
  error: null,
});

describe("favoritesSlice", () => {
  it("returns the initial state", () => {
    expect(favoritesReducer(undefined, { type: "unknown" })).toEqual(createInitialState());
  });

  it("marks the favorites request as pending", () => {
    const state = { ...createInitialState(), error: "Old error" };

    const nextState = favoritesReducer(state, fetchFavorites.pending("request-1", {}));

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it("stores favorite recipes and their IDs", () => {
    const payload = {
      items: [{ id: "recipe-1" }, { id: "recipe-2" }],
      page: 2,
      limit: 6,
      total: 8,
      totalPages: 2,
    };

    const nextState = favoritesReducer(
      { ...createInitialState(), isLoading: true },
      fetchFavorites.fulfilled(payload, "request-1", {}),
    );

    expect(nextState.items).toEqual(payload.items);
    expect(nextState.ids).toEqual(["recipe-1", "recipe-2"]);
    expect(nextState.page).toBe(2);
    expect(nextState.total).toBe(8);
    expect(nextState.isLoading).toBe(false);
  });

  it("stores a rejected favorites request error", () => {
    const action = fetchFavorites.rejected(
      new Error("Request failed"),
      "request-1",
      {},
      "Request failed",
    );

    const nextState = favoritesReducer({ ...createInitialState(), isLoading: true }, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe("Request failed");
  });

  it("adds a favorite ID only once", () => {
    const state = { ...createInitialState(), ids: ["recipe-1"] };

    const nextState = favoritesReducer(
      state,
      addFavorite.fulfilled("recipe-1", "request-1", "recipe-1"),
    );

    expect(nextState.ids).toEqual(["recipe-1"]);
  });

  it("removes a favorite and recalculates pagination", () => {
    const state = {
      ...createInitialState(),
      items: [{ id: "recipe-1" }, { id: "recipe-2" }, { id: "recipe-3" }],
      ids: ["recipe-1", "recipe-2", "recipe-3"],
      limit: 2,
      total: 3,
      totalPages: 2,
    };

    const nextState = favoritesReducer(
      state,
      removeFavorite.fulfilled("recipe-1", "request-1", "recipe-1"),
    );

    expect(nextState.ids).toEqual(["recipe-2", "recipe-3"]);
    expect(nextState.items).toEqual([{ id: "recipe-2" }, { id: "recipe-3" }]);
    expect(nextState.total).toBe(2);
    expect(nextState.totalPages).toBe(1);
  });

  it("tracks a favorite request while it is pending", () => {
    const nextState = favoritesReducer(
      createInitialState(),
      addFavorite.pending("request-1", "recipe-1"),
    );

    expect(nextState.pendingIds).toEqual(["recipe-1"]);
  });

  it("removes a finished favorite request from pending IDs", () => {
    const state = { ...createInitialState(), pendingIds: ["recipe-1"] };

    const nextState = favoritesReducer(
      state,
      addFavorite.fulfilled("recipe-1", "request-1", "recipe-1"),
    );

    expect(nextState.pendingIds).toEqual([]);
  });

  it("stores an error and removes a rejected favorite request from pending IDs", () => {
    const state = { ...createInitialState(), pendingIds: ["recipe-1"] };
    const action = removeFavorite.rejected(
      new Error("Request failed"),
      "request-1",
      "recipe-1",
      "Request failed",
    );

    const nextState = favoritesReducer(state, action);

    expect(nextState.pendingIds).toEqual([]);
    expect(nextState.error).toBe("Request failed");
  });

  it("resets favorites after logout", () => {
    const state = { ...createInitialState(), ids: ["recipe-1"], total: 1 };

    expect(favoritesReducer(state, logOut.fulfilled(undefined, "request-1"))).toEqual(
      createInitialState(),
    );
  });
});
