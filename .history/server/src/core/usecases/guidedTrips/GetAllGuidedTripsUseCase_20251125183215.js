export class GetAllGuidedTripsUseCase {
  constructor({ guidedTripsRepository, tripInfoRepository }) {
    this.guidedTripsRepository = guidedTripsRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute({ limit = 10, offset = 0, min_seats } = {}) {
    try {
      let trips = await this.guidedTripsRepository.getAllTrips();
      const tripIds = trips.map((trip) => trip.trip_id);
      const departures = await this.tripInfoRepository.getTripInfosByTripIds(
        tripIds
      );

      const departuresByTrip = departures.reduce((acc, info) => {
        if (!info.guided_trip_id) {
          return acc;
        }
        if (!acc[info.guided_trip_id]) {
          acc[info.guided_trip_id] = [];
        }
        acc[info.guided_trip_id].push(info);
        return acc;
      }, {});

      const decoratedTrips = trips.map((trip) => ({
        ...trip,
        departures: departuresByTrip[trip.trip_id] || []
      }));

      let filtered = decoratedTrips;
      if (min_seats !== undefined) {
        filtered = decoratedTrips.filter((trip) =>
          (trip.departures || []).some(
            (departure) =>
              Number(departure.available_seats ?? departure.max_seats ?? 0) >=
              Number(min_seats)
          )
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

