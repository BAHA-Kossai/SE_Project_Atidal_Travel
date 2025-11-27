import validator from 'validator';

const BOOKING_TYPES = ['guided_trip', 'umrah', 'custom_destination'];
const VALID_GENDERS = ['male', 'female', 'other'];

const validateTraveler = (traveler, index, errors) => {
  const fields = [
    'first_name',
    'last_name',
    'email',
    'phone',
    'passport_number',
    'gender'
  ];

  fields.forEach((field) => {
    if (!traveler[field]) {
      errors.push(`traveler[${index}].${field} is required`);
    }
  });

  if (traveler.email && !validator.isEmail(traveler.email)) {
    errors.push(`traveler[${index}].email must be valid`);
  }

  if (
    traveler.phone &&
    !validator.isMobilePhone(traveler.phone, 'any', { strictMode: false })
  ) {
    errors.push(`traveler[${index}].phone must be a valid phone number`);
  }

  if (
    traveler.gender &&
    !VALID_GENDERS.includes(traveler.gender.toLowerCase())
  ) {
    errors.push(
      `traveler[${index}].gender must be one of: ${VALID_GENDERS.join(', ')}`
    );
  }
};

export const validateBookingInput = (input, { isUpdate = false } = {}) => {
  const errors = [];

  if (!isUpdate) {
    if (!input.booking_type || !BOOKING_TYPES.includes(input.booking_type)) {
      errors.push(
        `booking_type must be one of: ${BOOKING_TYPES.join(', ')}`
      );
    }
  }

  if (!isUpdate) {
    if (!input.payer) {
      errors.push('payer is required');
    } else {
      const { first_name, last_name, email, phone, password } = input.payer;
      if (!first_name || !last_name || !email || !phone || !password) {
        errors.push(
          'payer first_name, last_name, email, phone, and password are required'
        );
      }

      if (email && !validator.isEmail(email)) {
        errors.push('payer.email must be a valid email');
      }

      if (
        phone &&
        !validator.isMobilePhone(phone, 'any', { strictMode: false })
      ) {
        errors.push('payer.phone must be a valid phone number');
      }

      if (password && password.length < 8) {
        errors.push('payer.password must be at least 8 characters');
      }
    }
  }

  if (!isUpdate) {
    if (!input.responsible_traveler) {
      errors.push('responsible_traveler is required');
    } else {
      validateTraveler(input.responsible_traveler, 'responsible', errors);
    }
  }

  if (
    !isUpdate &&
    (!Array.isArray(input.other_travelers) ||
      input.other_travelers.length === 0)
  ) {
    errors.push('At least one traveler must be provided in other_travelers');
  }

  if (Array.isArray(input.other_travelers)) {
    input.other_travelers.forEach((traveler, index) => {
      validateTraveler(traveler, index, errors);
    });
  }

  if (
    input.booking_type === 'custom_destination' &&
    (!input.destination_info ||
      !input.destination_info.destination_city ||
      !input.destination_info.duration_days)
  ) {
    errors.push(
      'destination_info.destination_city and destination_info.duration_days are required for custom destinations'
    );
  }

  if (
    input.destination_info?.duration_days !== undefined &&
    Number(input.destination_info.duration_days) <= 0
  ) {
    errors.push('destination_info.duration_days must be greater than 0');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

