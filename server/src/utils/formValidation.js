/**
 * @file        formValidation.js
 * @description Utility functions for validating common form inputs.
 *              Provides reusable functions to validate fields such as first name, last name, email, phone number, and other user input.
 * 
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-18  // date of creation
 * @lastModified 2025-11-18
 * 
 * @notes       - This file contains only pure validation functions.
 *              - No business logic, database access, or side effects should be implemented here.
 *              - Functions should return true/false or throw errors depending on your implementation.
 *              - Can be used by SignUpValidator, LoginValidator, or any other form-related validation.
 * 
 * Usage Example:
 * 
 * import { validateFirstName, validateLastName, validatePhoneNumber } from './formValidation.js';
 * 
 * if (!validateFirstName('John')) {
 *     console.error('Invalid first name');
 * }
 * 
 * if (!validatePhoneNumber('+1234567890')) {
 *     console.error('Invalid phone number');
 * }
 */

import crypto from 'crypto';
import validator from 'validator';

/**
 * Trim a string and remove extra spaces
 * @param {string} str
 * @returns {string}
 */
function trimString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ');
}
/**
 * Sanitize input string
 * - Removes leading/trailing spaces
 * - Replaces dangerous characters with safe equivalents
 * - Escapes HTML special characters to prevent XSS or SQL injection
 * @param {string} str
 * @returns {string}
 */
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  const trimmed = trimString(str);
  return validator.escape(trimmed);
}
/**
 * Validate first name (letters only, min 2 chars)
 * @param {string} firstName
 * @returns {boolean}
 */
function validateFirstName(firstName) {
  const trimmed = trimString(firstName);
  return /^[A-Za-z]{2,}$/.test(trimmed);
}

/**
 * Validate last name (letters only, min 2 chars)
 * @param {string} lastName
 * @returns {boolean}
 */
function validateLastName(lastName) {
  const trimmed = trimString(lastName);
  return /^[A-Za-z]{2,}$/.test(trimmed);
}

/**
 * Validate Algerian phone number
 * Format: 0[5-7][0-9]{8} or +213[5-7][0-9]{8}
 * @param {string} phone
 * @returns {boolean}
 */
function validatePhoneNumber(phone) {
  const trimmed = trimString(phone);
  const regex = /^(0[5-7][0-9]{8}|\+213[5-7][0-9]{8})$/;
  return regex.test(trimmed);
}

/**
 * Validate password strength
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 * @param {string} password
 * @returns {boolean}
 */
function validatePassword(password) {
  if (typeof password !== 'string') return false;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}

/**
 * Hash password using SHA-256
 * @param {string} password
 * @returns {string} hashed password in hex
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}



export {
  trimString,
  sanitizeInput,
  validateFirstName,
  validateLastName,
  validatePhoneNumber,
  validatePassword,
  hashPassword
};
