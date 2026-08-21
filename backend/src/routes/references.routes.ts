import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { areaController } from "../controllers/area.controller.js";
import { ingredientController } from "../controllers/ingredient.controller.js";
import { testimonialController } from "../controllers/testimonial.controller.js";

/**
 * @openapi
 * /categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get recipe categories
 *     responses:
 *       200:
 *         description: List of recipe categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
export const categoriesRouter = Router().get("/", (req, res) =>
  categoryController.getAll(req, res),
);

/**
 * @openapi
 * /areas:
 *   get:
 *     tags:
 *       - Areas
 *     summary: Get dish origin areas
 *     responses:
 *       200:
 *         description: List of dish origin areas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Area'
 */
export const areasRouter = Router().get("/", (req, res) => areaController.getAll(req, res));

/**
 * @openapi
 * /ingredients:
 *   get:
 *     tags:
 *       - Ingredients
 *     summary: Get ingredients
 *     responses:
 *       200:
 *         description: List of ingredients.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingredient'
 */
export const ingredientsRouter = Router().get("/", (req, res) =>
  ingredientController.getAll(req, res),
);

/**
 * @openapi
 * /testimonials:
 *   get:
 *     tags:
 *       - Testimonials
 *     summary: Get testimonials
 *     responses:
 *       200:
 *         description: List of testimonials.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Testimonial'
 */
export const testimonialsRouter = Router().get("/", (req, res) =>
  testimonialController.getAll(req, res),
);
