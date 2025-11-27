/**
 * @file        formValidation.js
 * @description Utility functions for form validation.
 *              Contains reusable validation functions for common form fields.
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */


/**
 * Validate first name
 * @param {string} firstName
 * @returns {boolean}
 */
export const validateFirstName = (firstName) => {
  if (!firstName || typeof firstName !== 'string') return false;
  const trimmed = firstName.trim();
  return trimmed.length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed);
};

/**
 * Validate last name
 * @param {string} lastName
 * @returns {boolean}
 */
export const validateLastName = (lastName) => {
  if (!lastName || typeof lastName !== 'string') return false;
  const trimmed = lastName.trim();
  return trimmed.length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed);
};

/**
 * Validate phone number (Algerian format)
 * @param {string} phone
 * @returns {boolean}
 */
export const validatePhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.replace(/[\s-]/g, '');
  return /^0\d{9}$/.test(cleanPhone);
};

/**
 * Validate age (must be between 1 and 120)
 * @param {number|string} age
 * @returns {boolean}
 */
export const validateAge = (age) => {
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum >= 1 && ageNum <= 120;
};

/**
 * Validate price (must be positive number)
 * @param {number|string} price
 * @returns {boolean}
 */
export const validatePrice = (price) => {
  const priceNum = parseFloat(price);
  return !isNaN(priceNum) && priceNum >= 0;
};

/**
 * Validate date (must be valid date string)
 * @param {string} date
 * @returns {boolean}
 */
export const validateDate = (date) => {
  if (!date || typeof date !== 'string') return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Validate time (HH:MM format)
 * @param {string} time
 * @returns {boolean}
 */
export const validateTime = (time) => {
  if (!time || typeof time !== 'string') return false;
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
};

/**
 * Validate identity number (minimum 5 characters)
 * @param {string} identityNumber
 * @returns {boolean}
 */
export const validateIdentityNumber = (identityNumber) => {
  if (!identityNumber || typeof identityNumber !== 'string') return false;
  return identityNumber.trim().length >= 5;
};

/**
 * Validate limit (must be positive integer)
 * @param {number|string} limit
 * @returns {boolean}
 */
export const validateLimit = (limit) => {
  const limitNum = parseInt(limit);
  return !isNaN(limitNum) && limitNum > 0;
};

/**
 * Validate passport number (minimum 6 characters)
 * @param {string} passportNumber
 * @returns {boolean}
 */
export const validatePassportNumber = (passportNumber) => {
  if (!passportNumber || typeof passportNumber !== 'string') return false;
  return passportNumber.trim().length >= 6;
};

/**
 * Validate gender (must be one of the accepted values)
 * @param {string} gender
 * @returns {boolean}
 */
export const validateGender = (gender) => {
  if (!gender || typeof gender !== 'string') return false;
  const validGenders = ['male', 'female', 'other'];
  return validGenders.includes(gender.toLowerCase());
};