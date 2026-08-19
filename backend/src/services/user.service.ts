import { userRepository, type IUserRepository } from "../repositories/user.repository.js";
import {
  cloudinaryService,
  type ICloudinaryService,
  type CloudinaryUploadResult,
} from "./cloudinary.service.js";
import type { User } from "@prisma/client";
import type { UserListItem, UserProfile } from "../repositories/user.repository.js";
import type { Pagination } from "./recipe.service.js";

export type UserFollowResult = "not_found" | "self" | "followed";
export type FollowAction = "follow" | "unfollow";

export type UserProfileResponse = Omit<UserProfile, "_count"> & {
  recipesCount: number;
  favoritesCount: number;
  followersCount: number;
  followingCount?: number;
};

export interface UserConnectionsResponse {
  items: UserListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IUserService {
  getProfile(userId: string, includeFollowingCount?: boolean): Promise<UserProfileResponse | null>;
  getFollowers(userId: string, pagination: Pagination): Promise<UserConnectionsResponse>;
  getFollowing(userId: string, pagination: Pagination): Promise<UserConnectionsResponse>;
  updateAvatar(userId: string, file: Express.Multer.File): Promise<User>;
  changeFollow(
    followerId: string,
    followingId: string,
    action: FollowAction,
  ): Promise<UserFollowResult>;
}

class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cloudinaryService: ICloudinaryService,
  ) {}

  async getProfile(
    userId: string,
    includeFollowingCount = true,
  ): Promise<UserProfileResponse | null> {
    const profile = await this.userRepository.findProfileById(userId);
    if (!profile) {
      return null;
    }

    const { _count, ...user } = profile;
    return {
      ...user,
      recipesCount: _count.recipes,
      favoritesCount: _count.favorites,
      followersCount: _count.followers,
      ...(includeFollowingCount && { followingCount: _count.following }),
    };
  }

  async getFollowers(userId: string, pagination: Pagination): Promise<UserConnectionsResponse> {
    return this.getConnections(userId, pagination, "followers");
  }

  async getFollowing(userId: string, pagination: Pagination): Promise<UserConnectionsResponse> {
    return this.getConnections(userId, pagination, "following");
  }

  async updateAvatar(userId: string, file: Express.Multer.File): Promise<User> {
    const previousAvatar = await this.userRepository.findAvatarById(userId);
    const uploadedAvatar: CloudinaryUploadResult = await this.cloudinaryService.uploadImage(
      file.buffer,
      "foodies/avatars",
    );

    try {
      const user = await this.userRepository.updateAvatar(userId, {
        avatarUrl: uploadedAvatar.secureUrl,
        avatarPublicId: uploadedAvatar.publicId,
      });

      if (previousAvatar?.avatarPublicId) {
        try {
          await this.cloudinaryService.deleteImage(previousAvatar.avatarPublicId);
        } catch (cleanupError) {
          console.error("Failed to delete previous avatar", cleanupError);
        }
      }

      return user;
    } catch (error) {
      try {
        await this.cloudinaryService.deleteImage(uploadedAvatar.publicId);
      } catch (cleanupError) {
        console.error("Failed to clean up uploaded avatar", cleanupError);
      }

      throw error;
    }
  }

  async changeFollow(
    followerId: string,
    followingId: string,
    action: FollowAction,
  ): Promise<UserFollowResult> {
    if (!(await this.userRepository.exists(followingId))) {
      return "not_found";
    }
    if (followerId === followingId) {
      return "self";
    }

    if (action === "follow") {
      await this.userRepository.follow(followerId, followingId);
    } else {
      await this.userRepository.unfollow(followerId, followingId);
    }

    return "followed";
  }

  private async getConnections(
    userId: string,
    { page, limit }: Pagination,
    direction: "followers" | "following",
  ): Promise<UserConnectionsResponse> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      direction === "followers"
        ? this.userRepository.findFollowers(userId, skip, limit)
        : this.userRepository.findFollowing(userId, skip, limit),
      direction === "followers"
        ? this.userRepository.countFollowers(userId)
        : this.userRepository.countFollowing(userId),
    ]);

    return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
  }
}

export const userService: IUserService = new UserService(userRepository, cloudinaryService);
