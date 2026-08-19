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
} satisfies Prisma.UserSelect;

export type UserListItem = Prisma.UserGetPayload<{ select: typeof userListSelect }>;

export type UserAvatar = Pick<User, "avatarUrl" | "avatarPublicId">;

export interface IUserRepository {
  findProfileById(id: string): Promise<UserProfile | null>;
  findFollowers(userId: string, skip: number, take: number): Promise<UserListItem[]>;
  findFollowing(userId: string, skip: number, take: number): Promise<UserListItem[]>;
  countFollowers(userId: string): Promise<number>;
  countFollowing(userId: string): Promise<number>;
  exists(id: string): Promise<boolean>;
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
