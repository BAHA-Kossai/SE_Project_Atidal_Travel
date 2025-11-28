/**
 * @file        destinationRoutes.js
 * @description Routes for destination API endpoints
 *
 * @author      Ahlem Toubrinet, Abderahim
 * @version     1.0.0
 * @date        2025-11-20
 */

import express from "express";
import destinationsController from "../controllers/destinationsController.js";
console.log('Destinations routes loaded'); 
const router = express.Router();

// GET routes
router.get("/", destinationsController.getAllDestinations);
router.get("/featured", destinationsController.getFeaturedDestinations);
router.get("/search", destinationsController.searchDestinations);
router.get("/:id", destinationsController.getDestinationById);

// POST route
router.post("/", destinationsController.createDestination);

// PUT route
router.put("/:id", destinationsController.updateDestination);

// DELETE route
router.delete("/:id", destinationsController.deleteDestination);

export default router;