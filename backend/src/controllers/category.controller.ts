import type { Request, Response } from "express";
import { categoryService } from "../services/category.service.js";

class CategoryController {
    // GET /categories — public list of recipe categories.
    getAll = async (req: Request, res: Response) => {
        const categories = await categoryService.getAll();
        res.json(categories);
    };
}

export const categoryController = new CategoryController();
