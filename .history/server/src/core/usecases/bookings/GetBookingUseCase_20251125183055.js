import { buildBookingResponse } from './helpers.js';

export class GetBookingUseCase {
  constructor({
    bookingRepository,
    payerRepository,
    travelerRepository,
    statusHistoryRepository,
    guidedTripsRepository,
    destinationsRepository,
    tripInfoRepository
  }) {
    this.bookingRepository = bookingRepository;
    this.payerRepository = payerRepository;
    this.travelerRepository = travelerRepository;
    this.statusHistoryRepository = statusHistoryRepository;
    this.guidedTripsRepository = guidedTripsRepository;
    this.destinationsRepository = destinationsRepository;
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
        this.travelerRepository.getTravlersByBooking(bookingId),
        this.statusHistoryRepository.getHistoryForBooking(bookingId),
        booking.trip_info_id
          ? this.tripInfoRepository.getTripInfoById(booking.trip_info_id)
          : Promise.resolve(null)
      ]);

      const trip =
        tripInfo?.guided_trip_id || booking.trip_id
          ? await this.guidedTripsRepository.getTripById(
              tripInfo?.guided_trip_id || booking.trip_id
            )
          : null;
      const destination = tripInfo?.destination_id
        ? await this.destinationsRepository.getDestinationById(
            tripInfo.destination_id
          )
        : null;

      const aggregated = buildBookingResponse({
        booking,
        payer,
        travelers,
        history,
        trip,
        destination,
        tripInfo
      });

      return { success: true, data: aggregated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetBookingUseCase;

