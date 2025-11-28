/**
 * @file        branchesRoutes.js
 * @description Routes for branches API endpoints
 * 
 * @author      Abderahim, Ahlem Toubrient, Kossai BAHA
 * @version     1.0.0
 * @date        2025-11-22
 */

import express from "express";
import {
  verifySupabaseToken,
  requireSuperAdmin,
  requireAdmin_or_SuperAdmin,
} from "../middlewares/authMiddleware.js";
import branchesController from "../controllers/branchesController.js"; 

const router = express.Router();

// Public routes
router.get("/active", branchesController.getActiveBranches);
router.get("/", branchesController.getAllBranches);
router.get("/:id", branchesController.getBranchById);

// Protected routes - require authentication
router.post("/", verifySupabaseToken, requireSuperAdmin, branchesController.createBranch);
router.put("/:id", verifySupabaseToken, requireSuperAdmin, branchesController.updateBranch);
router.delete("/:id", verifySupabaseToken, requireSuperAdmin, branchesController.deleteBranch);

export default router;