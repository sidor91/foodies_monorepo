import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { areaController } from "../controllers/area.controller.js";
import { ingredientController } from "../controllers/ingredient.controller.js";
import { testimonialController } from "../controllers/testimonial.controller.js";

export const categoriesRouter = Router().get("/", (req, res) =>
  categoryController.getAll(req, res),
);
export const areasRouter = Router().get("/", (req, res) => areaController.getAll(req, res));
export const ingredientsRouter = Router().get("/", (req, res) =>
  ingredientController.getAll(req, res),
);
export const testimonialsRouter = Router().get("/", (req, res) =>
  testimonialController.getAll(req, res),
);
