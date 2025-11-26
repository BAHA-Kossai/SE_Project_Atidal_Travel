import { validateTripInfoPayload } from './tripInfoValidator.js';

const REQUIRED_FIELDS = ['available_seats', 'description', 'type'];
const ALLOWED_TYPES = ['Umrah', 'Normal'];

export const validateGuidedTripInput = (
  input,
  { isUpdate = false } = {}
) => {
  const errors = [];
  const payload = { ...input };

  if (!isUpdate) {
    REQUIRED_FIELDS.forEach((field) => {
      if (
        payload[field] === undefined ||
        payload[field] === null ||
        payload[field] === ''
      ) {
        errors.push(`${field} is required`);
      }
    });
  }

  if (
    payload.available_seats !== undefined &&
    (Number.isNaN(Number(payload.available_seats)) ||
      Number(payload.available_seats) < 0)
  ) {
    errors.push('available_seats must be a positive number');
  }

  if (payload.type && !ALLOWED_TYPES.includes(payload.type)) {
    errors.push(`type must be one of: ${ALLOWED_TYPES.join(', ')}`);
  }

  if (
    payload.trip_agenda !== undefined &&
    typeof payload.trip_agenda !== 'string'
  ) {
    errors.push('trip_agenda must be text when provided');
  }

  if (payload.trip_info) {
    const { valid, errors: tripInfoErrors } = validateTripInfoPayload(
      payload.trip_info,
      { isUpdate }
    );
    if (!valid) {
      errors.push(...tripInfoErrors.map((err) => `trip_info.${err}`));
    }
  } else if (!payload.info_id && !isUpdate) {
    errors.push('Either info_id or trip_info must be provided');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

