/**
 * @file        destinationsRoutes.js
 * @description Defines Express routes for destinations endpoints.
 *              Routes map HTTP endpoints to controller methods.
 *
 * @requires    express               - Express framework
 * @requires    destinationsController - Controller handling destination operations
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

import express from 'express';
import destinationsController from '../controllers/destinationsController.js';

const router = express.Router();

router.get('/', destinationsController.getAllDestinations);
router.get('/featured', destinationsController.getFeaturedDestinations);
router.get('/search', destinationsController.searchDestinations);

export default router;