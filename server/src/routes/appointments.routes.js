import { Router } from "express";
import {
  createAppointmentController,
  getMyAppointmentsController,
  getAllAppointmentsController,
  updateAppointmentStatusController,
} from "../controllers/appointments.controller.js";
import {
  authMiddleware,
  adminOnly,
} from "../middleware/auth.middleware.js";

const router = Router();

// Юзер
router.post("/", authMiddleware, createAppointmentController);
router.get("/my", authMiddleware, getMyAppointmentsController);

// Адмін
router.get("/admin", authMiddleware, adminOnly, getAllAppointmentsController);
router.patch("/admin/:id/status", authMiddleware, adminOnly, updateAppointmentStatusController);

export default router;