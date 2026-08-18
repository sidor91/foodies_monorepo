import crypto from "node:crypto";
import type { Request, Response } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";

const recipeListSelect = {
    id: true,
    title: true,
    thumb: true,
    description: true,
    time: true,
    category: { select: { id: true, name: true } },
    area: { select: { id: true, name: true } },
} satisfies Prisma.RecipeSelect;

function parsePagination(query: Request["query"]) {
    const page = Math.max(parseInt(String(query.page), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(query.limit), 10) || 12, 1), 50);
    return { page, limit, skip: (page - 1) * limit, take: limit };
}

// GET /recipes?category=&ingredient=&area=&page=&limit= — public search with pagination.
export async function searchRecipes(req: Request, res: Response) {
    const category = req.query.category as string | undefined;
    const ingredient = req.query.ingredient as string | undefined;
    const area = req.query.area as string | undefined;
    const { page, limit, skip, take } = parsePagination(req.query);

    const where: Prisma.RecipeWhereInput = {
        ...(category && { categoryId: category }),
        ...(area && { areaId: area }),
        ...(ingredient && { ingredients: { some: { ingredientId: ingredient } } }),
    };

    const [items, total] = await Promise.all([
        prisma.recipe.findMany({ where, select: recipeListSelect, skip, take }),
        prisma.recipe.count({ where }),
    ]);

    res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
}

// GET /recipes/popular?limit= — public, ranked by favorites count.
export async function getPopularRecipes(req: Request, res: Response) {
    const limit = Math.min(Math.max(parseInt(String(req.query.limit), 10) || 10, 1), 50);

    const popular = await prisma.recipe.findMany({
        select: { ...recipeListSelect, _count: { select: { favoritedBy: true } } },
        orderBy: { favoritedBy: { _count: "desc" } },
        take: limit,
    });

    res.json(
        popular.map(({ _count, ...recipe }) => ({ ...recipe, favoritesCount: _count.favoritedBy })),
    );
}

// GET /recipes/own?page=&limit= — private, recipes created by the current user.
export async function getOwnRecipes(req: Request, res: Response) {
    const { page, limit, skip, take } = parsePagination(req.query);
    const where: Prisma.RecipeWhereInput = { ownerId: req.user!.id };

    const [items, total] = await Promise.all([
        prisma.recipe.findMany({ where, select: recipeListSelect, skip, take }),
        prisma.recipe.count({ where }),
    ]);

    res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
}

// GET /recipes/favorites?page=&limit= — private, current user's favorited recipes.
export async function getFavoriteRecipes(req: Request, res: Response) {
    const { page, limit, skip, take } = parsePagination(req.query);
    const where: Prisma.RecipeWhereInput = { favoritedBy: { some: { userId: req.user!.id } } };

    const [items, total] = await Promise.all([
        prisma.recipe.findMany({ where, select: recipeListSelect, skip, take }),
        prisma.recipe.count({ where }),
    ]);

    res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
}

// GET /recipes/:id — public recipe detail.
export async function getRecipeById(req: Request, res: Response) {
    const recipe = await prisma.recipe.findUnique({
        where: { id: req.params.id },
        include: {
            category: true,
            area: true,
            owner: { select: { id: true, name: true, avatar: true } },
            ingredients: { include: { ingredient: true } },
        },
    });

    if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
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

// POST /recipes — private, create own recipe.
export async function createRecipe(req: Request, res: Response) {
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
        return res
            .status(400)
            .json({ message: "title, instructions, categoryId and areaId are required" });
    }

    const recipe = await prisma.recipe.create({
        data: {
            id: crypto.randomUUID(),
            title,
            instructions,
            description,
            thumb,
            preview,
            time,
            categoryId,
            areaId,
            ownerId: req.user!.id,
            ingredients: {
                create: ingredients.map((ingredient) => ({
                    ingredientId: ingredient.id,
                    measure: ingredient.measure,
                })),
            },
        },
        include: { ingredients: true },
    });

    res.status(201).json(recipe);
}

// DELETE /recipes/:id — private, only the owner may delete their recipe.
export async function deleteOwnRecipe(req: Request, res: Response) {
    const recipe = await prisma.recipe.findUnique({ where: { id: req.params.id } });

    if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
    }
    if (recipe.ownerId !== req.user!.id) {
        return res.status(403).json({ message: "You can only delete your own recipes" });
    }

    await prisma.recipe.delete({ where: { id: req.params.id } });
    res.status(204).send();
}

// POST /recipes/:id/favorite — private, add recipe to favorites (idempotent).
export async function addFavorite(req: Request, res: Response) {
    const recipe = await prisma.recipe.findUnique({ where: { id: req.params.id } });
    if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
    }

    await prisma.favorite.upsert({
        where: { userId_recipeId: { userId: req.user!.id, recipeId: req.params.id } },
        create: { userId: req.user!.id, recipeId: req.params.id },
        update: {},
    });

    res.status(204).send();
}

// DELETE /recipes/:id/favorite — private, remove recipe from favorites (idempotent).
export async function removeFavorite(req: Request, res: Response) {
    await prisma.favorite.deleteMany({ where: { userId: req.user!.id, recipeId: req.params.id } });
    res.status(204).send();
}
