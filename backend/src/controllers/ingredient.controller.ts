import type { Request, Response } from "express";
import { ingredientService } from "../services/ingredient.service.js";

class IngredientController {
    // GET /ingredients — public list of ingredients.
    getAll = async (req: Request, res: Response) => {
        const ingredients = await ingredientService.getAll();
        res.json(ingredients);
    };
}

export const ingredientController = new IngredientController();
