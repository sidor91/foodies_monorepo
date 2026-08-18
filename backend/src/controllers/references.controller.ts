import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";

class ReferencesController {
    // GET /categories — public list of recipe categories.
    getCategories = async (req: Request, res: Response) => {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
        });
        res.json(categories);
    };

    // GET /areas — public list of dish origin areas.
    getAreas = async (req: Request, res: Response) => {
        const areas = await prisma.area.findMany({
            orderBy: { name: "asc" },
        });
        res.json(areas);
    };

    // GET /ingredients — public list of ingredients.
    getIngredients = async (req: Request, res: Response) => {
        const ingredients = await prisma.ingredient.findMany({
            orderBy: { name: "asc" },
        });
        res.json(ingredients);
    };

    // GET /testimonials — public list of user testimonials.
    getTestimonials = async (req: Request, res: Response) => {
        const testimonials = await prisma.testimonial.findMany({
            select: {
                id: true,
                testimonial: true,
                owner: { select: { id: true, name: true, avatar: true } },
            },
        });
        res.json(testimonials);
    };
}

export const referencesController = new ReferencesController();
