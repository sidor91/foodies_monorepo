import { categoryRepository } from "../repositories/category.repository.js";

type CategoryRepository = typeof categoryRepository;

export interface ICategoryService {
    getAll: CategoryRepository["findAllSorted"];
}

class CategoryService implements ICategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    getAll() {
        return this.categoryRepository.findAllSorted();
    }
}

export const categoryService: ICategoryService = new CategoryService(categoryRepository);
