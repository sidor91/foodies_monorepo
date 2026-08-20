import type { Follow, Prisma, PrismaClient, User } from "@prisma/client";
import { prisma } from "../db/prisma.js";

const userProfileSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  _count: {
    select: {
      recipes: true,
      favorites: true,
      followers: true,
      following: true,
    },
  },
} satisfies Prisma.UserSelect;

export type UserProfile = Prisma.UserGetPayload<{ select: typeof userProfileSelect }>;

const userListSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  _count: {
    select: {
      recipes: true,
      followers: true,
    },
  },
} satisfies Prisma.UserSelect;

export type UserListItem = Prisma.UserGetPayload<{ select: typeof userListSelect }>;

export type UserAvatar = Pick<User, "avatarUrl" | "avatarPublicId">;
export type UserAuth = Pick<
  User,
  "id" | "name" | "email" | "passwordHash" | "refreshTokenHash" | "avatarUrl"
>;

export interface CreateUserData {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  avatarPublicId?: string;
}

export interface IUserRepository {
  findProfileById(id: string): Promise<UserProfile | null>;
  findFollowers(userId: string, skip: number, take: number): Promise<UserListItem[]>;
  findFollowing(userId: string, skip: number, take: number): Promise<UserListItem[]>;
  countFollowers(userId: string): Promise<number>;
  countFollowing(userId: string): Promise<number>;
  exists(id: string): Promise<boolean>;
  findAuthByEmail(email: string): Promise<UserAuth | null>;
  findAuthById(id: string): Promise<UserAuth | null>;
  createUser(data: CreateUserData): Promise<UserAuth>;
  updateRefreshTokenHash(id: string, refreshTokenHash: string | null): Promise<void>;
  findAvatarById(id: string): Promise<UserAvatar | null>;
  updateAvatar(id: string, avatar: UserAvatar): Promise<User>;
  follow(followerId: string, followingId: string): Promise<Follow>;
  unfollow(followerId: string, followingId: string): Promise<Prisma.BatchPayload>;
}

class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findProfileById(id: string): Promise<UserProfile | null> {
    return this.prisma.user.findUnique({ where: { id }, select: userProfileSelect });
  }

  findFollowers(userId: string, skip: number, take: number): Promise<UserListItem[]> {
    return this.prisma.user.findMany({
      where: { following: { some: { followingId: userId } } },
      select: userListSelect,
      orderBy: { name: "asc" },
      skip,
      take,
    });
  }

  findFollowing(userId: string, skip: number, take: number): Promise<UserListItem[]> {
    return this.prisma.user.findMany({
      where: { followers: { some: { followerId: userId } } },
      select: userListSelect,
      orderBy: { name: "asc" },
      skip,
      take,
    });
  }

  countFollowers(userId: string): Promise<number> {
    return this.prisma.follow.count({ where: { followingId: userId } });
  }

  countFollowing(userId: string): Promise<number> {
    return this.prisma.follow.count({ where: { followerId: userId } });
  }

  exists(id: string): Promise<boolean> {
    return this.prisma.user.findUnique({ where: { id }, select: { id: true } }).then(Boolean);
  }

  findAuthByEmail(email: string): Promise<UserAuth | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        refreshTokenHash: true,
        avatarUrl: true,
      },
    });
  }

  findAuthById(id: string): Promise<UserAuth | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        refreshTokenHash: true,
        avatarUrl: true,
      },
    });
  }

  createUser(data: CreateUserData): Promise<UserAuth> {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        refreshTokenHash: true,
        avatarUrl: true,
      },
    });
  }

  async updateRefreshTokenHash(id: string, refreshTokenHash: string | null): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { refreshTokenHash } });
  }

  findAvatarById(id: string): Promise<UserAvatar | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { avatarUrl: true, avatarPublicId: true },
    });
  }

  updateAvatar(id: string, avatar: UserAvatar): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: avatar });
  }

  follow(followerId: string, followingId: string): Promise<Follow> {
    return this.prisma.follow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      create: { followerId, followingId },
      update: {},
    });
  }

  unfollow(followerId: string, followingId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.follow.deleteMany({ where: { followerId, followingId } });
  }
}

export const userRepository = new UserRepository(prisma);
