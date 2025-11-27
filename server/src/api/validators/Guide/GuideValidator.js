/**
 * @file        CreateGuideValidator.js
 * @description Validator class for guide creation input data.
 *              Validates fields submitted when creating a new guide such as names,
 *              phone, birth date, and experience. Ensures data integrity before executing
 *              CreateGuideUseCase.
 * 
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-23
 * @lastModified 2025-11-23
 * 
 * @notes       - This file contains only input validation logic.
 *              - Should not contain database queries or business logic.
 *              - Throws validation errors or returns structured validation results.
 */

import {
  validateFirstName,
  validateLastName,
  validatePhoneNumber,
  validateBirthDate,
} from "../../../utils/formValidation.js";

/**
 * Validate Create guide input fields.
 * 
 * @param {Object} data - Form input data.
 * @param {string} data.first_name - Guide first name.
 * @param {string} data.last_name - Guide last name.
 * @param {string} data.phone - Guide phone number.
 * @param {string|Date} data.birth_date - Guide birth date.
 * @param {string} [data.experiance] - Guide experience description.
 * 
 * @returns {string[]} Array of validation error messages.
 *                     Returns empty array if no validation errors.
 */
class CreateGuideValidator {
  static validate(data) {
    const errors = [];

    const rules = [
      { valid: validateFirstName(data.first_name), msg: `Error-Create: First name [${data.first_name}] is invalid.` },
      { valid: validateLastName(data.last_name), msg: `Error-Create: Last name [${data.last_name}] is invalid.` },
      { valid: validatePhoneNumber(data.phone), msg: `Error-Create: Invalid phone number [${data.phone}].` },
      { valid: validateBirthDate(data.birth_date), msg: `Error-Create: Invalid birth date [${data.birth_date}].` },
    ];

    rules.forEach(rule => {
      if (!rule.valid) errors.push(rule.msg);
    });

    return errors;
  }
}

export { CreateGuideValidator };
