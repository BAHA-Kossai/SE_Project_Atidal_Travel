/**
 * @file        BranchesController.js
 * @description Defines controller functions for handling branches-related requests.
 *              Controllers receive HTTP request data, invoke UseCases, and return JSON results.
 *              No business logic is implemented here.
 *
 * @requires    GetActiveBranchesWithLimitUseCase - Handles active branches retrieval logic
 * @requires    BranchesRepository                - Access to branches database operations
 *
 * @author      Ahlem Toubrinet, Abderahim
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

  async createBranch(req, res) {
    try {
      const { 
        branch_name, 
        branch_address, 
        branch_city, 
        phone, 
        email, 
        manager_name, 
        opening_time, 
        closing_time, 
        working_days, 
        is_active 
      } = req.body;

      if (!branch_name || !branch_address || !branch_city || !phone || !email || !manager_name) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: 'Missing required fields: branch_name, branch_address, branch_city, phone, email, manager_name'
        });
      }

      const existingBranches = await branchesRepository.getAllBranches();
      const duplicate = existingBranches.find(
        b => b.branch_name.toLowerCase() === branch_name.toLowerCase()
      );

      if (duplicate) {
        return res.status(409).json({
          status: "error",
          data: null,
          message: 'Branch with this name already exists'
        });
      }

      const branch = await branchesRepository.createBranch({
        branch_name,
        branch_address,
        branch_city,
        phone,
        email,
        manager_name,
        opening_time,
        closing_time,
        working_days,
        is_active: is_active !== undefined ? is_active : true
      });

      res.status(201).json({
        status: "success",
        data: branch,
        message: "Branch created successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message
      });
    }
  }

  async getAllBranches(req, res) {
    try {
      const { city, active, limit = 10, offset = 0 } = req.query;
      
      let branches;
      
      if (city) {
        branches = await branchesRepository.findBranchesByCity(city);
      } else if (active === 'true') {
        branches = await branchesRepository.getActiveBranches();
      } else {
        branches = await branchesRepository.getAllBranches();
      }

      const paginatedBranches = branches.slice(
        parseInt(offset),
        parseInt(offset) + parseInt(limit)
      );

      res.json({
        status: "success",
        data: paginatedBranches,
        total: branches.length,
        message: "Branches retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message
      });
    }
  }

  async getBranchById(req, res) {
    try {
      const { id } = req.params;

      const branch = await branchesRepository.getBranchById(id);

      if (!branch) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "Branch not found"
        });
      }

      res.json({
        status: "success",
        data: branch,
        message: "Branch retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message
      });
    }
  }

  async updateBranch(req, res) {
    try {
      const { id } = req.params;
      const { 
        branch_name, 
        branch_address, 
        branch_city, 
        phone, 
        email, 
        manager_name, 
        opening_time, 
        closing_time, 
        working_days, 
        is_active 
      } = req.body;

      const existingBranch = await branchesRepository.getBranchById(id);
      if (!existingBranch) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "Branch not found"
        });
      }

      if (branch_name && branch_name.toLowerCase() !== existingBranch.branch_name.toLowerCase()) {
        const allBranches = await branchesRepository.getAllBranches();
        const duplicate = allBranches.find(
          b => b.branch_id !== parseInt(id) && b.branch_name.toLowerCase() === branch_name.toLowerCase()
        );

        if (duplicate) {
          return res.status(409).json({
            status: "error",
            data: null,
            message: 'Branch with this name already exists'
          });
        }
      }

      const branch = await branchesRepository.updateBranch(id, {
        branch_name,
        branch_address,
        branch_city,
        phone,
        email,
        manager_name,
        opening_time,
        closing_time,
        working_days,
        is_active
      });

      res.json({
        status: "success",
        data: branch,
        message: "Branch updated successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message
      });
    }
  }

  async deleteBranch(req, res) {
    try {
      const { id } = req.params;

      const existingBranch = await branchesRepository.getBranchById(id);
      if (!existingBranch) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "Branch not found"
        });
      }

      await branchesRepository.deleteBranch(id);

      res.json({
        status: "success",
        data: null,
        message: "Branch deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message
      });
    }
  }
}

export default new BranchesController();