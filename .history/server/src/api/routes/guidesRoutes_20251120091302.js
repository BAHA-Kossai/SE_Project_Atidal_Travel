/**
 * @file        guidesRoutes.js
 * @description Routes for guide API endpoints
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-19
 */

import express from 'express';
import GuideController from '../controllers/guideController.js';
import { validateGuide } from '../validators/guideValidator.js';

export function setupGuideRoutes(app, supabaseClient) {
  const router = express.Router();
  const guideController = new GuideController(supabaseClient);

  // CREATE - Post a new guide
  router.post('/', validateGuide, (req, res) => {
    guideController.createGuide(req, res);
  });

  // READ - Get all guides with filters
  router.get('/', (req, res) => {
    guideController.getAllGuides(req, res);
  });

  // READ - Get guide by ID
  router.get('/:id', (req, res) => {
    guideController.getGuideById(req, res);
  });

  // UPDATE - Update guide by ID
  router.put('/:id', validateGuide, (req, res) => {
    guideController.updateGuide(req, res);
  });

  // DELETE - Delete guide by ID
  router.delete('/:id', (req, res) => {
    guideController.deleteGuide(req, res);
  });

  app.use('/api/guides', router);
}

export default router;

