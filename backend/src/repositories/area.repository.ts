import type { PrismaClient } from "@prisma/client";
import { prisma } from "../db/prisma.js";

class AreaRepository {
    constructor(private readonly prisma: PrismaClient) {}

    findAllSorted() {
        return this.prisma.area.findMany({ orderBy: { name: "asc" } });
    }
}

export const areaRepository = new AreaRepository(prisma);
