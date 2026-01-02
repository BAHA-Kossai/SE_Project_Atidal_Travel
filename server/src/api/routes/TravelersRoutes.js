/**
 * @file        TravelersRoutes.js
 * @description Routes for travelers API endpoints
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
import travelersController from "../controllers/TravelersController.js";

const router = express.Router();

// Public routes
router.get("/", travelersController.getAllTravelers);
router.get("/booking/:bookingId", travelersController.getTravelersByBookingId);
router.get("/:id", travelersController.getTravelerById);

// Protected routes - require authentication
router.post("/", verifySupabaseToken, requireAdmin_or_SuperAdmin, travelersController.createTraveler);
router.put("/:id", verifySupabaseToken, requireAdmin_or_SuperAdmin, travelersController.updateTraveler);
router.delete("/:id", verifySupabaseToken, requireAdmin_or_SuperAdmin, travelersController.deleteTraveler);

export default router;
