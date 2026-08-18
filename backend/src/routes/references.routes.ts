import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { areaController } from "../controllers/area.controller.js";
import { ingredientController } from "../controllers/ingredient.controller.js";
import { testimonialController } from "../controllers/testimonial.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const categoriesRouter = Router().get("/", asyncHandler(categoryController.getAll));
export const areasRouter = Router().get("/", asyncHandler(areaController.getAll));
export const ingredientsRouter = Router().get("/", asyncHandler(ingredientController.getAll));
export const testimonialsRouter = Router().get("/", asyncHandler(testimonialController.getAll));
