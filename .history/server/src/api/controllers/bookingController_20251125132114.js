
import supabase from '../../config/supabase.js';
import BookingsRepository from '../../repositories/BookingsRepository.js';
import PayersRepository from '../../repositories/PayersRepository.js';
import TravlersRepository from '../../repositories/TravlerRepository.js';
import BookingStatusHistoryRepository from '../../repositories/BookingStatusHistoryRepository.js';
import GuidedTripsRepository from '../../repositories/GuidedTrips.js';
import DestinationsRepository from '../../repositories/DestinationsRepository.js';
import { CreateBookingUseCase } from '../../core/usecases/bookings/CreateBookingUseCase.js';
import { UpdateBookingUseCase } from '../../core/usecases/bookings/UpdateBookingUseCase.js';
import { DeleteBookingUseCase } from '../../core/usecases/bookings/DeleteBookingUseCase.js';
import { GetBookingUseCase } from '../../core/usecases/bookings/GetBookingUseCase.js';
import { GetAllBookingsUseCase } from '../../core/usecases/bookings/GetAllBookingsUseCase.js';
import { GetBookingByStatusUseCase } from '../../core/usecases/bookings/GetBookingByStatusUseCase.js';

const bookingRepository = new BookingsRepository(supabase);
const payerRepository = new PayersRepository(supabase);
const travelerRepository = new TravlersRepository(supabase);
const statusHistoryRepository = new BookingStatusHistoryRepository(supabase);
const guidedTripsRepository = new GuidedTripsRepository(supabase);
const destinationsRepository = new DestinationsRepository(supabase);

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

export const createBooking = async (req, res) => {
  try {
    const useCase = new CreateBookingUseCase({
      bookingRepository,
      payerRepository,
      travelerRepository,
      statusHistoryRepository,
      guidedTripsRepository,
      destinationsRepository
    });
    const payload = {
      ...req.body,
      created_by: req.user?.user_id || req.body.created_by || null
    };
    const result = await useCase.execute(payload);
    return sendResponse(res, result, 201);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const useCase = new GetAllBookingsUseCase({ bookingRepository });
    const result = await useCase.execute({
      created_by: req.query.created_by,
      status: req.query.status,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      limit: req.query.limit,
      offset: req.query.offset
    });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getBookingsByStatus = async (req, res) => {
  try {
    const useCase = new GetBookingByStatusUseCase({ bookingRepository });
    const result = await useCase.execute({ status: req.params.status });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const useCase = new GetBookingUseCase({
      bookingRepository,
      payerRepository,
      travelerRepository,
      statusHistoryRepository,
      guidedTripsRepository,
      destinationsRepository
    });
    const result = await useCase.execute({ bookingId: req.params.id });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const useCase = new UpdateBookingUseCase({
      bookingRepository,
      payerRepository,
      travelerRepository,
      statusHistoryRepository,
      guidedTripsRepository,
      destinationsRepository
    });
    const result = await useCase.execute({
      bookingId: req.params.id,
      updates: req.body,
      currentUserId: req.user?.user_id || null
    });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const useCase = new DeleteBookingUseCase({
      bookingRepository,
      payerRepository,
      travelerRepository,
      statusHistoryRepository,
      guidedTripsRepository
    });
    const result = await useCase.execute({ bookingId: req.params.id });
    return sendResponse(res, result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
