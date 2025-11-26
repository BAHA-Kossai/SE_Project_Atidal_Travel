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
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllGuidedTrips);
router.get('/search', searchGuidedTrips);
router.get('/:id', getGuidedTripById);
router.post(
  '/',
  upload.fields([{ name: 'cover_image', maxCount: 1 }]),
  createGuidedTrip
);
router.put(
  '/:id',
  upload.fields([{ name: 'cover_image', maxCount: 1 }]),
  updateGuidedTrip
);
router.delete('/:id', deleteGuidedTrip);

export const setupGuidedTripsRoutes = (app) => {
  app.use('/api/guided-trips', router);
};

//export default router;

