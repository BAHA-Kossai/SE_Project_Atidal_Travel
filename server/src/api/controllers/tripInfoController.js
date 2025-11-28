import supabase from '../../config/supabase.js';
import TripInfoRepository from '../../repositories/TripInfoRepository.js';
import GuidedTripsRepository from '../../repositories/GuidedTrips.js';
import DestinationsRepository from '../../repositories/DestinationsRepository.js';
import BranchesRepository from '../../repositories/BranchRepository.js';
import GuideRepository from '../../repositories/GuideRepository.js';
import BookingsRepository from '../../repositories/BookingsRepository.js';
import { CreateTripInfoUseCase } from '../../core/usecases/tripInfo/CreateTripInfoUseCase.js';
import { GetTripInfoUseCase } from '../../core/usecases/tripInfo/GetTripInfoUseCase.js';
import { GetTripInfosUseCase } from '../../core/usecases/tripInfo/GetTripInfosUseCase.js';
import { UpdateTripInfoUseCase } from '../../core/usecases/tripInfo/UpdateTripInfoUseCase.js';
import { DeleteTripInfoUseCase } from '../../core/usecases/tripInfo/DeleteTripInfoUseCase.js';

const tripInfoRepository = new TripInfoRepository(supabase);
const guidedTripsRepository = new GuidedTripsRepository(supabase);
const destinationsRepository = new DestinationsRepository(supabase);
const branchesRepository = new BranchesRepository(supabase);
const guideRepository = new GuideRepository(supabase);
const bookingRepository = new BookingsRepository(supabase);

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

export const createTripInfo = async (req, res) => {
  try {
    const useCase = new CreateTripInfoUseCase({
      tripInfoRepository,
      guidedTripsRepository,
      destinationsRepository,
      branchesRepository,
      guideRepository
    });
    const result = await useCase.execute(req.body);
    return sendResponse(res, result, 201);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getTripInfos = async (req, res) => {
  try {
    const useCase = new GetTripInfosUseCase({ tripInfoRepository });
    const result = await useCase.execute({
      guided_trip_id: req.query.guided_trip_id,
      destination_id: req.query.destination_id,
      branch_id: req.query.branch_id,
      limit: req.query.limit,
      offset: req.query.offset
    });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getTripInfoById = async (req, res) => {
  try {
    const useCase = new GetTripInfoUseCase({
      tripInfoRepository,
      guidedTripsRepository,
      destinationsRepository,
      branchesRepository
    });
    const result = await useCase.execute({ tripInfoId: req.params.id });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTripInfo = async (req, res) => {
  try {
    const useCase = new UpdateTripInfoUseCase({
      tripInfoRepository,
      destinationsRepository,
      branchesRepository,
      guideRepository
    });
    const result = await useCase.execute({
      tripInfoId: req.params.id,
      updates: req.body
    });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteTripInfo = async (req, res) => {
  try {
    const useCase = new DeleteTripInfoUseCase({
      tripInfoRepository,
      bookingRepository
    });
    const result = await useCase.execute({ tripInfoId: req.params.id });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

