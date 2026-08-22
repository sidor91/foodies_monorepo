import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";
import {
  recipeRepository,
  TRecipeRepository,
  type CreateRecipeData,
} from "../repositories/recipe.repository.js";
import { cloudinaryService, type ICloudinaryService } from "./cloudinary.service.js";

export interface RecipeFilters {
  category?: string;
  area?: string;
  ingredient?: string;
}

export interface Pagination {
  page: number;
  limit: number;
}

export type CreateRecipeInput = Omit<
  CreateRecipeData,
  "id" | "ownerId" | "image" | "imagePublicId"
>;

type DeleteOwnResult = "not_found" | "forbidden" | "deleted";

export interface IRecipeService {
  search: RecipeService["search"];
  getPopular: RecipeService["getPopular"];
  getOwn: RecipeService["getOwn"];
  getFavorites: RecipeService["getFavorites"];
  getById: RecipeService["getById"];
  exists: RecipeService["exists"];
  create: RecipeService["create"];
  deleteOwn: RecipeService["deleteOwn"];
}

class RecipeService {
  constructor(
    private readonly recipeRepository: TRecipeRepository,
    private readonly cloudinaryService: ICloudinaryService,
  ) {}

  async search(filters: RecipeFilters, pagination: Pagination) {
    const where: Prisma.RecipeWhereInput = {
      ...(filters.category && { categoryId: filters.category }),
      ...(filters.area && { areaId: filters.area }),
      ...(filters.ingredient && {
        ingredients: { some: { ingredientId: filters.ingredient } },
      }),
    };

    return this.paginate(where, pagination);
  }

  async getPopular(limit: number) {
    const popular = await this.recipeRepository.findPopular(limit);
    return popular.map(({ _count, ...recipe }) => ({
      ...recipe,
      favoritesCount: _count.favoritedBy,
    }));
  }

  async getOwn(ownerId: string, pagination: Pagination) {
    return this.paginate({ ownerId }, pagination);
  }

  async getFavorites(userId: string, pagination: Pagination) {
    return this.paginate({ favoritedBy: { some: { userId } } }, pagination);
  }

  getById(id: string) {
    return this.recipeRepository.findDetailById(id);
  }

  async exists(id: string) {
    return (await this.recipeRepository.findById(id)) !== null;
  }

  async create(ownerId: string, data: CreateRecipeInput, file?: Express.Multer.File) {
    const uploadedImage = file
      ? await this.cloudinaryService.uploadImage(file.buffer, "foodies/recipes")
      : null;

    try {
      return await this.recipeRepository.create({
        id: crypto.randomUUID(),
        ownerId,
        ...data,
        ...(uploadedImage && {
          image: uploadedImage.secureUrl,
          imagePublicId: uploadedImage.publicId,
        }),
      });
    } catch (error) {
      if (uploadedImage) {
        try {
          await this.cloudinaryService.deleteImage(uploadedImage.publicId);
        } catch (cleanupError) {
          console.error("Failed to clean up recipe image", cleanupError);
        }
      }

      throw error;
    }
  }

  async deleteOwn(userId: string, recipeId: string): Promise<DeleteOwnResult> {
    const recipe = await this.recipeRepository.findById(recipeId);
    if (!recipe) {
      return "not_found";
    }
    if (recipe.ownerId !== userId) {
      return "forbidden";
    }

    await this.recipeRepository.deleteById(recipeId);
    return "deleted";
  }

  private async paginate(where: Prisma.RecipeWhereInput, { page, limit }: Pagination) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.recipeRepository.findMany(where, skip, limit),
      this.recipeRepository.count(where),
    ]);

    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
  }
}

export const recipeService: IRecipeService = new RecipeService(recipeRepository, cloudinaryService);
