/**
 * @file        guideController.js
 */

import supabase from '../../config/supabase.js';
import GuideRepository from '../../repositories/GuideRepository.js';
import { CreateGuideUseCase } from '../../core/usecases/guides/CreateGuideUseCase.js';
import { GetAllGuidesUseCase } from '../../core/usecases/guides/GetAllGuidesUseCase.js';
import { GetGuideUseCase } from '../../core/usecases/guides/GetGuideUseCase.js';
import { UpdateGuideUseCase } from '../../core/usecases/guides/UpdateGuideUseCase.js';
import { DeleteGuideUseCase } from '../../core/usecases/guides/DeleteGuideUseCase.js';

const guideRepository = new GuideRepository(supabase);

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

export const createGuide = async (req, res) => {
  try {
    const useCase = new CreateGuideUseCase({ guideRepository });
    const result = await useCase.execute(req.body);
    return sendResponse(res, result, 201);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllGuides = async (req, res) => {
  try {
    const useCase = new GetAllGuidesUseCase({ guideRepository });
    const result = await useCase.execute({
      last_name: req.query.last_name,
      limit: req.query.limit,
      offset: req.query.offset
    });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getGuideById = async (req, res) => {
  try {
    const useCase = new GetGuideUseCase({ guideRepository });
    const result = await useCase.execute({ guideId: req.params.id });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateGuide = async (req, res) => {
  try {
    const useCase = new UpdateGuideUseCase({ guideRepository });
    const result = await useCase.execute({
      guideId: req.params.id,
      updates: req.body
    });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteGuide = async (req, res) => {
  try {
    const useCase = new DeleteGuideUseCase({ guideRepository });
    const result = await useCase.execute({ guideId: req.params.id });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

