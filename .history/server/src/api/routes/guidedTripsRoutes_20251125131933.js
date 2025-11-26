/**
 * @file        guidedTripsRoutes.js
 */

import express from 'express';
import {
  getAllGuidedTrips,
  searchGuidedTrips,
  getGuidedTripById,
  createGuidedTrip,
  updateGuidedTrip,
  deleteGuidedTrip
} from '../controllers/guidedTripsController.js';

const router = express.Router();

router.get('/', getAllGuidedTrips);
router.get('/search', searchGuidedTrips);
router.get('/:id', getGuidedTripById);
router.post('/', createGuidedTrip);
router.put('/:id', updateGuidedTrip);
router.delete('/:id', deleteGuidedTrip);

export const setupGuidedTripsRoutes = (app) => {
  app.use('/api/guided-trips', router);
};

export default router;

