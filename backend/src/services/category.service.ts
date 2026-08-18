import { categoryRepository } from "../repositories/category.repository.js";

type CategoryRepository = typeof categoryRepository;

class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    getAll() {
        return this.categoryRepository.findAllSorted();
    }
}

export const categoryService = new CategoryService(categoryRepository);
