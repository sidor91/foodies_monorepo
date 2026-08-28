import { beforeEach, describe, expect, it, vi } from "vitest";

import api from "../../src/api/axios.js";
import {
  fetchAreas,
  fetchCategories,
  fetchIngredients,
  fetchTestimonials,
} from "./referencesOps.js";

vi.mock("../../src/api/axios.js", () => ({
  default: {
    get: vi.fn(),
  },
}));

const createReferencesState = () => ({
  references: {
    categories: [],
    areas: [],
    ingredients: [],
    testimonials: [],
    pending: [],
  },
});

const runThunk = (thunk, state = createReferencesState()) => thunk(vi.fn(), () => state, undefined);

const apiError = { response: { data: { message: "Request failed" } } };

describe("referencesOps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches categories", async () => {
    const categories = [{ id: "category-1" }];
    api.get.mockResolvedValueOnce({ data: categories });

    const result = await runThunk(fetchCategories());

    expect(api.get).toHaveBeenCalledWith("/categories");
    expect(result.type).toBe(fetchCategories.fulfilled.type);
    expect(result.payload).toEqual(categories);
  });

  it("returns a rejected value when fetching categories fails", async () => {
    api.get.mockRejectedValueOnce(apiError);

    const result = await runThunk(fetchCategories());

    expect(result.type).toBe(fetchCategories.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("fetches areas", async () => {
    const areas = [{ id: "area-1" }];
    api.get.mockResolvedValueOnce({ data: areas });

    const result = await runThunk(fetchAreas());

    expect(api.get).toHaveBeenCalledWith("/areas");
    expect(result.type).toBe(fetchAreas.fulfilled.type);
    expect(result.payload).toEqual(areas);
  });

  it("returns a rejected value when fetching areas fails", async () => {
    api.get.mockRejectedValueOnce(apiError);

    const result = await runThunk(fetchAreas());

    expect(result.type).toBe(fetchAreas.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("fetches ingredients", async () => {
    const ingredients = [{ id: "ingredient-1" }];
    api.get.mockResolvedValueOnce({ data: ingredients });

    const result = await runThunk(fetchIngredients());

    expect(api.get).toHaveBeenCalledWith("/ingredients");
    expect(result.type).toBe(fetchIngredients.fulfilled.type);
    expect(result.payload).toEqual(ingredients);
  });

  it("returns a rejected value when fetching ingredients fails", async () => {
    api.get.mockRejectedValueOnce(apiError);

    const result = await runThunk(fetchIngredients());

    expect(result.type).toBe(fetchIngredients.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("fetches testimonials", async () => {
    const testimonials = [{ id: "testimonial-1" }];
    api.get.mockResolvedValueOnce({ data: testimonials });

    const result = await runThunk(fetchTestimonials());

    expect(api.get).toHaveBeenCalledWith("/testimonials");
    expect(result.type).toBe(fetchTestimonials.fulfilled.type);
    expect(result.payload).toEqual(testimonials);
  });

  it("returns a rejected value when fetching testimonials fails", async () => {
    api.get.mockRejectedValueOnce(apiError);

    const result = await runThunk(fetchTestimonials());

    expect(result.type).toBe(fetchTestimonials.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("does not fetch a reference list that is already loaded", async () => {
    const state = createReferencesState();
    state.references.categories = [{ id: "category-1" }];

    const result = await runThunk(fetchCategories(), state);

    expect(api.get).not.toHaveBeenCalled();
    expect(result.type).toBe(fetchCategories.rejected.type);
    expect(result.meta.condition).toBe(true);
  });

  it("does not duplicate a pending reference request", async () => {
    const state = createReferencesState();
    state.references.pending = ["categories"];

    const result = await runThunk(fetchCategories(), state);

    expect(api.get).not.toHaveBeenCalled();
    expect(result.meta.condition).toBe(true);
  });
});
