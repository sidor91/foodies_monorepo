import type { Request, Response } from "express";
import { ingredientService, type IIngredientService } from "../services/ingredient.service.js";

class IngredientController {
  constructor(private readonly ingredientService: IIngredientService) {}

  // GET /ingredients — public list of ingredients.
  async getAll(_: Request, res: Response) {
    const ingredients = await this.ingredientService.getAll();
    res.json(ingredients);
  }
}

export const ingredientController = new IngredientController(ingredientService);
