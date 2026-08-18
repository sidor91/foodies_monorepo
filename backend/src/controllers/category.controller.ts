import type { Request, Response } from "express";
import { categoryService, type ICategoryService } from "../services/category.service.js";

class CategoryController {
    constructor(private readonly categoryService: ICategoryService) {
        this.getAll = this.getAll.bind(this);
    }

    // GET /categories — public list of recipe categories.
    async getAll(req: Request, res: Response) {
        const categories = await this.categoryService.getAll();
        res.json(categories);
    }
}

export const categoryController = new CategoryController(categoryService);
