/**
 * @file        GuideRoutes.js
 * @description Express router for all Guide-related HTTP routes.
 *              Provides REST endpoints for creating, reading, updating,
 *              and deleting guide records.

 *
 * @notes
 *   - Route handlers delegate business logic to controllers.
 *   - Public routes do not require authentication.
 *   - Private routes should be protected using middleware.
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-23
 * @lastModified 2025-11-24
 */


import express from "express";
import { verifySupabaseToken } from "../middlewares/authMiddleware.js";
import { requireAdmin_or_SuperAdmin } from "../middlewares/authMiddleware.js";
import {
  createGuideController,
  updateGuideController,
  deleteGuideController,
  readGuideController,
} from "../controllers/guideControllers.js";

const router = express.Router();

//POST /api/guide/create-guide
router.post(
  "/",
  verifySupabaseToken, // Attach user from JWT
  requireAdmin_or_SuperAdmin, // Only admins/super admins
  createGuideController // Call controller to create guide
);

//PUT /api/guide/update-guide
router.put(
  "/:id",
  verifySupabaseToken,
  requireAdmin_or_SuperAdmin,
  updateGuideController
);

//DELETE /api/guide/delete-guide
router.delete(
  "/:id",
  verifySupabaseToken,
  requireAdmin_or_SuperAdmin,
  deleteGuideController
);

router.get(
  "/:id",
  readGuideController
);

router.get(
  "/",
  readGuideController
);
export default router;
