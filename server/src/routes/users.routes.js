import { Router } from "express";
import * as usersController from "../controllers/users.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", usersController.getUsers);
router.post("/", usersController.createUser);

router.get("/me", authMiddleware, usersController.getMe);

router.patch("/me", authMiddleware, usersController.updateMe);

router.patch("/me/password", authMiddleware, usersController.changePassword);

export default router;