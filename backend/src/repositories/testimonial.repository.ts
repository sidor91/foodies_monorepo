import type { PrismaClient } from "@prisma/client";
import { prisma } from "../db/prisma.js";

class TestimonialRepository {
    constructor(private readonly prisma: PrismaClient) {}

    findAllWithOwner() {
        return this.prisma.testimonial.findMany({
            select: {
                id: true,
                testimonial: true,
                owner: { select: { id: true, name: true, avatar: true } },
            },
        });
    }
}

export const testimonialRepository = new TestimonialRepository(prisma);
