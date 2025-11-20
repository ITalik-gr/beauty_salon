import { Router } from "express";
import {
  getMastersPublic,
  getMasterPublic,
  getMastersAdmin,
  createMaster,
  updateMaster,
  deactivateMasterController,
  setMasterServicesController,
} from "../controllers/masters.controller.js";
import {
  authMiddleware,
  adminOnly,
} from "../middleware/auth.middleware.js";

const router = Router();


router.get("/", getMastersPublic);        // GET /api/masters
router.get("/:id", getMasterPublic);      // GET /api/masters/1


router.get("/admin/all", authMiddleware, adminOnly, getMastersAdmin); // GET /api/masters/admin/all

router.post("/admin", authMiddleware, adminOnly, createMaster); // POST /api/masters/admin

router.patch("/admin/:id", authMiddleware, adminOnly, updateMaster); // PATCH /api/masters/admin/:id

router.delete("/admin/:id", authMiddleware, adminOnly, deactivateMasterController); // DELETE /api/masters/admin/:id

// Задати послуги для майстра
router.patch("/admin/:id/services", authMiddleware, adminOnly, setMasterServicesController); // PATCH /api/masters/admin/:id/services

export default router;