import { describe, expect, it } from "vitest";

import {
  selectAreas,
  selectCategories,
  selectIngredients,
  selectReferencesError,
  selectReferencesIsLoading,
  selectTestimonials,
} from "./referencesSelectors.js";

const state = {
  references: {
    categories: [{ id: "category-1" }],
    areas: [{ id: "area-1" }],
    ingredients: [{ id: "ingredient-1" }],
    testimonials: [{ id: "testimonial-1" }],
    isLoading: true,
    error: "Request failed",
  },
};

describe("referencesSelectors", () => {
  it("selects every reference list", () => {
    expect(selectCategories(state)).toEqual([{ id: "category-1" }]);
    expect(selectAreas(state)).toEqual([{ id: "area-1" }]);
    expect(selectIngredients(state)).toEqual([{ id: "ingredient-1" }]);
    expect(selectTestimonials(state)).toEqual([{ id: "testimonial-1" }]);
  });

  it("selects the request status", () => {
    expect(selectReferencesIsLoading(state)).toBe(true);
    expect(selectReferencesError(state)).toBe("Request failed");
  });
});
