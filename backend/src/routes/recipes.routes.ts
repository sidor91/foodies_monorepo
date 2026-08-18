import { Router, type Request, type Response, type NextFunction } from "express";
import { authenticate } from "../middlewares/auth.js";
import * as recipesController from "../controllers/recipes.controller.js";

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
    return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

// Static sub-paths must be registered before the "/:id" route.
router.get("/popular", asyncHandler(recipesController.getPopularRecipes));
router.get("/own", authenticate, asyncHandler(recipesController.getOwnRecipes));
router.get("/favorites", authenticate, asyncHandler(recipesController.getFavoriteRecipes));
router.get("/:id", asyncHandler(recipesController.getRecipeById));
router.get("/", asyncHandler(recipesController.searchRecipes));

router.post("/", authenticate, asyncHandler(recipesController.createRecipe));
router.delete("/:id", authenticate, asyncHandler(recipesController.deleteOwnRecipe));

router.post("/:id/favorite", authenticate, asyncHandler(recipesController.addFavorite));
router.delete("/:id/favorite", authenticate, asyncHandler(recipesController.removeFavorite));

export default router;
