/**
 * @file        guidedTripsRoutes.js
 * @description Routes for guided trips API endpoints (Read-only)
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-19
 */

import express from 'express';
import GuidedTripsController from '../controllers/guidedTripsController.js';

export function setupGuidedTripsRoutes(app, supabaseClient) {
  const router = express.Router();
  const guidedTripsController = new GuidedTripsController(supabaseClient);

  // READ - Get all guided trips with filters
  router.get('/', (req, res) => {
    guidedTripsController.getAllGuidedTrips(req, res);
  });

  // READ - Get guided trip by ID
  router.get('/:id', (req, res) => {
    guidedTripsController.getGuidedTripById(req, res);
  });

  app.use('/api/guided-trips', router);
}

export default router;

