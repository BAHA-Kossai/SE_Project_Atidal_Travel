/**
 * @file        branchController.js
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-18
 */

import BranchesRepository from '../repositories/branchRepository.js';
import supabase from '../../config/supabase.js';
import { ValidationError, ConflictError, NotFoundError, DatabaseError } from '../../utils/errors.js';

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

    // Validation - Business Logic Error
    if (!branch_name || !branch_address || !branch_city || !phone || !email || !manager_name) {
      throw new ValidationError(
        'Missing required fields: branch_name, branch_address, branch_city, phone, email, manager_name'
      );
    }

    // Check if branch name already exists (unique constraint) - Business Logic Error
    const existingBranches = await branchRepo.getAllBranches();
    const duplicate = existingBranches.find(
      b => b.branch_name.toLowerCase() === branch_name.toLowerCase()
    );

    if (duplicate) {
      throw new ConflictError(
        'Branch with this name already exists',
        'branch_name'
      );
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
    // Error will be handled by error middleware
    throw error;
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
    // Error will be handled by error middleware
    throw error;
  }
};

// READ - Get branch by ID
export const getBranchById = async (req, res) => {
  try {
    const branchRepo = new BranchesRepository(supabase);
    const { id } = req.params;

    const branch = await branchRepo.getBranchById(id);

    if (!branch) {
      throw new NotFoundError('Branch', id);
    }

    res.status(200).json({
      success: true,
      message: 'Branch retrieved successfully',
      data: branch
    });
  } catch (error) {
    // Error will be handled by error middleware
    throw error;
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

    // Verify branch exists - Business Logic Error
    const existingBranch = await branchRepo.getBranchById(id);
    if (!existingBranch) {
      throw new NotFoundError('Branch', id);
    }

    // Check if branch name is being changed and if it conflicts with existing name - Business Logic Error
    if (branch_name && branch_name.toLowerCase() !== existingBranch.branch_name.toLowerCase()) {
      const allBranches = await branchRepo.getAllBranches();
      const duplicate = allBranches.find(
        b => b.branch_id !== parseInt(id) && b.branch_name.toLowerCase() === branch_name.toLowerCase()
      );

      if (duplicate) {
        throw new ConflictError(
          'Branch with this name already exists',
          'branch_name'
        );
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
    // Error will be handled by error middleware
    throw error;
  }
};

// DELETE - Delete branch by ID
export const deleteBranch = async (req, res) => {
  try {
    const branchRepo = new BranchesRepository(supabase);
    const { id } = req.params;

    // Verify branch exists - Business Logic Error
    const existingBranch = await branchRepo.getBranchById(id);
    if (!existingBranch) {
      throw new NotFoundError('Branch', id);
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

