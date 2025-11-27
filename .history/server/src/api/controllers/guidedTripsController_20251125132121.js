

import supabase from '../../config/supabase.js';
import GuidedTripsRepository from '../../repositories/GuidedTrips.js';
import DestinationsRepository from '../../repositories/DestinationsRepository.js';
import GuideRepository from '../../repositories/GuideRepository.js';
import BookingsRepository from '../../repositories/BookingsRepository.js';
import { CreateGuidedTripUseCase } from '../../core/usecases/guidedTrips/CreateGuidedTripUseCase.js';
import { UpdateGuidedTripUseCase } from '../../core/usecases/guidedTrips/UpdateGuidedTripUseCase.js';
import { DeleteGuidedTripUseCase } from '../../core/usecases/guidedTrips/DeleteGuidedTripUseCase.js';
import { GetGuidedTripUseCase } from '../../core/usecases/guidedTrips/GetGuidedTripUseCase.js';
import { GetAllGuidedTripsUseCase } from '../../core/usecases/guidedTrips/GetAllGuidedTripsUseCase.js';
import { SearchGuidedTripsUseCase } from '../../core/usecases/guidedTrips/SearchGuidedTripsUseCase.js';

const guidedTripsRepository = new GuidedTripsRepository(supabase);
const destinationsRepository = new DestinationsRepository(supabase);
const guideRepository = new GuideRepository(supabase);
const bookingsRepository = new BookingsRepository(supabase);

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

export const getAllGuidedTrips = async (req, res) => {
  try {
    const useCase = new GetAllGuidedTripsUseCase({ guidedTripsRepository });
    const result = await useCase.execute({
      limit: req.query.limit,
      offset: req.query.offset,
      min_seats: req.query.min_seats
    });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const searchGuidedTrips = async (req, res) => {
  try {
    const useCase = new SearchGuidedTripsUseCase({ guidedTripsRepository });
    const availability =
      req.query.availability ?? req.query.only_available ?? undefined;
    const result = await useCase.execute({
      destination_id: req.query.destination_id,
      guide_id: req.query.guide_id,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      min_price: req.query.min_price,
      max_price: req.query.max_price,
      only_available: availability,
      sort_by: req.query.sort_by,
      sort_order: req.query.sort_order,
      limit: req.query.limit,
      offset: req.query.offset
    });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getGuidedTripById = async (req, res) => {
  try {
    const useCase = new GetGuidedTripUseCase({ guidedTripsRepository });
    const result = await useCase.execute({ tripId: req.params.id });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const createGuidedTrip = async (req, res) => {
  try {
    const useCase = new CreateGuidedTripUseCase({
      guidedTripsRepository,
      destinationsRepository,
      guideRepository
    });
    const result = await useCase.execute(req.body);
    return sendResponse(res, result, 201);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateGuidedTrip = async (req, res) => {
  try {
    const useCase = new UpdateGuidedTripUseCase({
      guidedTripsRepository,
      destinationsRepository,
      guideRepository
    });
    const result = await useCase.execute({
      tripId: req.params.id,
      updates: req.body
    });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteGuidedTrip = async (req, res) => {
  try {
    const useCase = new DeleteGuidedTripUseCase({
      guidedTripsRepository,
      bookingsRepository
    });
    const result = await useCase.execute({ tripId: req.params.id });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
