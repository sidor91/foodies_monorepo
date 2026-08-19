import type { Request, Response } from "express";
import { categoryService, type ICategoryService } from "../services/category.service.js";

class CategoryController {
  constructor(private readonly categoryService: ICategoryService) {}

  // GET /categories — public list of recipe categories.
  async getAll(_: Request, res: Response) {
    const categories = await this.categoryService.getAll();
    res.json(categories);
  }
}

export const categoryController = new CategoryController(categoryService);
