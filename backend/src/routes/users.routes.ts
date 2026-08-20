import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { uploadMiddleware } from "../middlewares/upload.js";
import { userController } from "../controllers/user.controller.js";

const router = Router();

router.use(authMiddleware.authenticate);

router.get("/me", (req, res) => userController.getCurrent(req, res));
router.patch("/me/avatar", uploadMiddleware.single("avatar"), (req, res) =>
  userController.updateAvatar(req, res),
);
router.get("/following", (req, res) => userController.getFollowing(req, res));
router.get("/:id/followers", (req, res) => userController.getFollowers(req, res));
router.post("/:id/follow", (req, res) => userController.follow(req, res));
router.delete("/:id/follow", (req, res) => userController.unfollow(req, res));
router.get("/:id", (req, res) => userController.getById(req, res));

export default router;
