import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { uploadMiddleware } from "../middlewares/upload.js";

const router = Router();

router.post("/register", uploadMiddleware.single("avatar"), (req, res) =>
  authController.register(req, res),
);
router.post("/login", (req, res) => authController.login(req, res));
router.post("/refresh", (req, res) => authController.refresh(req, res));
router.post("/logout", authMiddleware.authenticate, (req, res) => authController.logout(req, res));

export default router;
