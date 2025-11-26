import AssignBranchUseCase from "../../core/usecases/bookings/AssignBranchUseCase.js";
import UpdateBookingStatusUseCase from "../../core/usecases/bookings/UpdateBookingStatusUseCase.js";
import CreateBookingUseCase from "../../core/usecases/CreateBookingUseCase.js";
import GetUserBookingsUseCase from "../../core/usecases/GetUserBookingsUseCase.js";
import BookingsRepository from "../../repositories/BookingsRepository.js";
import BranchRepository from "../../repositories/branchRepository.js";
import supabase from "../../config/supabase.js";

const bookingsRepository = new BookingsRepository(supabase);

class BookingsController {
  async createBooking(req, res) {
    try {
      const useCase = new CreateBookingUseCase(bookingsRepository);
      const newBooking = await useCase.execute(req.body);

      res.status(201).json({
        status: "success",
        data: newBooking,
        message: "Booking created successfully",
      });
    } catch (error) {
      res.status(500).json({
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
