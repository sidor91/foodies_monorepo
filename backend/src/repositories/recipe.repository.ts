import type { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";

export const recipeListSelect = {
  id: true,
  title: true,
  thumb: true,
  description: true,
  time: true,
  category: { select: { id: true, name: true } },
  area: { select: { id: true, name: true } },
} satisfies Prisma.RecipeSelect;

export interface CreateRecipeData {
  id: string;
  title: string;
  instructions: string;
  description?: string;
  thumb?: string;
  preview?: string;
  time?: number;
  categoryId: string;
  areaId: string;
  ownerId: string;
  ingredients: { id: string; measure?: string }[];
}

class RecipeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findMany(where: Prisma.RecipeWhereInput, skip: number, take: number) {
    return this.prisma.recipe.findMany({ where, select: recipeListSelect, skip, take });
  }

  count(where: Prisma.RecipeWhereInput) {
    return this.prisma.recipe.count({ where });
  }

  findPopular(limit: number) {
    return this.prisma.recipe.findMany({
      select: { ...recipeListSelect, _count: { select: { favoritedBy: true } } },
      orderBy: { favoritedBy: { _count: "desc" } },
      take: limit,
    });
  }

  findDetailById(id: string) {
    return this.prisma.recipe.findUnique({
      where: { id },
      include: {
        category: true,
        area: true,
        owner: { select: { id: true, name: true, avatar: true } },
        ingredients: { include: { ingredient: true } },
      },
    });
  }

  findById(id: string) {
    return this.prisma.recipe.findUnique({ where: { id } });
  }

  create(data: CreateRecipeData) {
    return this.prisma.recipe.create({
      data: {
        id: data.id,
        title: data.title,
        instructions: data.instructions,
        description: data.description,
        thumb: data.thumb,
        preview: data.preview,
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
      include: { ingredients: true },
    });
  }

  deleteById(id: string) {
    return this.prisma.recipe.delete({ where: { id } });
  }
}

export const recipeRepository = new RecipeRepository(prisma);

export type TRecipeRepository = typeof recipeRepository;
