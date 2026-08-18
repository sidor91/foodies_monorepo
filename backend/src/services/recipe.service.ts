import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";
import { recipeRepository, type CreateRecipeData } from "../repositories/recipe.repository.js";

type RecipeRepository = typeof recipeRepository;

export interface RecipeFilters {
    category?: string;
    area?: string;
    ingredient?: string;
}

export interface Pagination {
    page: number;
    limit: number;
}

export type CreateRecipeInput = Omit<CreateRecipeData, "id" | "ownerId">;

type DeleteOwnResult = "not_found" | "forbidden" | "deleted";

export interface IRecipeService {
    search: RecipeService["search"];
    getPopular: RecipeService["getPopular"];
    getOwn: RecipeService["getOwn"];
    getFavorites: RecipeService["getFavorites"];
    getById: RecipeService["getById"];
    exists: RecipeService["exists"];
    create: RecipeService["create"];
    deleteOwn: RecipeService["deleteOwn"];
}

class RecipeService {
    constructor(private readonly recipeRepository: RecipeRepository) {}

    async search(filters: RecipeFilters, pagination: Pagination) {
        const where: Prisma.RecipeWhereInput = {
            ...(filters.category && { categoryId: filters.category }),
            ...(filters.area && { areaId: filters.area }),
            ...(filters.ingredient && {
                ingredients: { some: { ingredientId: filters.ingredient } },
            }),
        };

        return this.paginate(where, pagination);
    }

    async getPopular(limit: number) {
        const popular = await this.recipeRepository.findPopular(limit);
        return popular.map(({ _count, ...recipe }) => ({
            ...recipe,
            favoritesCount: _count.favoritedBy,
        }));
    }

    async getOwn(ownerId: string, pagination: Pagination) {
        return this.paginate({ ownerId }, pagination);
    }

    async getFavorites(userId: string, pagination: Pagination) {
        return this.paginate({ favoritedBy: { some: { userId } } }, pagination);
    }

    getById(id: string) {
        return this.recipeRepository.findDetailById(id);
    }

    async exists(id: string) {
        return (await this.recipeRepository.findById(id)) !== null;
    }

    create(ownerId: string, data: CreateRecipeInput) {
        return this.recipeRepository.create({ id: crypto.randomUUID(), ownerId, ...data });
    }

    async deleteOwn(userId: string, recipeId: string): Promise<DeleteOwnResult> {
        const recipe = await this.recipeRepository.findById(recipeId);
        if (!recipe) {
            return "not_found";
        }
        if (recipe.ownerId !== userId) {
            return "forbidden";
        }

        await this.recipeRepository.deleteById(recipeId);
        return "deleted";
    }

    private async paginate(where: Prisma.RecipeWhereInput, { page, limit }: Pagination) {
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.recipeRepository.findMany(where, skip, limit),
            this.recipeRepository.count(where),
        ]);

        return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
    }
}

export const recipeService: IRecipeService = new RecipeService(recipeRepository);
