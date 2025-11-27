const SORTABLE_FIELDS = ['trip_date', 'price'];

const isTruthy = (value) =>
  value === true || value === 'true' || value === 1 || value === '1';

export class SearchGuidedTripsUseCase {
  constructor({ guidedTripsRepository, tripInfoRepository }) {
    this.guidedTripsRepository = guidedTripsRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute({
    destination_country,
    destination_city,
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
      const infoIds = trips.map((trip) => trip.info_id).filter(Boolean);
      const tripInfos = await this.tripInfoRepository.getTripInfosByIds(
        [...new Set(infoIds)]
      );
      const infoMap = tripInfos.reduce((acc, info) => {
        acc[info.info_id ?? info.trip_info_id] = info;
        return acc;
      }, {});

      let merged = trips
        .map((trip) => ({
          ...trip,
          trip_info: infoMap[trip.info_id] || null
        }))
        .filter((trip) => trip.trip_info);

      if (destination_country) {
        merged = merged.filter((trip) =>
          (trip.trip_info.destination_country || '')
            .toLowerCase()
            .includes(destination_country.toLowerCase())
        );
      }

      if (destination_city) {
        merged = merged.filter((trip) =>
          (trip.trip_info.destination_city || '')
            .toLowerCase()
            .includes(destination_city.toLowerCase())
        );
      }

      if (date_from) {
        const fromDate = new Date(date_from);
        merged = merged.filter(
          (trip) => new Date(trip.trip_info.trip_date) >= fromDate
        );
      }

      if (date_to) {
        const toDate = new Date(date_to);
        merged = merged.filter(
          (trip) => new Date(trip.trip_info.returning_date) <= toDate
        );
      }

      if (min_price !== undefined) {
        merged = merged.filter(
          (trip) => Number(trip.trip_info.price) >= Number(min_price)
        );
      }

      if (max_price !== undefined) {
        merged = merged.filter(
          (trip) => Number(trip.trip_info.price) <= Number(max_price)
        );
      }

      if (only_available !== undefined && isTruthy(only_available)) {
        merged = merged.filter(
          (trip) => Number(trip.available_seats ?? 0) > 0
        );
      }

      if (sort_by) {
        merged = merged.sort((a, b) => {
          const aValue = a.trip_info[sort_by] ?? 0;
          const bValue = b.trip_info[sort_by] ?? 0;
          if (aValue === bValue) return 0;
          if (sort_order === 'desc') {
            return aValue < bValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      const start = Number(offset);
      const end = start + Number(limit);
      const paginated = merged.slice(start, end);

      return {
        success: true,
        data: {
          trips: paginated,
          total: merged.length,
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

