import type { Request, Response } from "express";
import { recipeService, type IRecipeService } from "../services/recipe.service.js";
import { favoriteService, type IFavoriteService } from "../services/favorite.service.js";
import { parsePagination, parseLimit } from "../utils/pagination.js";

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
    constructor(
        private readonly recipeService: IRecipeService,
        private readonly favoriteService: IFavoriteService,
    ) {
        this.search = this.search.bind(this);
        this.popular = this.popular.bind(this);
        this.own = this.own.bind(this);
        this.favorites = this.favorites.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.deleteOwn = this.deleteOwn.bind(this);
        this.addFavorite = this.addFavorite.bind(this);
        this.removeFavorite = this.removeFavorite.bind(this);
    }

    // GET /recipes?category=&ingredient=&area=&page=&limit= — public search with pagination.
    async search(req: Request, res: Response) {
        const result = await this.recipeService.search(
            {
                category: req.query.category as string | undefined,
                area: req.query.area as string | undefined,
                ingredient: req.query.ingredient as string | undefined,
            },
            parsePagination(req.query),
        );

        res.json(result);
    }

    // GET /recipes/popular?limit= — public, ranked by favorites count.
    async popular(req: Request, res: Response) {
        const limit = parseLimit(req.query, 10, 50);
        const popular = await this.recipeService.getPopular(limit);
        res.json(popular);
    }

    // GET /recipes/own?page=&limit= — private, recipes created by the current user.
    async own(req: Request, res: Response) {
        const result = await this.recipeService.getOwn(req.user!.id, parsePagination(req.query));
        res.json(result);
    }

    // GET /recipes/favorites?page=&limit= — private, current user's favorited recipes.
    async favorites(req: Request, res: Response) {
        const result = await this.recipeService.getFavorites(
            req.user!.id,
            parsePagination(req.query),
        );
        res.json(result);
    }

    // GET /recipes/:id — public recipe detail.
    async getById(req: Request, res: Response) {
        const recipe = await this.recipeService.getById(req.params.id);

        if (!recipe) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }

        res.json(recipe);
    }

    // POST /recipes — private, create own recipe.
    async create(req: Request, res: Response) {
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

        const recipe = await this.recipeService.create(req.user!.id, {
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
    }

    // DELETE /recipes/:id — private, only the owner may delete their recipe.
    async deleteOwn(req: Request, res: Response) {
        const result = await this.recipeService.deleteOwn(req.user!.id, req.params.id);

        if (result === "not_found") {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }
        if (result === "forbidden") {
            res.status(403).json({ message: "You can only delete your own recipes" });
            return;
        }

        res.status(204).send();
    }

    // POST /recipes/:id/favorite — private, add recipe to favorites (idempotent).
    async addFavorite(req: Request, res: Response) {
        if (!(await this.recipeService.exists(req.params.id))) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }

        await this.favoriteService.add(req.user!.id, req.params.id);
        res.status(204).send();
    }

    // DELETE /recipes/:id/favorite — private, remove recipe from favorites (idempotent).
    async removeFavorite(req: Request, res: Response) {
        await this.favoriteService.remove(req.user!.id, req.params.id);
        res.status(204).send();
    }
}

export const recipesController = new RecipesController(recipeService, favoriteService);
