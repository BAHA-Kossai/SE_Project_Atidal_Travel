const ALLOWED_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export class GetBookingByStatusUseCase {
  constructor({ bookingRepository, tripInfoRepository }) {
    this.bookingRepository = bookingRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute({ status }) {
    try {
      if (!status || !ALLOWED_STATUSES.includes(status)) {
        return {
          success: false,
          error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
          status: 400
        };
      }

      const bookings = await this.bookingRepository.findBookingsByStatus(
        status
      );
      const tripInfoIds = bookings
        .map((booking) => booking.info_id)
        .filter(Boolean);
      const tripInfos = await this.tripInfoRepository.getTripInfosByIds(
        [...new Set(tripInfoIds)]
      );
      const tripInfoMap = tripInfos.reduce((acc, info) => {
        acc[info.info_id ?? info.trip_info_id] = info;
        return acc;
      }, {});

      const decorated = bookings.map((booking) => ({
        ...booking,
        trip_info: tripInfoMap[booking.info_id] || null
      }));

      return { success: true, data: decorated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetBookingByStatusUseCase;

