import { Router } from "express";
import {
  getMasterWorkDaysController,
  createMasterWorkDayController,
  updateMasterWorkDayController,
  deleteMasterWorkDayController,
  generateMasterWorkDaysController,
} from "../controllers/workdays.controller.js";
import {
  authMiddleware,
  adminOnly,
} from "../middleware/auth.middleware.js";

const router = Router();

// Публічний доступ до розкладу
router.get("/master/:masterId", getMasterWorkDaysController);

// Адмінські роуті для керування розкладом
router.post("/admin", authMiddleware, adminOnly, createMasterWorkDayController);
router.patch("/admin/:id", authMiddleware, adminOnly, updateMasterWorkDayController);
router.delete("/admin/:id", authMiddleware, adminOnly, deleteMasterWorkDayController);
// Адмін генерація розкладу на період
router.post("/admin/generate", authMiddleware, adminOnly, generateMasterWorkDaysController);

export default router;