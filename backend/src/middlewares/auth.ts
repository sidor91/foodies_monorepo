import type { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwt.service.js";

class AuthMiddleware {
  authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = req.cookies?.accessToken || headerToken;

    if (!token) {
      res.status(401).json({ message: "Authorization token required" });
      return;
    }

    try {
      const payload = jwtService.verify(token, "access");
      req.user = { id: payload.id };
      next();
    } catch {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  }
}

export const authMiddleware = new AuthMiddleware();
