/**
 * @file        branchesController.js
 * @description Defines controller functions for handling branches-related requests.
 *              Controllers receive HTTP request data, invoke UseCases, and return JSON results.
 *              No business logic is implemented here.
 *
 * @requires    GetActiveBranchesWithLimitUseCase - Handles active branches retrieval logic
 * @requires    BranchesRepository                - Access to branches database operations
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

import GetActiveBranchesWithLimitUseCase from '../../core/usecases/Branches/GetActiveBranchesWithLimitUseCase.js';
import BranchesRepository from '../../repositories/BranchRepository.js';
import supabase from '../../config/supabase.js';

const branchesRepository = new BranchesRepository(supabase);

class BranchesController {

  async getActiveBranches(req, res) {
    try {
      const { limit } = req.query;
      
      const useCase = new GetActiveBranchesWithLimitUseCase(branchesRepository);
      const activeBranches = await useCase.execute(
        limit ? parseInt(limit) : null
      );
      
      res.json({
        status: "success",
        data: activeBranches,
        message: "Active branches retrieved successfully"
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        data: null,
        message: error.message
      });
    }
  }
}

export default new BranchesController();