/**
 * @file        destinationController.js
 */

import path from 'path';
import supabase from '../../config/supabase.js';
import DestinationsRepository from '../../repositories/DestinationsRepository.js';
import { CreateDestinationUseCase } from '../../core/usecases/destinations/CreateDestinationUseCase.js';
import { GetAllDestinationsUseCase } from '../../core/usecases/destinations/GetAllDestinationsUseCase.js';
import { GetDestinationUseCase } from '../../core/usecases/destinations/GetDestinationUseCase.js';
import { UpdateDestinationUseCase } from '../../core/usecases/destinations/UpdateDestinationUseCase.js';
import { DeleteDestinationUseCase } from '../../core/usecases/destinations/DeleteDestinationUseCase.js';

const destinationsRepository = new DestinationsRepository(supabase);

const normalizePath = (filePath) => {
  if (!filePath) return null;
  return path.relative(process.cwd(), filePath).replace(/\\/g, '/');
};

const buildDestinationPayload = (req) => {
  const payload = { ...req.body };

  if (!payload.country && payload.destination_country) {
    payload.country = payload.destination_country;
  }

  if (!payload.city && payload.destination_city) {
    payload.city = payload.destination_city;
  }

  if (!payload.picture_path && payload.destination_pic) {
    payload.picture_path = payload.destination_pic;
  }

  if (req.file) {
    payload.picture_path = normalizePath(req.file.path);
  }

  return payload;
};

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

export const createDestination = async (req, res) => {
  try {
    const useCase = new CreateDestinationUseCase({ destinationsRepository });
    const payload = buildDestinationPayload(req);
    const result = await useCase.execute(payload);
    return sendResponse(res, result, 201);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllDestinations = async (req, res) => {
  try {
    const useCase = new GetAllDestinationsUseCase({ destinationsRepository });
    const result = await useCase.execute({
      city: req.query.city,
      country: req.query.country,
      limit: req.query.limit,
      offset: req.query.offset
    });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getDestinationById = async (req, res) => {
  try {
    const useCase = new GetDestinationUseCase({ destinationsRepository });
    const result = await useCase.execute({ destinationId: req.params.id });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateDestination = async (req, res) => {
  try {
    const useCase = new UpdateDestinationUseCase({ destinationsRepository });
    const payload = buildDestinationPayload(req);
    const result = await useCase.execute({
      destinationId: req.params.id,
      updates: payload
    });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteDestination = async (req, res) => {
  try {
    const useCase = new DeleteDestinationUseCase({ destinationsRepository });
    const result = await useCase.execute({ destinationId: req.params.id });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

