import { describe, expect, it } from "vitest";

import recipeDraftReducer, {
  clearDraft,
  selectRecipeDraft,
  updateDraft,
} from "./recipeFormDraftSlice.js";

const initialState = {
  title: "",
  description: "",
  category: "",
  time: 10,
  area: "",
  ingredients: [],
  instructions: "",
  selectedIngredientId: "",
  ingredientQuantity: "",
};

describe("recipeFormDraftSlice", () => {
  it("returns the initial state", () => {
    expect(recipeDraftReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("updates only the provided draft fields", () => {
    const nextState = recipeDraftReducer(
      initialState,
      updateDraft({ title: "Vegetable Soup", time: 45 }),
    );

    expect(nextState.title).toBe("Vegetable Soup");
    expect(nextState.time).toBe(45);
    expect(nextState.description).toBe("");
  });

  it("copies the ingredients instead of keeping their references", () => {
    const ingredients = [{ ingredientId: "ingredient-1", quantity: "200 g" }];

    const nextState = recipeDraftReducer(initialState, updateDraft({ ingredients }));

    expect(nextState.ingredients).toEqual(ingredients);
    expect(nextState.ingredients).not.toBe(ingredients);
    expect(nextState.ingredients[0]).not.toBe(ingredients[0]);
  });

  it("clears the saved draft", () => {
    const state = { ...initialState, title: "Saved recipe", time: 30 };

    expect(recipeDraftReducer(state, clearDraft())).toEqual(initialState);
  });

  it("selects the recipe draft", () => {
    const state = { recipeDraft: { ...initialState, title: "Saved recipe" } };

    expect(selectRecipeDraft(state)).toBe(state.recipeDraft);
  });
});
