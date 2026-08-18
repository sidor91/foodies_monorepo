import { favoriteRepository } from "../repositories/favorite.repository.js";

type FavoriteRepository = typeof favoriteRepository;

export interface IFavoriteService {
    add: FavoriteRepository["upsert"];
    remove: FavoriteRepository["remove"];
}

class FavoriteService implements IFavoriteService {
    constructor(private readonly favoriteRepository: FavoriteRepository) {}

    add(userId: string, recipeId: string) {
        return this.favoriteRepository.upsert(userId, recipeId);
    }

    remove(userId: string, recipeId: string) {
        return this.favoriteRepository.remove(userId, recipeId);
    }
}

export const favoriteService: IFavoriteService = new FavoriteService(favoriteRepository);
