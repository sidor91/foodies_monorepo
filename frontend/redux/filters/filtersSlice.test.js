import { describe, expect, it } from "vitest";

import filtersReducer, {
  resetFilters,
  setArea,
  setCategory,
  setIngredient,
  setPage,
} from "./filtersSlice.js";

const initialState = {
  category: null,
  area: null,
  ingredient: null,
  page: 1,
};

describe("filtersSlice", () => {
  it("returns the initial state", () => {
    expect(filtersReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("sets the category and resets the page", () => {
    const state = { ...initialState, page: 4 };

    const nextState = filtersReducer(state, setCategory("Beef"));

    expect(nextState.category).toBe("Beef");
    expect(nextState.page).toBe(1);
  });

  it("sets the area and resets the page", () => {
    const state = { ...initialState, page: 3 };

    const nextState = filtersReducer(state, setArea("Italian"));

    expect(nextState.area).toBe("Italian");
    expect(nextState.page).toBe(1);
  });

  it("sets the ingredient and resets the page", () => {
    const state = { ...initialState, page: 2 };

    const nextState = filtersReducer(state, setIngredient("Tomato"));

    expect(nextState.ingredient).toBe("Tomato");
    expect(nextState.page).toBe(1);
  });

  it("sets the current page", () => {
    const nextState = filtersReducer(initialState, setPage(5));

    expect(nextState.page).toBe(5);
  });

  it("resets all filters", () => {
    const state = {
      category: "Beef",
      area: "Italian",
      ingredient: "Tomato",
      page: 3,
    };

    expect(filtersReducer(state, resetFilters())).toEqual(initialState);
  });
});
