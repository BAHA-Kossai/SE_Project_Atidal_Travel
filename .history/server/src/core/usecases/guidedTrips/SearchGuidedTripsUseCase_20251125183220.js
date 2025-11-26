const SORTABLE_FIELDS = ['trip_date', 'price'];

const truthy = (value) =>
  value === true || value === 'true' || value === 1 || value === '1';

export class SearchGuidedTripsUseCase {
  constructor({ guidedTripsRepository, tripInfoRepository }) {
    this.guidedTripsRepository = guidedTripsRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute({
    destination_id,
    guide_id,
    date_from,
    date_to,
    min_price,
    max_price,
    only_available,
    sort_by,
    sort_order = 'asc',
    limit = 10,
    offset = 0
  } = {}) {
    try {
      if (sort_by && !SORTABLE_FIELDS.includes(sort_by)) {
        return {
          success: false,
          error: `sort_by must be one of: ${SORTABLE_FIELDS.join(', ')}`,
          status: 400
        };
      }

      const trips = await this.guidedTripsRepository.getAllTrips();
      const tripById = trips.reduce((acc, trip) => {
        acc[trip.trip_id] = trip;
        return acc;
      }, {});
      const tripIds = trips.map((trip) => trip.trip_id);
      const departures = await this.tripInfoRepository.getTripInfosByTripIds(
        tripIds
      );

      let filteredDepartures = departures;

      if (destination_id) {
        filteredDepartures = filteredDepartures.filter((info) => {
          const parentTrip = tripById[info.guided_trip_id];
          return (
            Number(info.destination_id) === Number(destination_id) ||
            Number(parentTrip?.destination_id) === Number(destination_id)
          );
        });
      }

      if (guide_id) {
        filteredDepartures = filteredDepartures.filter((info) => {
          const parentTrip = tripById[info.guided_trip_id];
          return (
            Number(info.guide_id) === Number(guide_id) ||
            Number(parentTrip?.guide_id) === Number(guide_id)
          );
        });
      }

      if (date_from) {
        const fromDate = new Date(date_from);
        filteredDepartures = filteredDepartures.filter(
          (info) => new Date(info.trip_date) >= fromDate
        );
      }

      if (date_to) {
        const toDate = new Date(date_to);
        filteredDepartures = filteredDepartures.filter(
          (info) => new Date(info.returning_date) <= toDate
        );
      }

      if (min_price !== undefined) {
        filteredDepartures = filteredDepartures.filter(
          (info) => Number(info.price) >= Number(min_price)
        );
      }

      if (max_price !== undefined) {
        filteredDepartures = filteredDepartures.filter(
          (info) => Number(info.price) <= Number(max_price)
        );
      }

      if (only_available !== undefined && truthy(only_available)) {
        filteredDepartures = filteredDepartures.filter(
          (info) => Number(info.available_seats ?? 0) > 0
        );
      }

      if (sort_by) {
        filteredDepartures = filteredDepartures.sort((a, b) => {
          const aValue = a[sort_by] ?? 0;
          const bValue = b[sort_by] ?? 0;
          if (aValue === bValue) return 0;
          if (sort_order === 'desc') {
            return aValue < bValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      const departuresByTrip = filteredDepartures.reduce((acc, info) => {
        if (!info.guided_trip_id) {
          return acc;
        }
        if (!acc[info.guided_trip_id]) {
          acc[info.guided_trip_id] = [];
        }
        acc[info.guided_trip_id].push(info);
        return acc;
      }, {});

      const matchingTrips = trips
        .map((trip) => ({
          ...trip,
          departures: departuresByTrip[trip.trip_id] || []
        }))
        .filter((trip) => trip.departures.length > 0);

      const start = Number(offset);
      const end = start + Number(limit);
      const paginated = matchingTrips.slice(start, end);

      return {
        success: true,
        data: {
          trips: paginated,
          total: matchingTrips.length,
          limit: Number(limit),
          offset: Number(offset)
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default SearchGuidedTripsUseCase;

