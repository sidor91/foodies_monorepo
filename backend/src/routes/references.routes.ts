import { Router, type Request, type Response, type NextFunction } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { areaController } from "../controllers/area.controller.js";
import { ingredientController } from "../controllers/ingredient.controller.js";
import { testimonialController } from "../controllers/testimonial.controller.js";

// Utility helper — not domain logic, kept as a plain function.
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
    return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

export const categoriesRouter = Router().get("/", asyncHandler(categoryController.getAll));
export const areasRouter = Router().get("/", asyncHandler(areaController.getAll));
export const ingredientsRouter = Router().get("/", asyncHandler(ingredientController.getAll));
export const testimonialsRouter = Router().get("/", asyncHandler(testimonialController.getAll));
