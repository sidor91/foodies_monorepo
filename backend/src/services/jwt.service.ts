import jwt from "jsonwebtoken";
import { parseExpiresInMs } from "../utils/expiresIn.js";

export type TokenType = "access" | "refresh";

const tokenConfig: Record<TokenType, { secret: string | undefined; expiresIn: string }> = {
  access: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  },
  refresh: {
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  },
};

export interface TokenPayload {
  id: string;
}

export interface IJwtService {
  sign(payload: TokenPayload, type: TokenType): string;
  verify(token: string, type: TokenType): TokenPayload;
  getExpiresInMs(type: TokenType): number;
}

class JwtService implements IJwtService {
  sign(payload: TokenPayload, type: TokenType): string {
    const { secret, expiresIn } = tokenConfig[type];
    return jwt.sign(payload, secret as string, {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    });
  }

  verify(token: string, type: TokenType): TokenPayload {
    const { secret } = tokenConfig[type];
    return jwt.verify(token, secret as string) as TokenPayload;
  }

  getExpiresInMs(type: TokenType): number {
    return parseExpiresInMs(tokenConfig[type].expiresIn);
  }
}

export const jwtService: IJwtService = new JwtService();
