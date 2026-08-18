import { Router, type Request, type Response, type NextFunction } from "express";
import { referencesController } from "../controllers/references.controller.js";

// Utility helper — not domain logic, kept as a plain function.
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
    return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

export const categoriesRouter = Router().get("/", asyncHandler(referencesController.getCategories));
export const areasRouter = Router().get("/", asyncHandler(referencesController.getAreas));
export const ingredientsRouter = Router().get(
    "/",
    asyncHandler(referencesController.getIngredients),
);
export const testimonialsRouter = Router().get(
    "/",
    asyncHandler(referencesController.getTestimonials),
);
