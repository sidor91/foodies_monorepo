import { Router, type Request, type Response, type NextFunction } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { recipesController } from "../controllers/recipes.controller.js";

const router = Router();

// Utility helper — not domain logic, kept as a plain function.
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
    return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

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
