import type { Request, Response } from "express";
import { ingredientRepository } from "../repositories/ingredient.repository.js";

class IngredientController {
    // GET /ingredients — public list of ingredients.
    getAll = async (req: Request, res: Response) => {
        const ingredients = await ingredientRepository.findAllSorted();
        res.json(ingredients);
    };
}

export const ingredientController = new IngredientController();
