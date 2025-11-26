import validator from 'validator';

const REQUIRED_FIELDS = [
  'trip_name',
  'destination_id',
  'guide_id',
  'start_date',
  'end_date',
  'price',
  'max_seats',
  'duration_days',
  'hotel_stars',
  'accommodation_type',
  'itinerary',
  'included_meals'
];

export const validateGuidedTripInput = (
  input,
  {
    isUpdate = false,
    existingTrips = [],
    currentTripId = null,
    currentDestinationId = null
  } = {}
) => {
  const errors = [];

  if (!isUpdate) {
    REQUIRED_FIELDS.forEach((field) => {
      if (
        input[field] === undefined ||
        input[field] === null ||
        input[field] === ''
      ) {
        errors.push(`${field} is required`);
      }
    });
  }

  if (input.start_date && !validator.isISO8601(input.start_date)) {
    errors.push('start_date must be a valid ISO8601 date');
  }

  if (input.end_date && !validator.isISO8601(input.end_date)) {
    errors.push('end_date must be a valid ISO8601 date');
  }

  if (input.start_date && input.end_date) {
    const start = new Date(input.start_date);
    const end = new Date(input.end_date);
    if (end < start) {
      errors.push('end_date must be greater than or equal to start_date');
    }
  }

  if (input.price !== undefined && Number(input.price) <= 0) {
    errors.push('price must be greater than 0');
  }

  if (input.max_seats !== undefined && Number(input.max_seats) <= 0) {
    errors.push('max_seats must be greater than 0');
  }

  if (input.duration_days !== undefined && Number(input.duration_days) <= 0) {
    errors.push('duration_days must be greater than 0');
  }

  if (
    input.hotel_stars !== undefined &&
    (Number(input.hotel_stars) < 1 || Number(input.hotel_stars) > 5)
  ) {
    errors.push('hotel_stars must be between 1 and 5');
  }

  if (input.trip_name) {
    const destinationReference =
      input.destination_id ?? currentDestinationId ?? null;
    if (!destinationReference) {
      errors.push(
        'destination_id is required when validating trip_name uniqueness'
      );
    } else {
      const normalizedName = input.trip_name.toLowerCase();
      const duplicate = existingTrips.find(
        (trip) =>
          trip.trip_name?.toLowerCase() === normalizedName &&
          Number(trip.destination_id) === Number(destinationReference) &&
          (!currentTripId || Number(trip.trip_id) !== Number(currentTripId))
      );
      if (duplicate) {
        errors.push('trip_name must be unique per destination');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

