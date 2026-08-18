import type { Request, Response } from "express";
import { categoryRepository } from "../repositories/category.repository.js";

class CategoryController {
    // GET /categories — public list of recipe categories.
    getAll = async (req: Request, res: Response) => {
        const categories = await categoryRepository.findAllSorted();
        res.json(categories);
    };
}

export const categoryController = new CategoryController();
