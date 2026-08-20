import type { Request, Response } from "express";
import { authService, type IAuthService, type RegisterInput } from "../services/auth.service.js";
import { jwtService } from "../services/jwt.service.js";

const isProduction = process.env.NODE_ENV === "production";

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
    const { accessToken, refreshToken, user } = await this.authService.register(input);
    this.setAuthCookies(res, accessToken, refreshToken);
    res.status(201).json(user);
  }

  async login(req: Request, res: Response): Promise<void> {
    const { accessToken, refreshToken, user } = await this.authService.login(
      req.body.email,
      req.body.password,
    );
    this.setAuthCookies(res, accessToken, refreshToken);
    res.json(user);
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const { accessToken, refreshToken, user } = await this.authService.refresh(
      req.cookies?.refreshToken,
    );
    this.setAuthCookies(res, accessToken, refreshToken);
    res.json(user);
  }

  async logout(req: Request, res: Response): Promise<void> {
    await this.authService.logout(req.user!.id);
    this.clearAuthCookies(res);
    res.status(204).send();
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    const cookieOptions = { httpOnly: true, secure: isProduction, sameSite: "lax" as const };
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: jwtService.getExpiresInMs("access"),
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: jwtService.getExpiresInMs("refresh"),
    });
  }

  private clearAuthCookies(res: Response): void {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  }
}

export const authController: IAuthController = new AuthController(authService);
