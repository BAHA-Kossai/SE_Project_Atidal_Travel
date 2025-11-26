const SORTABLE_FIELDS = ['start_date', 'price', 'duration_days'];

const truthy = (value) =>
  value === true ||
  value === 'true' ||
  value === 1 ||
  value === '1';

export class SearchGuidedTripsUseCase {
  constructor({ guidedTripsRepository }) {
    this.guidedTripsRepository = guidedTripsRepository;
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

      let trips = await this.guidedTripsRepository.getAllTrips();

      if (destination_id) {
        trips = trips.filter(
          (trip) => Number(trip.destination_id) === Number(destination_id)
        );
      }

      if (guide_id) {
        trips = trips.filter(
          (trip) => Number(trip.guide_id) === Number(guide_id)
        );
      }

      if (date_from) {
        trips = trips.filter(
          (trip) => new Date(trip.start_date) >= new Date(date_from)
        );
      }

      if (date_to) {
        trips = trips.filter(
          (trip) => new Date(trip.end_date) <= new Date(date_to)
        );
      }

      if (min_price !== undefined) {
        trips = trips.filter(
          (trip) => Number(trip.price) >= Number(min_price)
        );
      }

      if (max_price !== undefined) {
        trips = trips.filter(
          (trip) => Number(trip.price) <= Number(max_price)
        );
      }

    if (only_available !== undefined && truthy(only_available)) {
        trips = trips.filter(
          (trip) =>
            Number(trip.available_seats ?? trip.max_seats ?? 0) > 0
        );
      }

      if (sort_by && SORTABLE_FIELDS.includes(sort_by)) {
        trips = trips.sort((a, b) => {
          const aValue = a[sort_by] ?? 0;
          const bValue = b[sort_by] ?? 0;
          if (aValue === bValue) return 0;
          if (sort_order === 'desc') {
            return aValue < bValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
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

export default SearchGuidedTripsUseCase;

