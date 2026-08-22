import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../src/api/axios.js";
import getErrorMessage from "../getErrorMessage.js";

export const fetchFavorites = createAsyncThunk("favorites/fetchAll", async (params, thunkAPI) => {
  try {
    const { data } = await api.get("/recipes/favorites", { params });

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const addFavorite = createAsyncThunk("favorites/add", async (id, thunkAPI) => {
  try {
    await api.post(`/recipes/${id}/favorite`);

    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const removeFavorite = createAsyncThunk("favorites/remove", async (id, thunkAPI) => {
  try {
    await api.delete(`/recipes/${id}/favorite`);

    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});
