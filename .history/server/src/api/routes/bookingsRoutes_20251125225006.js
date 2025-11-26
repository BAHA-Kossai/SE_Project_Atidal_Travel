/**
 * @file        bookingsRoutes.js
 */

import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingsByStatus,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../controllers/bookingController.js';

const router = express.Router();

router.get('/', getAllBookings);
router.get('/status/:status', getBookingsByStatus);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export const setupBookingRoutes = (app) => {
  app.use('/api/bookings', router);
};

//export default router;

