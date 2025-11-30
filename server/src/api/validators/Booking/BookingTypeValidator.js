/**
 * @file        BookingTypeValidator.js
 * @description Validator class for booking type validation.
 *              Validates booking types and related parameters.
 * 
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 * 
 * @notes       - This file contains only booking type validation logic.
 *              - Should not contain database queries or business logic.
 */


/**
 * Validate booking type input.
 * 
 * @param {string} bookingType - Booking type to validate.
 * @returns {string[]} Array of validation error messages.
 */
class BookingTypeValidator {
  static validate(bookingType) {
    const errors = [];

    const validTypes = ['normal', 'guided_trip', 'umrah'];
    if (!validTypes.includes(bookingType)) {
      errors.push(`Error: Invalid booking type [${bookingType}]. Must be: ${validTypes.join(', ')}`);
    }

    return errors;
  }
}

export { BookingTypeValidator };