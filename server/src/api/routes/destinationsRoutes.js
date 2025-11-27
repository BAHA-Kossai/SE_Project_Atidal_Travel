/**
<<<<<<< HEAD
 * @file        destinationRoutes.js
 * @description Routes for destination API endpoints
 *
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-20
 */
import express from "express";
import destinationsController from "../controllers/destinationsController.js";
import {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
} from "../controllers/destinationController.js";
import { validateDestination } from "../validators/destinationValidator.js";
import express from "express";
import destinationsController from "../controllers/destinationsController.js";

const router = express.Router();
router.get("/", destinationsController.getAllDestinations);
router.get("/featured", destinationsController.getFeaturedDestinations);
router.get("/search", destinationsController.searchDestinations);

// CREATE - Post a new destination
router.post("/", validateDestination, createDestination);

// READ - Get all destinations with filters
router.get("/", getAllDestinations);

// READ - Get destination by ID
router.get("/:id", getDestinationById);

// UPDATE - Update destination by ID
router.put("/:id", validateDestination, updateDestination);

// DELETE - Delete destination by ID
router.delete("/:id", deleteDestination);
router.get("/", destinationsController.getAllDestinations);
router.get("/search", destinationsController.searchDestinations);

export default router;
