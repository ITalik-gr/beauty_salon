import { Router } from "express";
import {
  getServicesPublic,
  getServicePublic,
  getServicesAdmin,
  createService,
  updateService,
  deactivateServiceController,
} from "../controllers/services.controller.js";
import {
  authMiddleware,
  adminOnly,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getServicesPublic);       // GET /api/services
router.get("/:id", getServicePublic);     // GET /api/services/1

// Admin
router.get("/admin/all", authMiddleware, adminOnly, getServicesAdmin); // GET /api/services/admin/all

router.post("/admin", authMiddleware, adminOnly, createService); // POST /api/services/admin

router.patch("/admin/:id", authMiddleware, adminOnly, updateService); // PATCH /api/services/admin/:id

router.delete("/admin/:id", authMiddleware, adminOnly, deactivateServiceController); // DELETE /api/services/admin/:id (мʼяке видалення)

export default router;