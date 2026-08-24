import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validationSchemas/auth.schema.js";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a user
 *     description: Creates a user and sets HTTP-only access and refresh token cookies.
 *     requestBody:
 *       $ref: '#/components/requestBodies/RegisterUser'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthUser'
 *       400:
 *         description: Invalid registration data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email is already registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/register", validate(registerSchema), (req, res) => authController.register(req, res));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log in
 *     description: Validates user credentials and sets authentication cookies.
 *     requestBody:
 *       $ref: '#/components/requestBodies/LoginUser'
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthUser'
 *       400:
 *         description: Invalid request data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", validate(loginSchema), (req, res) => authController.login(req, res));

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh authentication tokens
 *     description: Uses the refresh token cookie to issue new authentication tokens.
 *     security:
 *       - refreshTokenCookie: []
 *     responses:
 *       200:
 *         description: Authentication tokens refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthUser'
 *       401:
 *         description: Refresh token is missing, invalid, or expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/refresh", (req, res) => authController.refresh(req, res));

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log out
 *     description: Invalidates the user's refresh token and clears authentication cookies.
 *     security:
 *       - accessTokenCookie: []
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful.
 *       401:
 *         description: Access token is missing, invalid, or expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/logout", authMiddleware.authenticate, (req, res) => authController.logout(req, res));

export default router;
