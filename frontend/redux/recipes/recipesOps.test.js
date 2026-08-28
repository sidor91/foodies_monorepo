import { beforeEach, describe, expect, it, vi } from "vitest";

import api from "../../src/api/axios.js";
import {
  addRecipe,
  deleteRecipe,
  fetchOwnRecipes,
  fetchPopularRecipes,
  fetchRecipeById,
  fetchRecipes,
} from "./recipesOps.js";

vi.mock("../../src/api/axios.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const runThunk = (thunk) => thunk(vi.fn(), () => ({}), undefined);
const apiError = { response: { data: { message: "Request failed" } } };

describe("recipesOps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches recipes and removes empty query parameters", async () => {
    const payload = { items: [{ id: "recipe-1" }] };
    api.get.mockResolvedValueOnce({ data: payload });
    const params = {
      category: "Beef",
      area: "",
      ingredient: null,
      search: undefined,
      page: 0,
    };

    const result = await runThunk(fetchRecipes(params));

    expect(api.get).toHaveBeenCalledWith("/recipes", {
      params: { category: "Beef", page: 0 },
    });
    expect(result.type).toBe(fetchRecipes.fulfilled.type);
    expect(result.payload).toEqual(payload);
  });

  it("returns a rejected value when fetching recipes fails", async () => {
    api.get.mockRejectedValueOnce(apiError);

    const result = await runThunk(fetchRecipes({}));

    expect(result.type).toBe(fetchRecipes.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("fetches popular recipes with a limit", async () => {
    const payload = [{ id: "recipe-1" }];
    api.get.mockResolvedValueOnce({ data: payload });

    const result = await runThunk(fetchPopularRecipes(5));

    expect(api.get).toHaveBeenCalledWith("/recipes/popular", { params: { limit: 5 } });
    expect(result.type).toBe(fetchPopularRecipes.fulfilled.type);
    expect(result.payload).toEqual(payload);
  });

  it("returns a rejected value when fetching popular recipes fails", async () => {
    api.get.mockRejectedValueOnce(apiError);

    const result = await runThunk(fetchPopularRecipes(5));

    expect(result.type).toBe(fetchPopularRecipes.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("fetches a recipe by ID", async () => {
    const recipe = { id: "recipe-1" };
    api.get.mockResolvedValueOnce({ data: recipe });

    const result = await runThunk(fetchRecipeById("recipe-1"));

    expect(api.get).toHaveBeenCalledWith("/recipes/recipe-1");
    expect(result.type).toBe(fetchRecipeById.fulfilled.type);
    expect(result.payload).toEqual(recipe);
  });

  it("returns a rejected value when fetching a recipe by ID fails", async () => {
    api.get.mockRejectedValueOnce(apiError);

    const result = await runThunk(fetchRecipeById("recipe-1"));

    expect(result.type).toBe(fetchRecipeById.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("fetches the current user's recipes", async () => {
    const payload = { items: [{ id: "recipe-1" }] };
    api.get.mockResolvedValueOnce({ data: payload });

    const result = await runThunk(fetchOwnRecipes({ page: 2, category: "" }));

    expect(api.get).toHaveBeenCalledWith("/recipes/own", { params: { page: 2 } });
    expect(result.type).toBe(fetchOwnRecipes.fulfilled.type);
    expect(result.payload).toEqual(payload);
  });

  it("returns a rejected value when fetching the user's recipes fails", async () => {
    api.get.mockRejectedValueOnce(apiError);

    const result = await runThunk(fetchOwnRecipes({}));

    expect(result.type).toBe(fetchOwnRecipes.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("deletes a recipe and returns its ID", async () => {
    api.delete.mockResolvedValueOnce({});

    const result = await runThunk(deleteRecipe("recipe-1"));

    expect(api.delete).toHaveBeenCalledWith("/recipes/recipe-1");
    expect(result.type).toBe(deleteRecipe.fulfilled.type);
    expect(result.payload).toBe("recipe-1");
  });

  it("returns a rejected value when deleting a recipe fails", async () => {
    api.delete.mockRejectedValueOnce(apiError);

    const result = await runThunk(deleteRecipe("recipe-1"));

    expect(result.type).toBe(deleteRecipe.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("adds a recipe as multipart form data", async () => {
    const formData = new FormData();
    formData.append("title", "Soup");
    const recipe = { id: "recipe-1", title: "Soup" };
    api.post.mockResolvedValueOnce({ data: recipe });

    const result = await runThunk(addRecipe(formData));

    expect(api.post).toHaveBeenCalledWith("/recipes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    expect(result.type).toBe(addRecipe.fulfilled.type);
    expect(result.payload).toEqual(recipe);
  });

  it("returns a rejected value when adding a recipe fails", async () => {
    api.post.mockRejectedValueOnce(apiError);

    const result = await runThunk(addRecipe(new FormData()));

    expect(result.type).toBe(addRecipe.rejected.type);
    expect(result.payload).toBe("Request failed");
  });
});
