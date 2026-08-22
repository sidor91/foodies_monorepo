import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.BACKEND_URL || "http://localhost:4000";

export const fetchRecipeMetadata = createAsyncThunk(
  "recipes/fetchRecipeMetadata",
  async (_, thunkAPI) => {
    try {
      const [categoriesRes, areasRes, ingredientsRes] = await Promise.all([
        axios.get("/api/categories"),
        axios.get("/api/areas"),
        axios.get("/api/ingredients"),
      ]);
      console.log("Fetched metadata:", {
        categories: categoriesRes.data,
        areas: areasRes.data,
        ingredientsList: ingredientsRes.data,
      });

      return {
        categories: categoriesRes.data,
        areas: areasRes.data,
        ingredientsList: ingredientsRes.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addRecipe = createAsyncThunk("recipes/addRecipe", async (formData, thunkAPI) => {
  console.log("addRecipe called with formData:", formData);
  try {
    const response = await axios.post("/api/recipes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
