/**
 * @file        guidedTripsRoutes.js
 * @description Routes for guided trips API endpoints (Read-only)
 *
 * @author      Abderahim,Ahlem
 * @version     1.0.0
 * @date        2025-11-19
 */

import express from "express";
import {
  getAllGuidedTrips,
  getGuidedTripById,
} from "../controllers/guidedTripsController.js";
import guidedTripsController from "../controllers/guidedTripsController.js";

const router = express.Router();

// READ - Get all guided trips with filters
router.get("/", getAllGuidedTrips);

// READ - Get guided trip by ID
router.get("/:id", getGuidedTripById);
router.get("/type/:type", guidedTripsController.getTripsByType);

export default router;
