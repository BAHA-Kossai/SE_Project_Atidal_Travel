import validator from 'validator';
import { validateTripInfoPayload } from './tripInfoValidator.js';

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];
const VALID_GENDERS = ['male', 'female'];
const PASSPORT_REGEX = /^[A-Z]{3}-[A-Z0-9]{7}$/i;

export const validateBookingInput = (input, { isUpdate = false } = {}) => {
  const errors = [];
  const payload = { ...input };

  if (!isUpdate && !payload.info_id && !payload.trip_info) {
    errors.push('Either info_id or trip_info must be provided');
  }

  if (payload.info_id && Number.isNaN(Number(payload.info_id))) {
    errors.push('info_id must be numeric');
  }

  if (payload.trip_info) {
    const {
      valid,
      errors: tripErrors,
      payload: tripInfoPayload
    } = validateTripInfoPayload(payload.trip_info, { isUpdate });
    if (!valid) {
      errors.push(...tripErrors.map((err) => `trip_info.${err}`));
    } else {
      payload.trip_info = tripInfoPayload;
    }
  }

  if (
    payload.booking_status &&
    !VALID_STATUSES.includes(payload.booking_status)
  ) {
    errors.push(
      `booking_status must be one of: ${VALID_STATUSES.join(', ')}`
    );
  }

  if (payload.needs_visa_assistance !== undefined) {
    const normalized =
      typeof payload.needs_visa_assistance === 'boolean'
        ? payload.needs_visa_assistance
        : payload.needs_visa_assistance === 'true'
          ? true
          : payload.needs_visa_assistance === 'false'
            ? false
            : undefined;
    if (normalized === undefined) {
      errors.push('needs_visa_assistance must be boolean');
    } else {
      payload.needs_visa_assistance = normalized;
    }
  }

  validatePayer(payload.payer, errors, { isUpdate });
  validateTravelers(payload.travelers, errors, { isUpdate });

  return {
    valid: errors.length === 0,
    errors,
    payload
  };
};

const validatePayer = (payer, errors, { isUpdate }) => {
  if (!payer) {
    if (!isUpdate) {
      errors.push('payer is required');
    }
    return;
  }

  ['first_name', 'last_name', 'phone'].forEach((field) => {
    if (!isUpdate && !payer[field]) {
      errors.push(`payer.${field} is required`);
    }
  });

  if (payer.phone && !validator.isMobilePhone(payer.phone, 'any')) {
    errors.push('payer.phone must be a valid phone number');
  }

  ['confirmed_at', 'cancelled_at', 'created_at'].forEach((field) => {
    if (payer[field] && !validator.isISO8601(payer[field])) {
      errors.push(`payer.${field} must be a valid timestamp`);
    }
  });
};

const validateTravelers = (travelers, errors, { isUpdate }) => {
  if (!Array.isArray(travelers)) {
    if (!isUpdate) {
      errors.push('travelers must be an array');
    }
    return;
  }

  if (!isUpdate && travelers.length === 0) {
    errors.push('At least one traveler is required');
  }

  travelers.forEach((traveler, index) => {
    const label = `travelers[${index}]`;
    ['first_name', 'last_name', 'age', 'email', 'identity_number', 'traveler_contact', 'passport_number', 'gender'].forEach(
      (field) => {
        if (!isUpdate && !traveler[field]) {
          errors.push(`${label}.${field} is required`);
        }
      }
    );

    if (traveler.email && !validator.isEmail(traveler.email)) {
      errors.push(`${label}.email must be valid`);
    }

    if (
      traveler.traveler_contact &&
      !validator.isMobilePhone(traveler.traveler_contact, 'any')
    ) {
      errors.push(`${label}.traveler_contact must be a valid phone`);
    }

    if (
      traveler.gender &&
      !VALID_GENDERS.includes(traveler.gender.toLowerCase())
    ) {
      errors.push(`${label}.gender must be male or female`);
    }

    if (
      traveler.passport_number &&
      !PASSPORT_REGEX.test(traveler.passport_number)
    ) {
      errors.push(
        `${label}.passport_number must match format XXX-XXXXXXX`
      );
    }

    if (
      traveler.age !== undefined &&
      (Number.isNaN(Number(traveler.age)) || Number(traveler.age) <= 0)
    ) {
      errors.push(`${label}.age must be a positive number`);
    }
  });
};

