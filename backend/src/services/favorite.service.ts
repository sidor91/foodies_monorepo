import { favoriteRepository } from "../repositories/favorite.repository.js";

type FavoriteRepository = typeof favoriteRepository;

class FavoriteService {
    constructor(private readonly favoriteRepository: FavoriteRepository) {}

    add(userId: string, recipeId: string) {
        return this.favoriteRepository.upsert(userId, recipeId);
    }

    remove(userId: string, recipeId: string) {
        return this.favoriteRepository.remove(userId, recipeId);
    }
}

export const favoriteService = new FavoriteService(favoriteRepository);
