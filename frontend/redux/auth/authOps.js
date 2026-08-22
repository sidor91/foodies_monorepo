import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../src/api/axios.js";
import getErrorMessage from "../getErrorMessage.js";

export const register = createAsyncThunk("auth/register", async (credentials, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/register", credentials);

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const logIn = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/login", credentials);

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const refreshUser = createAsyncThunk("auth/refresh", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/users/me");

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateAvatar = createAsyncThunk("auth/updateAvatar", async (file, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const { data } = await api.patch("/users/me/avatar", formData);

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});
