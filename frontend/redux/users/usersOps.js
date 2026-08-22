import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../src/api/axios.js";
import getErrorMessage from "../getErrorMessage.js";

export const fetchUserById = createAsyncThunk("users/fetchById", async (id, thunkAPI) => {
  try {
    const { data } = await api.get(`/users/${id}`);

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchFollowers = createAsyncThunk(
  "users/fetchFollowers",
  async ({ userId, page, limit } = {}, thunkAPI) => {
    try {
      const { data } = await api.get(`/users/${userId}/followers`, { params: { page, limit } });

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchFollowing = createAsyncThunk(
  "users/fetchFollowing",
  async ({ page, limit } = {}, thunkAPI) => {
    try {
      const { data } = await api.get("/users/following", { params: { page, limit } });

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const followUser = createAsyncThunk("users/follow", async (id, thunkAPI) => {
  try {
    await api.post(`/users/${id}/follow`);

    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const unfollowUser = createAsyncThunk("users/unfollow", async (id, thunkAPI) => {
  try {
    await api.delete(`/users/${id}/follow`);

    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});
