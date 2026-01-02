/**
 * @file        PayersRoutes.js
 * @description Routes for payers API endpoints
 * 
 * @author      System
 * @version     1.0.0
 * @date        2025-12-26
 */

import express from "express";
import {
  verifySupabaseToken,
  requireAdmin_or_SuperAdmin,
} from "../middlewares/authMiddleware.js";
import payersController from "../controllers/PayersController.js";

const router = express.Router();

// Public routes
router.get("/", payersController.getAllPayers);
router.get("/booking/:bookingId", payersController.getPayersByBookingId);
router.get("/:id", payersController.getPayerById);


// Protected routes - require authentication
router.post("/", verifySupabaseToken, requireAdmin_or_SuperAdmin, payersController.createPayer);
router.put("/:id", verifySupabaseToken, requireAdmin_or_SuperAdmin, payersController.updatePayer);
router.delete("/:id", verifySupabaseToken, requireAdmin_or_SuperAdmin, payersController.deletePayer);

export default router;
