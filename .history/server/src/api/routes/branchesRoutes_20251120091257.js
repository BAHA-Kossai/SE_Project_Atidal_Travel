/**
 * @file        branchesRoutes.js
 * @description Routes for branch API endpoints
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-19
 */

import express from 'express';
import BranchController from '../controllers/branchController.js';
import { validateBranch } from '../validators/branchValidator.js';

export function setupBranchRoutes(app, supabaseClient) {
  const router = express.Router();
  const branchController = new BranchController(supabaseClient);

  // CREATE - Post a new branch
  router.post('/', validateBranch, (req, res) => {
    branchController.createBranch(req, res);
  });

  // READ - Get all branches with filters
  router.get('/', (req, res) => {
    branchController.getAllBranches(req, res);
  });

  // READ - Get branch by ID
  router.get('/:id', (req, res) => {
    branchController.getBranchById(req, res);
  });

  // UPDATE - Update branch by ID
  router.put('/:id', validateBranch, (req, res) => {
    branchController.updateBranch(req, res);
  });

  // DELETE - Delete branch by ID
  router.delete('/:id', (req, res) => {
    branchController.deleteBranch(req, res);
  });

  app.use('/api/branches', router);
}

export default router;

