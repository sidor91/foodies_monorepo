import { ingredientRepository } from "../repositories/ingredient.repository.js";

type IngredientRepository = typeof ingredientRepository;

class IngredientService {
    constructor(private readonly ingredientRepository: IngredientRepository) {}

    getAll() {
        return this.ingredientRepository.findAllSorted();
    }
}

export const ingredientService = new IngredientService(ingredientRepository);
