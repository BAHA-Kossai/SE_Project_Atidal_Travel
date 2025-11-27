/**
 * @file        branchesRoutes.js
 * @description Routes for branch API endpoints
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-20
 */

import express from 'express';
import { createBranch, getAllBranches, getBranchById, updateBranch, deleteBranch } from '../controllers/branchController.js';
import { validateBranch } from '../validators/branchValidator.js';

export function setupBranchRoutes(app, supabaseClient) {
  const router = express.Router();

  // CREATE - Post a new branch
  router.post('/', validateBranch, createBranch);

  // READ - Get all branches with filters
  router.get('/', getAllBranches);

  // READ - Get branch by ID
  router.get('/:id', getBranchById);

  // UPDATE - Update branch by ID
  router.put('/:id', validateBranch, updateBranch);

  // DELETE - Delete branch by ID
  router.delete('/:id', deleteBranch);

  app.use('/api/branches', router);
}

export default router;

