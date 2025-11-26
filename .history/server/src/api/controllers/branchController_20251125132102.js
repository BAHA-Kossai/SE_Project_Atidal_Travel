/**
 * @file        branchController.js
 */

import supabase from '../../config/supabase.js';
import BranchesRepository from '../../repositories/branchRepository.js';
import { CreateBranchUseCase } from '../../core/usecases/branches/CreateBranchUseCase.js';
import { GetAllBranchesUseCase } from '../../core/usecases/branches/GetAllBranchesUseCase.js';
import { GetBranchUseCase } from '../../core/usecases/branches/GetBranchUseCase.js';
import { UpdateBranchUseCase } from '../../core/usecases/branches/UpdateBranchUseCase.js';
import { DeleteBranchUseCase } from '../../core/usecases/branches/DeleteBranchUseCase.js';

const branchRepository = new BranchesRepository(supabase);

const sendResponse = (res, result, defaultSuccessStatus = 200) => {
  if (result.success) {
    const status = result.status || defaultSuccessStatus;
    return res.status(status).json({ success: true, data: result.data });
  }

  const status = result.status || 400;
  return res.status(status).json({
    success: false,
    error: result.error || 'Unexpected error'
  });
};

export const createBranch = async (req, res) => {
  try {
    const useCase = new CreateBranchUseCase({ branchRepository });
    const result = await useCase.execute(req.body);
    return sendResponse(res, result, 201);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllBranches = async (req, res) => {
  try {
    const useCase = new GetAllBranchesUseCase({ branchRepository });
    const result = await useCase.execute({
      city: req.query.city,
      is_active: req.query.active,
      limit: req.query.limit,
      offset: req.query.offset
    });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getBranchById = async (req, res) => {
  try {
    const useCase = new GetBranchUseCase({ branchRepository });
    const result = await useCase.execute({ branchId: req.params.id });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const useCase = new UpdateBranchUseCase({ branchRepository });
    const result = await useCase.execute({
      branchId: req.params.id,
      updates: req.body
    });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const useCase = new DeleteBranchUseCase({ branchRepository });
    const result = await useCase.execute({ branchId: req.params.id });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
