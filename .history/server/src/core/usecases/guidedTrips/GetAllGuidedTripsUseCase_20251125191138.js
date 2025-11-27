export class GetAllGuidedTripsUseCase {
  constructor({ guidedTripsRepository, tripInfoRepository }) {
    this.guidedTripsRepository = guidedTripsRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute({ limit = 10, offset = 0, min_seats } = {}) {
    try {
      let trips = await this.guidedTripsRepository.getAllTrips();
      const infoIds = trips.map((trip) => trip.info_id).filter(Boolean);
      const tripInfos = await this.tripInfoRepository.getTripInfosByIds(
        [...new Set(infoIds)]
      );
      const infoMap = tripInfos.reduce((acc, info) => {
        acc[info.info_id ?? info.trip_info_id] = info;
        return acc;
      }, {});

      const decoratedTrips = trips.map((trip) => ({
        ...trip,
        trip_info: infoMap[trip.info_id] || null
      }));

      let filtered = decoratedTrips;
      if (min_seats !== undefined) {
        filtered = decoratedTrips.filter(
          (trip) => Number(trip.available_seats ?? 0) >= Number(min_seats)
        );
      }

      const start = Number(offset);
      const end = start + Number(limit);
      const paginated = filtered.slice(start, end);

      return {
        success: true,
        data: {
          trips: paginated,
          total: filtered.length,
          limit: Number(limit),
          offset: Number(offset)
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetAllGuidedTripsUseCase;

