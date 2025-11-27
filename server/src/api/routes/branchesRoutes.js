/**
 * @file        branchesRoutes.js
 * @description Defines Express routes for branches endpoints.
 *              Routes map HTTP endpoints to controller methods.
 *
 * @requires    express             - Express framework
 * @requires    branchesController  - Controller handling branch operations
 *
 * @author      Ahlem Toubrient
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

import express from 'express';
import branchesController from '../controllers/branchesController.js';

const router = express.Router();

router.get('/active', branchesController.getActiveBranches);

export default router;