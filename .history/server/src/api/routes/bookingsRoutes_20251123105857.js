/**
 * @file        bookingsRoutes.js
 * @description Routes for booking API endpoints (Read-only)
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-22
 */

import express from 'express';
import { getAllBookings, getBookingById } from '../controllers/bookingController.js';

export function setupBookingRoutes(app, supabaseClient) {
  const router = express.Router();

  // READ - Get all bookings with filters
  router.get('/', getAllBookings);

  // READ - Get booking by ID
  router.get('/:id', getBookingById);

  app.use('/api/bookings', router);
}

export default router;

