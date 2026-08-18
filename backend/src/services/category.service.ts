import { categoryRepository, TCategoryRepository } from "../repositories/category.repository.js";

export interface ICategoryService {
    getAll: TCategoryRepository["findAllSorted"];
}

class CategoryService implements ICategoryService {
    constructor(private readonly categoryRepository: TCategoryRepository) {}

    getAll() {
        return this.categoryRepository.findAllSorted();
    }
}

export const categoryService: ICategoryService = new CategoryService(categoryRepository);
