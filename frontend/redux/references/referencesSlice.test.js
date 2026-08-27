import { describe, expect, it } from "vitest";

import {
  fetchAreas,
  fetchCategories,
  fetchIngredients,
  fetchTestimonials,
} from "./referencesOps.js";
import referencesReducer from "./referencesSlice.js";

const createInitialState = () => ({
  categories: [],
  areas: [],
  ingredients: [],
  testimonials: [],
  pending: [],
  isLoading: false,
  error: null,
});

describe("referencesSlice", () => {
  it("returns the initial state", () => {
    expect(referencesReducer(undefined, { type: "unknown" })).toEqual(createInitialState());
  });

  it("stores every reference list", () => {
    let state = createInitialState();

    state = referencesReducer(state, fetchCategories.fulfilled([{ id: "category-1" }], "1"));
    state = referencesReducer(state, fetchAreas.fulfilled([{ id: "area-1" }], "2"));
    state = referencesReducer(state, fetchIngredients.fulfilled([{ id: "ingredient-1" }], "3"));
    state = referencesReducer(state, fetchTestimonials.fulfilled([{ id: "testimonial-1" }], "4"));

    expect(state.categories).toEqual([{ id: "category-1" }]);
    expect(state.areas).toEqual([{ id: "area-1" }]);
    expect(state.ingredients).toEqual([{ id: "ingredient-1" }]);
    expect(state.testimonials).toEqual([{ id: "testimonial-1" }]);
  });

  it("keeps loading active while another reference request is pending", () => {
    let state = createInitialState();
    state = referencesReducer(state, fetchCategories.pending("request-1"));
    state = referencesReducer(state, fetchAreas.pending("request-2"));

    state = referencesReducer(
      state,
      fetchCategories.fulfilled([{ id: "category-1" }], "request-1"),
    );

    expect(state.pending).toEqual(["areas"]);
    expect(state.isLoading).toBe(true);
  });

  it("finishes loading after all reference requests complete", () => {
    const state = { ...createInitialState(), pending: ["areas"], isLoading: true };

    const nextState = referencesReducer(
      state,
      fetchAreas.fulfilled([{ id: "area-1" }], "request-1"),
    );

    expect(nextState.pending).toEqual([]);
    expect(nextState.isLoading).toBe(false);
  });

  it("stores an error and removes the rejected request from pending", () => {
    const state = { ...createInitialState(), pending: ["ingredients"], isLoading: true };
    const action = fetchIngredients.rejected(
      new Error("Request failed"),
      "request-1",
      undefined,
      "Request failed",
    );

    const nextState = referencesReducer(state, action);

    expect(nextState.error).toBe("Request failed");
    expect(nextState.pending).toEqual([]);
    expect(nextState.isLoading).toBe(false);
  });
});
