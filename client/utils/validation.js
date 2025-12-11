// utils/validation.js
/**
 * Frontend validation functions that match backend validation rules
 */

/**
 * Validate first name (min 2 characters, letters only)
 */
export const validateFirstName = (firstName) => {
  if (!firstName || typeof firstName !== 'string') return false;
  const trimmed = firstName.trim();
  return trimmed.length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed);
};

/**
 * Validate last name (min 2 characters, letters only)
 */
export const validateLastName = (lastName) => {
  if (!lastName || typeof lastName !== 'string') return false;
  const trimmed = lastName.trim();
  return trimmed.length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed);
};

/**
 * Validate phone number (Algerian format - 10 digits starting with 0)
 */
export const validatePhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.replace(/[\s-]/g, '');
  return /^0\d{9}$/.test(cleanPhone);
};

/**
 * Validate age (must be between 1 and 120)
 */
export const validateAge = (age) => {
  if (!age && age !== 0) return false;
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum >= 1 && ageNum <= 120;
};

/**
 * Validate price (must be positive number)
 */
export const validatePrice = (price) => {
  if (!price && price !== 0) return false;
  const priceNum = parseFloat(price);
  return !isNaN(priceNum) && priceNum >= 0;
};

/**
 * Validate date (must be valid date string)
 */
export const validateDate = (date) => {
  if (!date || typeof date !== 'string') return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Validate time (HH:MM format)
 */
export const validateTime = (time) => {
  if (!time || typeof time !== 'string') return false;
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
};

/**
 * Validate identity number (minimum 5 characters)
 */
export const validateIdentityNumber = (identityNumber) => {
  if (!identityNumber || typeof identityNumber !== 'string') return false;
  const trimmed = identityNumber.trim();
  // Must be at least 5 digits, numbers only (no letters or special characters)
  return /^\d{5,}$/.test(trimmed) && trimmed.length >= 5;
};

/**
 * Validate passport number (minimum 6 characters)
 */
export const validatePassportNumber = (passportNumber) => {
  if (!passportNumber || typeof passportNumber !== 'string') return false;
  return passportNumber.trim().length >= 6;
};

/**
 * Validate gender (must be one of the accepted values)
 */
export const validateGender = (gender) => {
  if (!gender || typeof gender !== 'string') return false;
  const validGenders = ['male', 'female'];
  return validGenders.includes(gender.toLowerCase());
};

/**
 * Validate destination country (not empty)
 */
export const validateDestinationCountry = (country) => {
  return country && country.trim().length > 0;
};

/**
 * Validate duration (positive number)
 */
export const validateDuration = (duration) => {
  if (!duration && duration !== 0) return false;
  const durationNum = parseInt(duration);
  return !isNaN(durationNum) && durationNum > 0;
};