import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

// Expects `/auth` to issue JWTs signed with JWT_SECRET containing { id: userId }.
class AuthMiddleware {
    constructor() {
        this.authenticate = this.authenticate.bind(this);
    }

    authenticate(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

        if (!token) {
            res.status(401).json({ message: "Authorization token required" });
            return;
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
            req.user = { id: payload.id };
            next();
        } catch {
            res.status(401).json({ message: "Invalid or expired token" });
        }
    }
}

export const authMiddleware = new AuthMiddleware();
