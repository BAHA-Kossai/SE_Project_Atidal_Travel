/**
 * @file        guidedTripsRoutes.js
 * @description Routes for guided trips API endpoints (Read-only)
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-19
 */

import express from 'express';
import { getAllGuidedTrips, getGuidedTripById } from '../controllers/guidedTripsController.js';

export function setupGuidedTripsRoutes(app, supabaseClient) {
  const router = express.Router();

  // READ - Get all guided trips with filters
  router.get('/', getAllGuidedTrips);

  // READ - Get guided trip by ID
  router.get('/:id', getGuidedTripById);

  app.use('/api/guided-trips', router);
}

export default router;

