import type { Request, Response } from "express";
import { authService, type IAuthService, type RegisterInput } from "../services/auth.service.js";

export interface IAuthController {
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  refresh(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
}

class AuthController implements IAuthController {
  constructor(private readonly authService: IAuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    const input: RegisterInput = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: req.file,
    };
    const result = await this.authService.register(input);
    res.status(201).json(result);
  }

  async login(req: Request, res: Response): Promise<void> {
    const result = await this.authService.login(req.body.email, req.body.password);
    res.json(result);
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const result = await this.authService.refresh(req.body.refreshToken);
    res.json(result);
  }

  async logout(req: Request, res: Response): Promise<void> {
    await this.authService.logout(req.user!.id);
    res.status(204).send();
  }
}

export const authController: IAuthController = new AuthController(authService);
