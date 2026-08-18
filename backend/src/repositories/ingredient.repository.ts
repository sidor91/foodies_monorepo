import type { PrismaClient } from "@prisma/client";
import { prisma } from "../db/prisma.js";

class IngredientRepository {
    constructor(private readonly prisma: PrismaClient) {}

    findAllSorted() {
        return this.prisma.ingredient.findMany({ orderBy: { name: "asc" } });
    }
}

export const ingredientRepository = new IngredientRepository(prisma);
