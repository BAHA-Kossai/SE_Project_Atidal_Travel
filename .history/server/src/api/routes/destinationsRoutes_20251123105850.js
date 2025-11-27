/**
 * @file        destinationRoutes.js
 * @description Routes for destination API endpoints
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-20
 */

import express from 'express';
import { createDestination, getAllDestinations, getDestinationById, updateDestination, deleteDestination } from '../controllers/destinationController.js';
import { validateDestination } from '../validators/destinationValidator.js';

export function setupDestinationRoutes(app, supabaseClient) {
  const router = express.Router();

  // CREATE - Post a new destination
  router.post('/', validateDestination, createDestination);

  // READ - Get all destinations with filters
  router.get('/', getAllDestinations);

  // READ - Get destination by ID
  router.get('/:id', getDestinationById);

  // UPDATE - Update destination by ID
  router.put('/:id', validateDestination, updateDestination);

  // DELETE - Delete destination by ID
  router.delete('/:id', deleteDestination);

  app.use('/api/destinations', router);
}

export default router;