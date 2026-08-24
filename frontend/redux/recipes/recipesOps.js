import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../src/api/axios.js";
import getErrorMessage from "../getErrorMessage.js";

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== null && value !== undefined && value !== "",
    ),
  );

export const fetchRecipes = createAsyncThunk("recipes/fetchAll", async (params, thunkAPI) => {
  try {
    const { data } = await api.get("/recipes", { params: cleanParams(params) });

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchPopularRecipes = createAsyncThunk(
  "recipes/fetchPopular",
  async (limit, thunkAPI) => {
    try {
      const { data } = await api.get("/recipes/popular", { params: cleanParams({ limit }) });

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchRecipeById = createAsyncThunk("recipes/fetchById", async (id, thunkAPI) => {
  try {
    const { data } = await api.get(`/recipes/${id}`);

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchOwnRecipes = createAsyncThunk("recipes/fetchOwn", async (params, thunkAPI) => {
  try {
    const { data } = await api.get("/recipes/own", { params: cleanParams(params) });

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const deleteRecipe = createAsyncThunk("recipes/delete", async (id, thunkAPI) => {
  try {
    await api.delete(`/recipes/${id}`);

    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const addRecipe = createAsyncThunk("recipes/addRecipe", async (formData, thunkAPI) => {
  try {
    const response = await api.post("/recipes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});
