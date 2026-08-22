import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  draft: {
    photo: null,
    title: "",
    description: "",
    category: "",
    time: 10,
    area: "",
    ingredients: [],
    instructions: "",
  },
};

const recipeDraftSlice = createSlice({
  name: "recipeDraft",
  initialState,
  reducers: {
    // updating the draft with the new values from the form
    updateDraft(state, action) {
      state.draft = { ...state.draft, ...action.payload };
    },
    // clearing the draft when the user submits the form or cancels
    clearDraft(state) {
      state.draft = initialState.draft;
    },
  },
});

export const { updateDraft, clearDraft } = recipeDraftSlice.actions;
export default recipeDraftSlice.reducer;

//selector to get the draft from the state
export const selectRecipeDraft = (state) => state.recipeDraft.draft;
