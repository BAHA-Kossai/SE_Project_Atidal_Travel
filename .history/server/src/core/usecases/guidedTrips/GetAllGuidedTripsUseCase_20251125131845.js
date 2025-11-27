export class GetAllGuidedTripsUseCase {
  constructor({ guidedTripsRepository }) {
    this.guidedTripsRepository = guidedTripsRepository;
  }

  async execute({ limit = 10, offset = 0, min_seats } = {}) {
    try {
      let trips = await this.guidedTripsRepository.getAllTrips();
      if (min_seats !== undefined) {
        trips = trips.filter(
          (trip) =>
            Number(trip.available_seats ?? trip.max_seats ?? 0) >=
            Number(min_seats)
        );
      }

      const start = Number(offset);
      const end = start + Number(limit);
      const paginated = trips.slice(start, end);

      return {
        success: true,
        data: {
          trips: paginated,
          total: trips.length,
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

