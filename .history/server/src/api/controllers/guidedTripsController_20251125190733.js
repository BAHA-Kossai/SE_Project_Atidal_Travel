import path from 'path';
import supabase from '../../config/supabase.js';
import GuidedTripsRepository from '../../repositories/GuidedTrips.js';
import BookingsRepository from '../../repositories/BookingsRepository.js';
import TripInfoRepository from '../../repositories/TripInfoRepository.js';
import { CreateGuidedTripUseCase } from '../../core/usecases/guidedTrips/CreateGuidedTripUseCase.js';
import { UpdateGuidedTripUseCase } from '../../core/usecases/guidedTrips/UpdateGuidedTripUseCase.js';
import { DeleteGuidedTripUseCase } from '../../core/usecases/guidedTrips/DeleteGuidedTripUseCase.js';
import { GetGuidedTripUseCase } from '../../core/usecases/guidedTrips/GetGuidedTripUseCase.js';
import { GetAllGuidedTripsUseCase } from '../../core/usecases/guidedTrips/GetAllGuidedTripsUseCase.js';
import { SearchGuidedTripsUseCase } from '../../core/usecases/guidedTrips/SearchGuidedTripsUseCase.js';

const guidedTripsRepository = new GuidedTripsRepository(supabase);
const bookingsRepository = new BookingsRepository(supabase);
const tripInfoRepository = new TripInfoRepository(supabase);

const normalizePath = (filePath) => {
  if (!filePath) return null;
  return path.relative(process.cwd(), filePath).replace(/\\/g, '/');
};

const buildGuidedTripPayload = (req) => {
  const payload = { ...req.body };
  const coverImage = req.files?.cover_image?.[0];

  if (coverImage) {
    payload.image_path = normalizePath(coverImage.path);
  }

  if (typeof payload.trip_info === 'string') {
    try {
      payload.trip_info = JSON.parse(payload.trip_info);
    } catch (error) {
      // leave as-is, validator will handle invalid JSON
    }
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

export const getAllGuidedTrips = async (req, res) => {
  try {
    const useCase = new GetAllGuidedTripsUseCase({
      guidedTripsRepository,
      tripInfoRepository
    });
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
    const useCase = new SearchGuidedTripsUseCase({
      guidedTripsRepository,
      tripInfoRepository
    });
    const availability =
      req.query.availability ?? req.query.only_available ?? undefined;
    const result = await useCase.execute({
      destination_country: req.query.destination_country,
      destination_city: req.query.destination_city,
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
    const useCase = new GetGuidedTripUseCase({
      guidedTripsRepository,
      tripInfoRepository
    });
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
      tripInfoRepository
    });
    const payload = buildGuidedTripPayload(req);
    const result = await useCase.execute(payload);
    return sendResponse(res, result, 201);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateGuidedTrip = async (req, res) => {
  try {
    const useCase = new UpdateGuidedTripUseCase({
      guidedTripsRepository,
      tripInfoRepository
    });
    const result = await useCase.execute({
      tripId: req.params.id,
      updates: buildGuidedTripPayload(req)
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
      bookingsRepository,
      tripInfoRepository
    });
    const result = await useCase.execute({ tripId: req.params.id });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
