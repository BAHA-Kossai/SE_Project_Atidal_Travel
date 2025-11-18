import CreateBookingUseCase from '../../core/usecases/CreateBookingUseCase.js';
import GetUserBookingsUseCase from '../../core/usecases/GetUserBookingsUseCase.js';
import BookingsRepository from '../../repositories/BookingsRepository.js';
import supabase from '../../config/supabase.js';

const bookingsRepository = new BookingsRepository(supabase);

class BookingsController {
  async createBooking(req, res) {
    try {
      const useCase = new CreateBookingUseCase(bookingsRepository);
      const newBooking = await useCase.execute(req.body);
      
      res.status(201).json({
        status: "success",
        data: newBooking,
        message: "Booking created successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message
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
        message: "User bookings retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message
      });
    }
  }
}

export default new BookingsController();