import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { uploadMiddleware } from "../middlewares/upload.js";
import { recipesController } from "../controllers/recipes.controller.js";
import { validate } from "../middlewares/validate.js";
import { createRecipeSchema } from "../validationSchemas/recipe.schema.js";

const router = Router();

// Static sub-paths must be registered before the "/:id" route.

/**
 * @openapi
 * /recipes/popular:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Get popular recipes
 *     description: Returns recipes ordered by the number of users who added each recipe to favorites.
 *     parameters:
 *       - $ref: '#/components/parameters/PopularLimit'
 *     responses:
 *       200:
 *         description: Popular recipes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PopularRecipe'
 */
router.get("/popular", (req, res) => recipesController.popular(req, res));

/**
 * @openapi
 * /recipes/own:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Get current user's recipes
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Paginated recipes created by the current user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedRecipes'
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/own", authMiddleware.authenticate, (req, res) => recipesController.own(req, res));

/**
 * @openapi
 * /recipes/favorites:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Get current user's favorite recipes
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Paginated favorite recipes.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedRecipes'
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/favorites", authMiddleware.authenticate, (req, res) =>
  recipesController.favorites(req, res),
);

/**
 * @openapi
 * /recipes/{id}:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Get recipe by ID
 *     parameters:
 *       - $ref: '#/components/parameters/RecipeId'
 *     responses:
 *       200:
 *         description: Detailed recipe information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeDetail'
 *       404:
 *         description: Recipe not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", (req, res) => recipesController.getById(req, res));

/**
 * @openapi
 * /recipes:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Search recipes
 *     description: Returns recipes filtered by category, ingredient, and area with pagination.
 *     parameters:
 *       - name: category
 *         in: query
 *         description: Category ID.
 *         schema:
 *           type: string
 *       - name: ingredient
 *         in: query
 *         description: Ingredient ID.
 *         schema:
 *           type: string
 *       - name: area
 *         in: query
 *         description: Area ID.
 *         schema:
 *           type: string
 *       - name: userId
 *         in: query
 *         description: Filter recipes by owner (user) ID.
 *         schema:
 *           type: string
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Paginated recipe search results.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedRecipes'
 *   post:
 *     tags:
 *       - Recipes
 *     summary: Create a recipe
 *     description: Creates a recipe, optionally uploading a cover image.
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateRecipe'
 *     responses:
 *       201:
 *         description: Recipe created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreatedRecipe'
 *       400:
 *         description: Invalid recipe data or unsupported image file type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", (req, res) => recipesController.search(req, res));

router.post(
  "/",
  authMiddleware.authenticate,
  uploadMiddleware.single("image"),
  validate(createRecipeSchema),
  (req, res) => recipesController.create(req, res),
);

/**
 * @openapi
 * /recipes/{id}:
 *   delete:
 *     tags:
 *       - Recipes
 *     summary: Delete own recipe
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RecipeId'
 *     responses:
 *       204:
 *         description: Recipe deleted successfully.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Recipe belongs to another user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recipe not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", authMiddleware.authenticate, (req, res) =>
  recipesController.deleteOwn(req, res),
);

/**
 * @openapi
 * /recipes/{id}/favorite:
 *   post:
 *     tags:
 *       - Recipes
 *     summary: Add recipe to favorites
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RecipeId'
 *     responses:
 *       204:
 *         description: Recipe added to favorites.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recipe not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags:
 *       - Recipes
 *     summary: Remove recipe from favorites
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RecipeId'
 *     responses:
 *       204:
 *         description: Recipe removed from favorites.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:id/favorite", authMiddleware.authenticate, (req, res) =>
  recipesController.addFavorite(req, res),
);

router.delete("/:id/favorite", authMiddleware.authenticate, (req, res) =>
  recipesController.removeFavorite(req, res),
);

export default router;
