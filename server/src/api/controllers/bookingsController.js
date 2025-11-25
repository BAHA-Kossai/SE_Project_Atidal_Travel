import CreateBookingUseCase from '../../core/usecases/Booking/CreateBookingUseCase.js';
import GetUserBookingsUseCase from '../../core/usecases/Booking/GetUserBookingsUseCase.js';
import GetBookingsByTypeUseCase from '../../core/usecases/Booking/GetBookingsByTypeUseCase.js';
import BookingsRepository from '../../repositories/BookingsRepository.js';
import PayerRepository from '../../repositories/PayerRepository.js';
import TravelersRepository from '../../repositories/TravelersRepository.js';
import supabase from '../../config/supabase.js';

const bookingsRepository = new BookingsRepository(supabase);
const payerRepository = new PayerRepository(supabase);
const travelersRepository = new TravelersRepository(supabase);

class BookingsController {
  async createBooking(req, res) {
    try {
      const useCase = new CreateBookingUseCase(
        bookingsRepository, 
        payerRepository, 
        travelersRepository
      );
      
      const result = await useCase.execute(req.body);
      
      res.status(201).json({
        status: "success",
        data: result,
        message: "Booking created successfully with payer and traveler information"
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

  async getBookingsByType(req, res) {
    try {
      const { type } = req.params;
      const { status, limit } = req.query;
      
      const useCase = new GetBookingsByTypeUseCase(bookingsRepository);
      const bookings = await useCase.execute(
        type, 
        status || 'draft', 
        limit ? parseInt(limit) : null
      );
      
      res.json({
        status: "success",
        data: bookings,
        message: `Bookings of type ${type} retrieved successfully`
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