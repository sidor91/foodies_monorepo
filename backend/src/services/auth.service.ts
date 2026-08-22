import { randomUUID } from "node:crypto";
import {
  userRepository,
  type CreateUserData,
  type IUserRepository,
  type UserAuth,
} from "../repositories/user.repository.js";
import { cryptoService, type ICryptoService } from "./crypto.service.js";
import { jwtService, type IJwtService } from "./jwt.service.js";
import { AppError } from "../utils/AppError.js";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<UserAuth, "passwordHash" | "refreshTokenHash">;
}

export interface IAuthService {
  register(input: RegisterInput): Promise<AuthResponse>;
  login(email: string, password: string): Promise<AuthResponse>;
  refresh(refreshToken: string): Promise<AuthResponse>;
  logout(userId: string): Promise<void>;
}

class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cryptoService: ICryptoService,
    private readonly jwtService: IJwtService,
  ) {}

  async register({ name, email, password }: RegisterInput): Promise<AuthResponse> {
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 6
    ) {
      throw new AppError(400, "Name, email, and a password of at least 6 characters are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await this.userRepository.findAuthByEmail(normalizedEmail);
    if (existingUser) {
      throw new AppError(409, "Email is already registered");
    }

    const data: CreateUserData = {
      id: randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await this.cryptoService.hash(password),
    };

    const user = await this.userRepository.createUser(data);
    return this.createAuthResponse(user);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    if (typeof email !== "string" || typeof password !== "string") {
      throw new AppError(400, "Email and password are required");
    }

    const user = await this.userRepository.findAuthByEmail(email.trim().toLowerCase());
    if (!user?.passwordHash || !(await this.cryptoService.compare(password, user.passwordHash))) {
      throw new AppError(401, "Invalid email or password");
    }

    return this.createAuthResponse(user);
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    if (typeof refreshToken !== "string" || !refreshToken) {
      throw new AppError(401, "Refresh token required");
    }

    let payload: { id: string };
    try {
      payload = this.jwtService.verify(refreshToken, "refresh");
    } catch {
      throw new AppError(401, "Invalid or expired refresh token");
    }

    const user = await this.userRepository.findAuthById(payload.id);
    if (
      !user?.refreshTokenHash ||
      !(await this.cryptoService.compare(refreshToken, user.refreshTokenHash))
    ) {
      throw new AppError(401, "Invalid or expired refresh token");
    }

    return this.createAuthResponse(user);
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.updateRefreshTokenHash(userId, null);
  }

  private async createAuthResponse(user: UserAuth): Promise<AuthResponse> {
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };
    const accessToken = this.jwtService.sign({ id: user.id }, "access");
    const refreshToken = this.jwtService.sign({ id: user.id }, "refresh");
    await this.userRepository.updateRefreshTokenHash(
      user.id,
      await this.cryptoService.hash(refreshToken),
    );

    return { accessToken, refreshToken, user: safeUser };
  }
}

export const authService: IAuthService = new AuthService(userRepository, cryptoService, jwtService);
