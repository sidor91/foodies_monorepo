import type { Ingredient, PrismaClient } from "@prisma/client";
import { prisma } from "../db/prisma.js";

class IngredientRepository {
	constructor(private readonly prisma: PrismaClient) {}

	findAllSorted(): Promise<Ingredient[]> {
		return this.prisma.ingredient.findMany({ orderBy: { name: "asc" } });
	}
}

export const ingredientRepository = new IngredientRepository(prisma);

export type TIngredientRepository = typeof ingredientRepository;
