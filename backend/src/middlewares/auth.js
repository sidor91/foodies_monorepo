import jwt from "jsonwebtoken";

// Expects `/auth` to issue JWTs signed with JWT_SECRET containing { id: userId }.
export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: "Authorization token required" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.id };
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
