import type { Request, Response } from "express";
import { ingredientService, type IIngredientService } from "../services/ingredient.service.js";

class IngredientController {
    constructor(private readonly ingredientService: IIngredientService) {
        this.getAll = this.getAll.bind(this);
    }

    // GET /ingredients — public list of ingredients.
    async getAll(req: Request, res: Response) {
        const ingredients = await this.ingredientService.getAll();
        res.json(ingredients);
    }
}

export const ingredientController = new IngredientController(ingredientService);
