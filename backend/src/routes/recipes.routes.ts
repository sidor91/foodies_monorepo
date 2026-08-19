import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { recipesController } from "../controllers/recipes.controller.js";

const router = Router();

// Static sub-paths must be registered before the "/:id" route.
router.get("/popular", (req, res) => recipesController.popular(req, res));
router.get("/own", authMiddleware.authenticate, (req, res) => recipesController.own(req, res));
router.get("/favorites", authMiddleware.authenticate, (req, res) =>
  recipesController.favorites(req, res),
);
router.get("/:id", (req, res) => recipesController.getById(req, res));
router.get("/", (req, res) => recipesController.search(req, res));

router.post("/", authMiddleware.authenticate, (req, res) => recipesController.create(req, res));
router.delete("/:id", authMiddleware.authenticate, (req, res) =>
  recipesController.deleteOwn(req, res),
);

router.post("/:id/favorite", authMiddleware.authenticate, (req, res) =>
  recipesController.addFavorite(req, res),
);
router.delete("/:id/favorite", authMiddleware.authenticate, (req, res) =>
  recipesController.removeFavorite(req, res),
);

export default router;
