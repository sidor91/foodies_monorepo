import type { PrismaClient } from "@prisma/client";
import { prisma } from "../db/prisma.js";

class CategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findAllSorted() {
    return this.prisma.category.findMany({ orderBy: { name: "asc" } });
  }
}

export const categoryRepository = new CategoryRepository(prisma);

export type TCategoryRepository = typeof categoryRepository;
