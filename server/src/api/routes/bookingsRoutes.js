import express from 'express';
import bookingsController from '../controllers/bookingsController.js';

const router = express.Router();

router.post('/', bookingsController.createBooking);
router.get('/user/:userId', bookingsController.getUserBookings);

export default router;