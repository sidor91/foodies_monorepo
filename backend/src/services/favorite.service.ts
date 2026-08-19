import { favoriteRepository, TFavoriteRepository } from "../repositories/favorite.repository.js";

export interface IFavoriteService {
  add: TFavoriteRepository["upsert"];
  remove: TFavoriteRepository["remove"];
}

class FavoriteService implements IFavoriteService {
  constructor(private readonly favoriteRepository: TFavoriteRepository) {}

  add(userId: string, recipeId: string) {
    return this.favoriteRepository.upsert(userId, recipeId);
  }

  remove(userId: string, recipeId: string) {
    return this.favoriteRepository.remove(userId, recipeId);
  }
}

export const favoriteService: IFavoriteService = new FavoriteService(favoriteRepository);
