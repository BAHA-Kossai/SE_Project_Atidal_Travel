/**
 * @file        bookingsController.js
 * @description Defines controller functions for handling booking-related requests.
 *              Controllers receive HTTP request data, invoke UseCases, and return JSON results.
 *              No business logic is implemented here.
 *
 * @requires    CreateBookingUseCase    - Handles booking creation logic
 * @requires    GetUserBookingsUseCase  - Handles user bookings retrieval logic
 * @requires    BookingsRepository      - Access to booking database operations
 * @requires    PayerRepository         - Access to payer database operations
 * @requires    TravelersRepository     - Access to travelers database operations
 * @requires    TripInfoRepository      - Access to trip info database operations
 *
 * @author      Ahlem Toubrinet , Kossai baha, Abderahim
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

import AssignBranchUseCase from "../../core/usecases/bookings/AssignBranchUseCase.js";
import UpdateBookingStatusUseCase from "../../core/usecases/bookings/UpdateBookingStatusUseCase.js";
import CreateBookingUseCase from "../../core/usecases/CreateBookingUseCase.js";
import GetUserBookingsUseCase from "../../core/usecases/GetUserBookingsUseCase.js";
import BookingsRepository from "../../repositories/BookingsRepository.js";
import BranchRepository from "../../repositories/branchRepository.js";
import supabase from "../../config/supabase.js";

import CreateBookingUseCase from "../../core/usecases/Booking/CreateBookingUseCase.js";
import GetUserBookingsUseCase from "../../core/usecases/Booking/GetUserBookingsUseCase.js";
import BookingsRepository from "../../repositories/BookingsRepository.js";
import PayerRepository from "../../repositories/PayerRepository.js";
import TravelersRepository from "../../repositories/TravelersRepository.js";
import TripInfoRepository from "../../repositories/TripInfoRepository.js";
import supabase from "../../config/supabase.js";

const bookingsRepository = new BookingsRepository(supabase);
const payerRepository = new PayerRepository(supabase);
const travelersRepository = new TravelersRepository(supabase);
const tripInfoRepository = new TripInfoRepository(supabase);

class BookingsController {
  async createBooking(req, res) {
    try {
      const useCase = new CreateBookingUseCase(
        bookingsRepository,
        payerRepository,
        travelersRepository,
        tripInfoRepository
      );
      const newBooking = await useCase.execute(req.body);
      const result = await useCase.execute(req.body);

      res.status(201).json({
        status: "success",
        data: result,
        message:
          "Booking created successfully with trip info, payer, and traveler information",
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        data: null,
        message: error.message,
      });
    }
  }

  async getUserBookings(req, res) {
    try {
      const { userId } = req.params;

      const { type } = req.query;

      const useCase = new GetUserBookingsUseCase(bookingsRepository);
      const bookings = await useCase.execute(userId, type);

      res.json({
        status: "success",
        data: bookings,
        message: "User bookings retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message,
      });
    }
  }
}

export default new BookingsController();

const branchRepository = new BranchRepository(supabase);

export const assignBranchController = async (req, res) => {
  try {
    const authUser = req.user;
    const { booking_id, branch_id } = req.body;

    if (!booking_id || !branch_id) {
      return res.status(400).json({
        status: "error",
        data: {},
        message: "booking_id and branch_id are required",
      });
    }

    const useCase = new AssignBranchUseCase(
      bookingsRepository,
      branchRepository
    );
    const result = await useCase.execute(authUser, booking_id, branch_id);

    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: {},
      message: err.message || "Something went wrong",
    });
  }
};

export const updateBookingStatusController = async (req, res) => {
  try {
    const authUser = req.user;
    const { booking_id, booking_status } = req.body;

    const useCase = new UpdateBookingStatusUseCase(bookingsRepository);
    const result = await useCase.execute(authUser, booking_id, booking_status);

    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong",
      data: {},
    });
  }
};

