import { ingredientRepository } from "../repositories/ingredient.repository.js";

type IngredientRepository = typeof ingredientRepository;

export interface IIngredientService {
    getAll: IngredientRepository["findAllSorted"];
}

class IngredientService implements IIngredientService {
    constructor(private readonly ingredientRepository: IngredientRepository) {}

    getAll() {
        return this.ingredientRepository.findAllSorted();
    }
}

export const ingredientService: IIngredientService = new IngredientService(ingredientRepository);
