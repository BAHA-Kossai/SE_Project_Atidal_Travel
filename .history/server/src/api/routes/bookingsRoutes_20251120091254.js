/**
 * @file        bookingsRoutes.js
 * @description Routes for booking API endpoints (Read-only)
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-19
 */

import express from 'express';
import BookingController from '../controllers/bookingController.js';

export function setupBookingRoutes(app, supabaseClient) {
  const router = express.Router();
  const bookingController = new BookingController(supabaseClient);

  // READ - Get all bookings with filters
  router.get('/', (req, res) => {
    bookingController.getAllBookings(req, res);
  });

  // READ - Get booking by ID
  router.get('/:id', (req, res) => {
    bookingController.getBookingById(req, res);
  });

  app.use('/api/bookings', router);
}

export default router;

