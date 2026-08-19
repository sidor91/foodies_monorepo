import type { Request, Response } from "express";
import { userService, type IUserService } from "../services/user.service.js";
import { parsePagination } from "../utils/pagination.js";

export interface IUserController {
  getCurrent(req: Request, res: Response): Promise<void>;
  getById(req: Request, res: Response): Promise<void>;
  updateAvatar(req: Request, res: Response): Promise<void>;
  getFollowers(req: Request, res: Response): Promise<void>;
  getFollowing(req: Request, res: Response): Promise<void>;
  follow(req: Request, res: Response): Promise<void>;
  unfollow(req: Request, res: Response): Promise<void>;
}

class UserController implements IUserController {
  constructor(private readonly userService: IUserService) {}

  async getCurrent(req: Request, res: Response) {
    const profile = await this.userService.getProfile(req.user!.id);
    res.json(profile);
  }

  async getById(req: Request, res: Response) {
    const profile = await this.userService.getProfile(req.params.id as string, false);
    if (!profile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(profile);
  }

  async updateAvatar(req: Request, res: Response) {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "avatar file is required" });
      return;
    }

    const user = await this.userService.updateAvatar(req.user!.id, file);
    res.json({ avatarUrl: user.avatarUrl });
  }

  async getFollowers(req: Request, res: Response) {
    const userId = req.params.id as string;
    if (!(await this.userService.getProfile(userId, false))) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(await this.userService.getFollowers(userId, parsePagination(req.query)));
  }

  async getFollowing(req: Request, res: Response) {
    res.json(await this.userService.getFollowing(req.user!.id, parsePagination(req.query)));
  }

  async follow(req: Request, res: Response) {
    const result = await this.userService.changeFollow(
      req.user!.id,
      req.params.id as string,
      "follow",
    );
    if (result === "not_found") {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (result === "self") {
      res.status(400).json({ message: "You cannot follow yourself" });
      return;
    }

    res.status(204).send();
  }

  async unfollow(req: Request, res: Response) {
    const result = await this.userService.changeFollow(
      req.user!.id,
      req.params.id as string,
      "unfollow",
    );
    if (result === "not_found") {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (result === "self") {
      res.status(400).json({ message: "You cannot unfollow yourself" });
      return;
    }

    res.status(204).send();
  }
}

export const userController: IUserController = new UserController(userService);
