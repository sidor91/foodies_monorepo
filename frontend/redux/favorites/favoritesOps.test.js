import { beforeEach, describe, expect, it, vi } from "vitest";

import api from "../../src/api/axios.js";
import { addFavorite, fetchFavorites, removeFavorite } from "./favoritesOps.js";

vi.mock("../../src/api/axios.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const runThunk = (thunk) => thunk(vi.fn(), () => ({}), undefined);
const apiError = { response: { data: { message: "Request failed" } } };

describe("favoritesOps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches favorite recipes with pagination parameters", async () => {
    const payload = { items: [{ id: "recipe-1" }] };
    const params = { page: 2, limit: 6 };
    api.get.mockResolvedValueOnce({ data: payload });

    const result = await runThunk(fetchFavorites(params));

    expect(api.get).toHaveBeenCalledWith("/recipes/favorites", { params });
    expect(result.type).toBe(fetchFavorites.fulfilled.type);
    expect(result.payload).toEqual(payload);
  });

  it("returns a rejected value when fetching favorites fails", async () => {
    api.get.mockRejectedValueOnce(apiError);

    const result = await runThunk(fetchFavorites({}));

    expect(result.type).toBe(fetchFavorites.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("adds a recipe to favorites and returns its ID", async () => {
    api.post.mockResolvedValueOnce({});

    const result = await runThunk(addFavorite("recipe-1"));

    expect(api.post).toHaveBeenCalledWith("/recipes/recipe-1/favorite");
    expect(result.type).toBe(addFavorite.fulfilled.type);
    expect(result.payload).toBe("recipe-1");
  });

  it("returns a rejected value when adding a favorite fails", async () => {
    api.post.mockRejectedValueOnce(apiError);

    const result = await runThunk(addFavorite("recipe-1"));

    expect(result.type).toBe(addFavorite.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("removes a recipe from favorites and returns its ID", async () => {
    api.delete.mockResolvedValueOnce({});

    const result = await runThunk(removeFavorite("recipe-1"));

    expect(api.delete).toHaveBeenCalledWith("/recipes/recipe-1/favorite");
    expect(result.type).toBe(removeFavorite.fulfilled.type);
    expect(result.payload).toBe("recipe-1");
  });

  it("returns a rejected value when removing a favorite fails", async () => {
    api.delete.mockRejectedValueOnce(apiError);

    const result = await runThunk(removeFavorite("recipe-1"));

    expect(result.type).toBe(removeFavorite.rejected.type);
    expect(result.payload).toBe("Request failed");
  });
});
