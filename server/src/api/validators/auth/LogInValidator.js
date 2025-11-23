/**
 * @file        SignInValidator.js
 * @description Validator class for user login data (email/password).
 *              Ensures required fields are present and in the correct format.
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-21
 * @lastModified 2025-11-21
 *
 * @notes       - Only validates email/password.
 *              - No database access or business logic here.
 */

import { validateEmail, validatePassword } from "../../../utils/formValidation.js";

class LogInValidator {
  /**
   * Validate login input fields.
   *
   * @param {Object} data - Form input data.
   * @param {string} data.email - User email address.
   * @param {string} data.password - User password.
   *
   * @returns {string[]} Array of validation error messages.
   *                     Returns empty array if no validation errors.
   */
  static validate(data) {
    const errors = [];

    const rules = [
      { valid: validateEmail(data.email), msg: `Error-Login: Invalid Email [${data.email}].` },
      { valid: validatePassword(data.password), msg: `Error-Login: Invalid Password.` }
    ];

    rules.forEach(rule => {
      if (!rule.valid) errors.push(rule.msg);
    });

    return errors;
  }
}

export { LogInValidator };
