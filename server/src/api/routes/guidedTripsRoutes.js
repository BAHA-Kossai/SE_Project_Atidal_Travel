/**
 * @file        guidedTripsRoutes.js
 * @description Defines Express routes for guided trips endpoints.
 *              Routes map HTTP endpoints to controller methods.
 *
 * @requires    express                 - Express framework
 * @requires    guidedTripsController   - Controller handling guided trips operations
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

import express from 'express';
import guidedTripsController from '../controllers/guidedTripsController.js';

const router = express.Router();


router.get('/type/:type', guidedTripsController.getTripsByType);

export default router;