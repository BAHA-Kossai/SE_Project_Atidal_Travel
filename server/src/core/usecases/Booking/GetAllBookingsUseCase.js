export class GetAllBookingsUseCase {
  constructor({ bookingRepository, tripInfoRepository }) {
    this.bookingRepository = bookingRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute(filters = {}) {
    try {
      const limit = Number(filters.limit) || 10;
      const offset = Number(filters.offset) || 0;

      const result = await this.bookingRepository.filterBookings({
        user_id: filters.user_id,
        status: filters.status,
        branch_id: filters.branch_id,
        date_from: filters.date_from,
        date_to: filters.date_to,
        limit,
        offset
      });

      const tripInfoIds = result.data
        .map((booking) => booking.info_id)
        .filter(Boolean);
      const tripInfos = await this.tripInfoRepository.getTripInfosByIds(
        [...new Set(tripInfoIds)]
      );
      const tripInfoMap = tripInfos.reduce((acc, info) => {
        acc[info.info_id ?? info.trip_info_id] = info;
        return acc;
      }, {});

      const decorated = result.data.map((booking) => ({
        ...booking,
        trip_info: tripInfoMap[booking.info_id] || null
      }));

      return {
        success: true,
        data: {
          bookings: decorated,
          total: result.total,
          limit,
          offset
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetAllBookingsUseCase;

