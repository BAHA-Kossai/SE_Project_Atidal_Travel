import { buildBookingResponse } from './helpers.js';

export class GetBookingUseCase {
  constructor({
    bookingRepository,
    payerRepository,
    travelerRepository,
    statusHistoryRepository,
    guidedTripsRepository,
    tripInfoRepository
  }) {
    this.bookingRepository = bookingRepository;
    this.payerRepository = payerRepository;
    this.travelerRepository = travelerRepository;
    this.statusHistoryRepository = statusHistoryRepository;
    this.guidedTripsRepository = guidedTripsRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute({ bookingId }) {
    try {
      const booking = await this.bookingRepository.getBookingById(bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found', status: 404 };
      }

      const [payer, travelers, history, tripInfo] = await Promise.all([
        this.payerRepository.getByBookingId(bookingId),
        this.travelerRepository.getTravlersByPayer(booking.booking_id),
        this.statusHistoryRepository.getHistoryForBooking(bookingId),
        booking.info_id
          ? this.tripInfoRepository.getTripInfoById(booking.info_id)
          : Promise.resolve(null)
      ]);

      const trip = tripInfo
        ? await this.guidedTripsRepository.getTripByInfoId(booking.info_id)
        : null;

      const aggregated = buildBookingResponse({
        booking,
        payer,
        travelers,
        history,
        trip,
        tripInfo
      });

      return { success: true, data: aggregated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetBookingUseCase;

