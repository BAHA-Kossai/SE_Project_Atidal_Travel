const BLOCKING_STATUSES = ['pending', 'confirmed'];

export class DeleteGuidedTripUseCase {
  constructor({ guidedTripsRepository, bookingsRepository }) {
    this.guidedTripsRepository = guidedTripsRepository;
    this.bookingsRepository = bookingsRepository;
  }

  async execute({ tripId }) {
    try {
      const trip = await this.guidedTripsRepository.getTripById(tripId);
      if (!trip) {
        return { success: false, error: 'Guided trip not found', status: 404 };
      }

      const bookings = await this.bookingsRepository.getBookingsByTrip(tripId);
      const hasBlockingBooking = bookings.some((booking) =>
        BLOCKING_STATUSES.includes(booking.booking_status)
      );
      if (hasBlockingBooking) {
        return {
          success: false,
          error:
            'Trip cannot be deleted while it has pending or confirmed bookings',
          status: 409
        };
      }

      await this.guidedTripsRepository.deleteTrip(tripId);
      return { success: true, data: { message: 'Guided trip deleted' } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default DeleteGuidedTripUseCase;

