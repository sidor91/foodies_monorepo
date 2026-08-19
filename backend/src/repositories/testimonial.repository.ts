import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../db/prisma.js";

const testimonialWithOwnerSelect = {
  id: true,
  testimonial: true,
  owner: { select: { id: true, name: true, avatar: true } },
} satisfies Prisma.TestimonialSelect;

export type TestimonialWithOwner = Prisma.TestimonialGetPayload<{
  select: typeof testimonialWithOwnerSelect;
}>;

class TestimonialRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findAllWithOwner(): Promise<TestimonialWithOwner[]> {
    return this.prisma.testimonial.findMany({ select: testimonialWithOwnerSelect });
  }
}

export const testimonialRepository = new TestimonialRepository(prisma);

export type TTestimonialRepository = typeof testimonialRepository;
