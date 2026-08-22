import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../src/api/axios.js";
import getErrorMessage from "../getErrorMessage.js";

export const fetchCategories = createAsyncThunk("references/categories", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/categories");

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAreas = createAsyncThunk("references/areas", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/areas");

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchIngredients = createAsyncThunk("references/ingredients", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/ingredients");

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

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
);
