import type { Request, Response } from "express";
import { recipeService } from "../services/recipe.service.js";
import { favoriteService } from "../services/favorite.service.js";

// Utility helper — not domain logic, kept as a plain function.
function parsePagination(query: Request["query"]) {
    const page = Math.max(parseInt(String(query.page), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(query.limit), 10) || 12, 1), 50);
    return { page, limit, skip: (page - 1) * limit, take: limit };
}

interface CreateRecipeBody {
    title: string;
    instructions: string;
    description?: string;
    thumb?: string;
    preview?: string;
    time?: number;
    categoryId: string;
    areaId: string;
    ingredients?: { id: string; measure?: string }[];
}

class RecipesController {
    // GET /recipes?category=&ingredient=&area=&page=&limit= — public search with pagination.
    search = async (req: Request, res: Response) => {
        const { page, limit, skip, take } = parsePagination(req.query);

        const { items, total } = await recipeService.search(
            {
                category: req.query.category as string | undefined,
                area: req.query.area as string | undefined,
                ingredient: req.query.ingredient as string | undefined,
            },
            { skip, take },
        );

        res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
    };

    // GET /recipes/popular?limit= — public, ranked by favorites count.
    popular = async (req: Request, res: Response) => {
        const limit = Math.min(Math.max(parseInt(String(req.query.limit), 10) || 10, 1), 50);
        const popular = await recipeService.getPopular(limit);
        res.json(popular);
    };

    // GET /recipes/own?page=&limit= — private, recipes created by the current user.
    own = async (req: Request, res: Response) => {
        const { page, limit, skip, take } = parsePagination(req.query);
        const { items, total } = await recipeService.getOwn(req.user!.id, { skip, take });
        res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
    };

    // GET /recipes/favorites?page=&limit= — private, current user's favorited recipes.
    favorites = async (req: Request, res: Response) => {
        const { page, limit, skip, take } = parsePagination(req.query);
        const { items, total } = await recipeService.getFavorites(req.user!.id, { skip, take });
        res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
    };

    // GET /recipes/:id — public recipe detail.
    getById = async (req: Request, res: Response) => {
        const recipe = await recipeService.getById(req.params.id);

        if (!recipe) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }

        res.json(recipe);
    };

    // POST /recipes — private, create own recipe.
    create = async (req: Request, res: Response) => {
        const {
            title,
            instructions,
            description,
            thumb,
            preview,
            time,
            categoryId,
            areaId,
            ingredients = [],
        } = req.body as CreateRecipeBody;

        if (!title || !instructions || !categoryId || !areaId) {
            res.status(400).json({
                message: "title, instructions, categoryId and areaId are required",
            });
            return;
        }

        const recipe = await recipeService.create(req.user!.id, {
            title,
            instructions,
            description,
            thumb,
            preview,
            time,
            categoryId,
            areaId,
            ingredients,
        });

        res.status(201).json(recipe);
    };

    // DELETE /recipes/:id — private, only the owner may delete their recipe.
    deleteOwn = async (req: Request, res: Response) => {
        const result = await recipeService.deleteOwn(req.user!.id, req.params.id);

        if (result === "not_found") {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }
        if (result === "forbidden") {
            res.status(403).json({ message: "You can only delete your own recipes" });
            return;
        }

        res.status(204).send();
    };

    // POST /recipes/:id/favorite — private, add recipe to favorites (idempotent).
    addFavorite = async (req: Request, res: Response) => {
        if (!(await recipeService.exists(req.params.id))) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }

        await favoriteService.add(req.user!.id, req.params.id);
        res.status(204).send();
    };

    // DELETE /recipes/:id/favorite — private, remove recipe from favorites (idempotent).
    removeFavorite = async (req: Request, res: Response) => {
        await favoriteService.remove(req.user!.id, req.params.id);
        res.status(204).send();
    };
}

export const recipesController = new RecipesController();
