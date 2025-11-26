import validator from 'validator';

const REQUIRED_FIELDS = [
  'price',
  'trip_date',
  'returning_date',
  'departure_time',
  'returning_time',
  'destination_country',
  'destination_city'
];

const normalizeNumber = (value) =>
  value === undefined || value === null || value === ''
    ? undefined
    : Number(value);

const normalizeBoolean = (value) =>
  typeof value === 'boolean'
    ? value
    : value === 'true'
      ? true
      : value === 'false'
        ? false
        : undefined;

export const validateTripInfoPayload = (
  input = {},
  { isUpdate = false } = {}
) => {
  const errors = [];
  const data = { ...input };

  if (!isUpdate) {
    REQUIRED_FIELDS.forEach((field) => {
      if (
        data[field] === undefined ||
        data[field] === null ||
        data[field] === ''
      ) {
        errors.push(`${field} is required`);
      }
    });
  }

  data.price = normalizeNumber(data.price);
  data.hotel_stars = normalizeNumber(data.hotel_stars);

  if (data.price !== undefined && (Number.isNaN(data.price) || data.price <= 0)) {
    errors.push('price must be a positive number');
  }

  if (
    data.hotel_stars !== undefined &&
    (Number.isNaN(data.hotel_stars) ||
      data.hotel_stars < 0 ||
      data.hotel_stars > 5)
  ) {
    errors.push('hotel_stars must be between 0 and 5');
  }

  if (data.trip_date && !validator.isISO8601(data.trip_date)) {
    errors.push('trip_date must be a valid ISO8601 date');
  }

  if (data.returning_date && !validator.isISO8601(data.returning_date)) {
    errors.push('returning_date must be a valid ISO8601 date');
  }

  if (data.trip_date && data.returning_date) {
    const start = new Date(data.trip_date);
    const end = new Date(data.returning_date);
    if (end < start) {
      errors.push('returning_date cannot be before trip_date');
    }
  }

  const departureTime =
    data.departure_time && !data.departure_time.includes('T')
      ? `1970-01-01T${data.departure_time}`
      : data.departure_time;
  const returningTime =
    data.returning_time && !data.returning_time.includes('T')
      ? `1970-01-01T${data.returning_time}`
      : data.returning_time;

  if (departureTime && !validator.isISO8601(departureTime)) {
    errors.push('departure_time must be a valid time (HH:mm:ss)');
  }

  if (returningTime && !validator.isISO8601(returningTime)) {
    errors.push('returning_time must be a valid time (HH:mm:ss)');
  }

  if (data.no_hotel_needed !== undefined) {
    const normalized = normalizeBoolean(data.no_hotel_needed);
    if (normalized === undefined) {
      errors.push('no_hotel_needed must be a boolean');
    } else {
      data.no_hotel_needed = normalized;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    payload: data
  };
};

export default validateTripInfoPayload;

