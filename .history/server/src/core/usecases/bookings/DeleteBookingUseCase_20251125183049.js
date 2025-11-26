export class DeleteBookingUseCase {
  constructor({
    bookingRepository,
    payerRepository,
    travelerRepository,
    statusHistoryRepository,
    tripInfoRepository
  }) {
    this.bookingRepository = bookingRepository;
    this.payerRepository = payerRepository;
    this.travelerRepository = travelerRepository;
    this.statusHistoryRepository = statusHistoryRepository;
    this.tripInfoRepository = tripInfoRepository;
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

      const travelers = await this.travelerRepository.getTravlersByBooking(
        bookingId
      );
      for (const traveler of travelers) {
        await this.travelerRepository.deleteTravler(traveler.travler_id);
      }

      const payer = await this.payerRepository.getByBookingId(bookingId);
      if (payer) {
        await this.payerRepository.deletePayer(payer.payer_id);
      }

      await this.statusHistoryRepository.deleteByBooking(bookingId);
      await this.bookingRepository.deleteBooking(bookingId);

      if (booking.trip_info_id && travelers.length > 0) {
        await this.tripInfoRepository.adjustAvailableSeats(
          booking.trip_info_id,
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

