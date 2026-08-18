import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { recipesController } from "../controllers/recipes.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// Static sub-paths must be registered before the "/:id" route.
router.get("/popular", asyncHandler(recipesController.popular));
router.get("/own", authMiddleware.authenticate, asyncHandler(recipesController.own));
router.get("/favorites", authMiddleware.authenticate, asyncHandler(recipesController.favorites));
router.get("/:id", asyncHandler(recipesController.getById));
router.get("/", asyncHandler(recipesController.search));

router.post("/", authMiddleware.authenticate, asyncHandler(recipesController.create));
router.delete("/:id", authMiddleware.authenticate, asyncHandler(recipesController.deleteOwn));

router.post(
    "/:id/favorite",
    authMiddleware.authenticate,
    asyncHandler(recipesController.addFavorite),
);
router.delete(
    "/:id/favorite",
    authMiddleware.authenticate,
    asyncHandler(recipesController.removeFavorite),
);

export default router;
