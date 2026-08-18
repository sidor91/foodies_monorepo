import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";

// GET /categories — public list of recipe categories.
export async function getCategories(req: Request, res: Response) {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });
    res.json(categories);
}

// GET /areas — public list of dish origin areas.
export async function getAreas(req: Request, res: Response) {
    const areas = await prisma.area.findMany({
        orderBy: { name: "asc" },
    });
    res.json(areas);
}

// GET /ingredients — public list of ingredients.
export async function getIngredients(req: Request, res: Response) {
    const ingredients = await prisma.ingredient.findMany({
        orderBy: { name: "asc" },
    });
    res.json(ingredients);
}

// GET /testimonials — public list of user testimonials.
export async function getTestimonials(req: Request, res: Response) {
    const testimonials = await prisma.testimonial.findMany({
        select: {
            id: true,
            testimonial: true,
            owner: { select: { id: true, name: true, avatar: true } },
        },
    });
    res.json(testimonials);
}
