import {
  ingredientRepository,
  TIngredientRepository,
} from "../repositories/ingredient.repository.js";

export interface IIngredientService {
  getAll: TIngredientRepository["findAllSorted"];
}

class IngredientService implements IIngredientService {
  constructor(private readonly ingredientRepository: TIngredientRepository) {}

  getAll() {
    return this.ingredientRepository.findAllSorted();
  }
}

export const ingredientService: IIngredientService = new IngredientService(ingredientRepository);
