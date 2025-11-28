export class DeleteBookingUseCase {
  constructor({
    bookingRepository,
    payerRepository,
    travelerRepository,
    statusHistoryRepository,
    guidedTripsRepository
  }) {
    this.bookingRepository = bookingRepository;
    this.payerRepository = payerRepository;
    this.travelerRepository = travelerRepository;
    this.statusHistoryRepository = statusHistoryRepository;
    this.guidedTripsRepository = guidedTripsRepository;
  }

  async execute({ bookingId }) {
    try {
      const booking = await this.bookingRepository.getBookingById(bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found', status: 404 };
      }

      if (booking.booking_status !== 'pending') {
        return {
          success: false,
          error: 'Only pending bookings can be deleted',
          status: 409
        };
      }

      const guidedTrip = booking.info_id
        ? await this.guidedTripsRepository.getTripByInfoId(booking.info_id)
        : null;

      const travelers = await this.travelerRepository.getTravlersByPayer(
        booking.booking_id
      );
      for (const traveler of travelers) {
        await this.travelerRepository.deleteTravler(
          traveler.traveler_id ?? traveler.travler_id
        );
      }

      const payer = await this.payerRepository.getByBookingId(bookingId);
      if (payer) {
        await this.payerRepository.deletePayer(payer.booking_id);
      }

      await this.statusHistoryRepository.deleteByBooking(bookingId);
      await this.bookingRepository.deleteBooking(bookingId);

      if (guidedTrip && travelers.length > 0) {
        await this.guidedTripsRepository.adjustAvailableSeats(
          guidedTrip.trip_id,
          travelers.length
        );
      }

      return {
        success: true,
        data: { message: 'Booking deleted successfully' }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default DeleteBookingUseCase;

