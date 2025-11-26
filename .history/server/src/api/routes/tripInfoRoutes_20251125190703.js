import express from 'express';
import {
  createTripInfo,
  getTripInfos,
  getTripInfoById,
  updateTripInfo,
  deleteTripInfo
} from '../controllers/tripInfoController.js';

const router = express.Router();

router.get('/', getTripInfos);
router.get('/:id', getTripInfoById);
router.post('/', createTripInfo);
router.put('/:id', updateTripInfo);
router.delete('/:id', deleteTripInfo);

export const setupTripInfoRoutes = (app) => {
  app.use('/api/trip-info', router);
};

export default router;

