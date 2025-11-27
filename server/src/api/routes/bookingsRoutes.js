/**
 * @file        bookingsRoutes.js
 * @description Defines Express routes for bookings endpoints.
 *              Routes map HTTP endpoints to controller methods.
 *
 * @requires    express             - Express framework
 * @requires    bookingsController  - Controller handling booking operations
 *
 * @author      Ahlem Toubrient
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

import express from 'express';
import bookingsController from '../controllers/bookingsController.js';

const router = express.Router();


router.post('/create', bookingsController.createBooking);
router.get('/user/:userId', bookingsController.getUserBookings);


export default router;