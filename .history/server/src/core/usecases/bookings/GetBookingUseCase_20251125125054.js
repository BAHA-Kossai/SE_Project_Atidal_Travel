import { buildBookingResponse } from './helpers.js';

export class GetBookingUseCase {
  constructor({
    bookingRepository,
    payerRepository,
    travelerRepository,
    statusHistoryRepository,
    guidedTripsRepository,
    destinationsRepository
  }) {
    this.bookingRepository = bookingRepository;
    this.payerRepository = payerRepository;
    this.travelerRepository = travelerRepository;
    this.statusHistoryRepository = statusHistoryRepository;
    this.guidedTripsRepository = guidedTripsRepository;
    this.destinationsRepository = destinationsRepository;
  }

  async execute({ bookingId }) {
    try {
      const booking = await this.bookingRepository.getBookingById(bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found', status: 404 };
      }

      const [payer, travelers, history] = await Promise.all([
        this.payerRepository.getByBookingId(bookingId),
        this.travelerRepository.getTravlersByBooking(bookingId),
        this.statusHistoryRepository.getHistoryForBooking(bookingId)
      ]);

      const trip = booking.trip_id
        ? await this.guidedTripsRepository.getTripById(booking.trip_id)
        : null;
      const destination = booking.destination_id
        ? await this.destinationsRepository.getDestinationById(
            booking.destination_id
          )
        : null;

      const aggregated = buildBookingResponse({
        booking,
        payer,
        travelers,
        history,
        trip,
        destination
      });

      return { success: true, data: aggregated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetBookingUseCase;

