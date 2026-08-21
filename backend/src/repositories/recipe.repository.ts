import type { PrismaClient, Prisma, Recipe } from "@prisma/client";
import { prisma } from "../db/prisma.js";

export const recipeListSelect = {
  id: true,
  title: true,
  image: true,
  description: true,
  time: true,
  category: { select: { id: true, name: true } },
  area: { select: { id: true, name: true } },
} satisfies Prisma.RecipeSelect;

export type RecipeListItem = Prisma.RecipeGetPayload<{ select: typeof recipeListSelect }>;

const recipePopularSelect = {
  ...recipeListSelect,
  _count: { select: { favoritedBy: true } },
} satisfies Prisma.RecipeSelect;

export type RecipePopularItem = Prisma.RecipeGetPayload<{ select: typeof recipePopularSelect }>;

const recipeDetailSelect = {
  id: true,
  title: true,
  instructions: true,
  description: true,
  image: true,
  time: true,
  categoryId: true,
  areaId: true,
  ownerId: true,
  category: true,
  area: true,
  owner: { select: { id: true, name: true, avatarUrl: true } },
  ingredients: { include: { ingredient: true } },
} satisfies Prisma.RecipeSelect;

export type RecipeDetail = Prisma.RecipeGetPayload<{ select: typeof recipeDetailSelect }>;

const recipeCreateSelect = {
  id: true,
  title: true,
  instructions: true,
  description: true,
  image: true,
  time: true,
  categoryId: true,
  areaId: true,
  ownerId: true,
  ingredients: true,
} satisfies Prisma.RecipeSelect;

export type RecipeWithIngredients = Prisma.RecipeGetPayload<{
  select: typeof recipeCreateSelect;
}>;

export interface CreateRecipeData {
  id: string;
  title: string;
  instructions: string;
  description?: string;
  image?: string;
  imagePublicId?: string;
  time?: number;
  categoryId: string;
  areaId: string;
  ownerId: string;
  ingredients: { id: string; measure?: string }[];
}

class RecipeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findMany(where: Prisma.RecipeWhereInput, skip: number, take: number): Promise<RecipeListItem[]> {
    return this.prisma.recipe.findMany({ where, select: recipeListSelect, skip, take });
  }

  count(where: Prisma.RecipeWhereInput): Promise<number> {
    return this.prisma.recipe.count({ where });
  }

  findPopular(limit: number): Promise<RecipePopularItem[]> {
    return this.prisma.recipe.findMany({
      select: recipePopularSelect,
      orderBy: { favoritedBy: { _count: "desc" } },
      take: limit,
    });
  }

  findDetailById(id: string): Promise<RecipeDetail | null> {
    return this.prisma.recipe.findUnique({ where: { id }, select: recipeDetailSelect });
  }

  findById(id: string): Promise<Recipe | null> {
    return this.prisma.recipe.findUnique({ where: { id } });
  }

  create(data: CreateRecipeData): Promise<RecipeWithIngredients> {
    return this.prisma.recipe.create({
      data: {
        id: data.id,
        title: data.title,
        instructions: data.instructions,
        description: data.description,
        image: data.image,
        imagePublicId: data.imagePublicId,
        time: data.time,
        categoryId: data.categoryId,
        areaId: data.areaId,
        ownerId: data.ownerId,
        ingredients: {
          create: data.ingredients.map((ingredient) => ({
            ingredientId: ingredient.id,
            measure: ingredient.measure,
          })),
        },
      },
      select: recipeCreateSelect,
    });
  }

  deleteById(id: string): Promise<Recipe> {
    return this.prisma.recipe.delete({ where: { id } });
  }
}

export const recipeRepository = new RecipeRepository(prisma);

export type TRecipeRepository = typeof recipeRepository;
