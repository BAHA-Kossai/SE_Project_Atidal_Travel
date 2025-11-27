/**
 * @file        branchController.js
 * @description Controller for handling branch API requests
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-18
 */

import BranchesRepository from '../repositories/branchRepository.js';
import supabase from '../../config/supabase.js';

// CREATE - Add a new branch
export const createBranch = async (req, res) => {
  try {
    const branchRepo = new BranchesRepository(supabase);
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

    // Validation
    if (!branch_name || !branch_address || !branch_city || !phone || !email || !manager_name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: branch_name, branch_address, branch_city, phone, email, manager_name'
      });
    }

    // Check if branch name already exists (unique constraint)
    const existingBranches = await branchRepo.getAllBranches();
    const duplicate = existingBranches.find(
      b => b.branch_name.toLowerCase() === branch_name.toLowerCase()
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'Branch with this name already exists',
        data: duplicate
      });
    }

    const branch = await branchRepo.createBranch({
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
      success: true,
      message: 'Branch created successfully',
      data: branch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating branch',
      error: error.message
    });
  }
};

// READ - Get all branches
export const getAllBranches = async (req, res) => {
  try {
    const branchRepo = new BranchesRepository(supabase);
    const { city, active, limit = 10, offset = 0 } = req.query;
    
    let branches;
    
    if (city) {
      branches = await branchRepo.findBranchesByCity(city);
    } else if (active === 'true') {
      branches = await branchRepo.getActiveBranches();
    } else {
      branches = await branchRepo.getAllBranches();
    }

    // Apply pagination
    const paginatedBranches = branches.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    res.status(200).json({
      success: true,
      message: 'Branches retrieved successfully',
      data: paginatedBranches,
      total: branches.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving branches',
      error: error.message
    });
  }
};

// READ - Get branch by ID
export const getBranchById = async (req, res) => {
  try {
    const branchRepo = new BranchesRepository(supabase);
    const { id } = req.params;

    const branch = await branchRepo.getBranchById(id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Branch retrieved successfully',
      data: branch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving branch',
      error: error.message
    });
  }
};

// UPDATE - Update branch by ID
export const updateBranch = async (req, res) => {
  try {
    const branchRepo = new BranchesRepository(supabase);
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

    // Verify branch exists
    const existingBranch = await branchRepo.getBranchById(id);
    if (!existingBranch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    // Check if branch name is being changed and if it conflicts with existing name
    if (branch_name && branch_name.toLowerCase() !== existingBranch.branch_name.toLowerCase()) {
      const allBranches = await branchRepo.getAllBranches();
      const duplicate = allBranches.find(
        b => b.branch_id !== parseInt(id) && b.branch_name.toLowerCase() === branch_name.toLowerCase()
      );

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Branch with this name already exists',
          data: duplicate
        });
      }
    }

    const branch = await branchRepo.updateBranch(id, {
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

    res.status(200).json({
      success: true,
      message: 'Branch updated successfully',
      data: branch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating branch',
      error: error.message
    });
  }
};

// DELETE - Delete branch by ID
export const deleteBranch = async (req, res) => {
  try {
    const branchRepo = new BranchesRepository(supabase);
    const { id } = req.params;

    // Verify branch exists
    const existingBranch = await branchRepo.getBranchById(id);
    if (!existingBranch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    await branchRepo.deleteBranch(id);

    res.status(200).json({
      success: true,
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting branch',
      error: error.message
    });
  }
};

