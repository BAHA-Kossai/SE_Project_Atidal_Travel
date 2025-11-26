const BLOCKING_STATUSES = ['pending', 'confirmed'];

export class DeleteGuidedTripUseCase {
  constructor({
    guidedTripsRepository,
    bookingsRepository,
    tripInfoRepository
  }) {
    this.guidedTripsRepository = guidedTripsRepository;
    this.bookingsRepository = bookingsRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute({ tripId }) {
    try {
      const trip = await this.guidedTripsRepository.getTripById(tripId);
      if (!trip) {
        return { success: false, error: 'Guided trip not found', status: 404 };
      }

      const tripInfos = await this.tripInfoRepository.getTripInfosByGuidedTrip(
        tripId
      );

      if (tripInfos.length > 0) {
        const bookings = await this.bookingsRepository.findBookingsByTripInfoIds(
          tripInfos.map((info) => info.trip_info_id)
        );
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
      }

      for (const info of tripInfos) {
        await this.tripInfoRepository.deleteTripInfo(info.trip_info_id);
      }

      await this.guidedTripsRepository.deleteTrip(tripId);
      return { success: true, data: { message: 'Guided trip deleted' } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default DeleteGuidedTripUseCase;

