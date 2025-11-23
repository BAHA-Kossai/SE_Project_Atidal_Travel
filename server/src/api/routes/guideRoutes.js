/**
 * @file        guideRoutes.js
 * @description Express routes for managing guides (CRUD operations).
 *              Includes route for creating a guide.
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-23
 */

import express from "express";
import { verifySupabaseToken } from "../middlewares/authMiddleware.js";
import { requireAdmin_or_SuperAdmin } from "../middlewares/authMiddleware.js";
import {
  createGuideController,
  updateGuideController,
  deleteGuideController,
} from "../controllers/guideControllers.js";

const router = express.Router();

//POST /api/guides/create-guide
router.post(
  "/create-guide",
  verifySupabaseToken, // Attach user from JWT
  requireAdmin_or_SuperAdmin, // Only admins/super admins
  createGuideController // Call controller to create guide
);

//PUT /api/guides/update-guide
router.put(
  "/update-guide/:id",
  verifySupabaseToken,
  requireAdmin_or_SuperAdmin,
  updateGuideController
);

//DELETE /api/guides/delete-guide
router.delete(
  "/delete-guide/:id",
  verifySupabaseToken,
  requireAdmin_or_SuperAdmin,
  deleteGuideController
);
export default router;
