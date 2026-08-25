import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../src/api/axios.js";
import getErrorMessage from "../getErrorMessage.js";

const shouldFetch = (state, key) =>
  state.references[key].length === 0 && !state.references.pending.includes(key);

export const fetchCategories = createAsyncThunk(
  "references/categories",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/categories");

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
  { condition: (_, { getState }) => shouldFetch(getState(), "categories") },
);

export const fetchAreas = createAsyncThunk(
  "references/areas",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/areas");

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
  { condition: (_, { getState }) => shouldFetch(getState(), "areas") },
);

export const fetchIngredients = createAsyncThunk(
  "references/ingredients",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/ingredients");

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
  { condition: (_, { getState }) => shouldFetch(getState(), "ingredients") },
);

export const fetchTestimonials = createAsyncThunk(
  "references/testimonials",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/testimonials");

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
  { condition: (_, { getState }) => shouldFetch(getState(), "testimonials") },
);
