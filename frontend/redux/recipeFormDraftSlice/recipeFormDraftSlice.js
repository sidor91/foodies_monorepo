import { createSlice } from "@reduxjs/toolkit";

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

const recipeFormDraftSlice = createSlice({
  name: "recipeDraft",
  initialState,
  reducers: {
    // updating the draft with the new values from the form
    updateDraft(state, action) {
      return {
        ...state,
        ...action.payload,
        ...(action.payload.ingredients && {
          ingredients: action.payload.ingredients.map((obj) => ({ ...obj })),
        }),
      };
    },
    // clearing the draft when the user submits the form or cancels
    clearDraft() {
      return initialState;
    },
  },
});

export const { updateDraft, clearDraft } = recipeFormDraftSlice.actions;
export default recipeFormDraftSlice.reducer;

//selector to get the draft from the state
export const selectRecipeDraft = (state) => state.recipeDraft;
