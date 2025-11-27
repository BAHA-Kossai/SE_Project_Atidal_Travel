/**
 * @file        guidesRoutes.js
 * @description Routes for guide API endpoints
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-22
 */

import express from 'express';
import { createGuide, getAllGuides, getGuideById, updateGuide, deleteGuide } from '../controllers/guideController.js';
import { validateGuide } from '../validators/guideValidator.js';

export function setupGuideRoutes(app, supabaseClient) {
  const router = express.Router();

  // CREATE - Post a new guide
  router.post('/', validateGuide, createGuide);

  // READ - Get all guides with filters
  router.get('/', getAllGuides);

  // READ - Get guide by ID
  router.get('/:id', getGuideById);

  // UPDATE - Update guide by ID
  router.put('/:id', validateGuide, updateGuide);

  // DELETE - Delete guide by ID
  router.delete('/:id', deleteGuide);

  app.use('/api/guides', router);
}

//export default router;

