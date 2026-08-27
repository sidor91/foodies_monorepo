import { describe, expect, it } from "vitest";

import {
  selectArea,
  selectCategory,
  selectIngredient,
  selectPage,
  selectSearchParams,
} from "./filtersSelectors.js";

const state = {
  filters: {
    category: "Beef",
    area: "British",
    ingredient: "Potato",
    page: 2,
  },
};

describe("filtersSelectors", () => {
  it("selects the category", () => {
    expect(selectCategory(state)).toBe("Beef");
  });

  it("selects the area", () => {
    expect(selectArea(state)).toBe("British");
  });

  it("selects the ingredient", () => {
    expect(selectIngredient(state)).toBe("Potato");
  });

  it("selects the page", () => {
    expect(selectPage(state)).toBe(2);
  });

  it("combines the filters into search parameters", () => {
    expect(selectSearchParams(state)).toEqual({
      category: "Beef",
      area: "British",
      ingredient: "Potato",
      page: 2,
    });
  });
});
