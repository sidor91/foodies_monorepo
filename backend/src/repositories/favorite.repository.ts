import type { PrismaClient } from "@prisma/client";
import { prisma } from "../db/prisma.js";

class FavoriteRepository {
    constructor(private readonly prisma: PrismaClient) {}

    upsert(userId: string, recipeId: string) {
        return this.prisma.favorite.upsert({
            where: { userId_recipeId: { userId, recipeId } },
            create: { userId, recipeId },
            update: {},
        });
    }

    remove(userId: string, recipeId: string) {
        return this.prisma.favorite.deleteMany({ where: { userId, recipeId } });
    }
}

export const favoriteRepository = new FavoriteRepository(prisma);
