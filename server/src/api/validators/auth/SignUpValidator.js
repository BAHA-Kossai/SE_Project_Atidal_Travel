/**
 * @file        SignUpValidator.js
 * @description Validator class for user sign-up / registration data.
 *              Performs input validation for both email/password sign-up and Google OAuth sign-up.
 *              Ensures required fields are present, formats are correct, and applies any business rules before UseCase execution.
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-18  // date of creation
 * @lastModified 2025-11-18
 *
 * @notes       - This file contains only validation logic.
 *              - No database access or business logic should be implemented here.
 *              - Use this validator in the SignUpUseCase before proceeding with user creation.
 *              - Throws errors or returns validation results depending on implementation.
 *
 */

import {
  validateFirstName,
  validateLastName,
  validatePhoneNumber,
  validateEmail,
  validatePassword,
  validateBirthDate,
} from "../../../utils/formValidation.js";

/**
 * Validate Sign-Up input fields for email registration.
 *
 * @param {Object} data - Form input data.
 * @param {string} data.firstname - User first name.
 * @param {string} data.lastname - User last name.
 * @param {string} data.email - User email address.
 * @param {string} data.password - User password.
 * @param {string} data.phone - User phone number.
 * @param {string|Date} data.birthDate - User birth date.
 *
 * @returns {string[]} Array of validation error messages.
 *                     Returns empty array if no validation errors.
 */
class SignUpWithEmailValidator {
  static validate(data) {
    const errors = [];

    //set of checks must be validated
    //map  of  {valid : (true/false) msg : "error message"}
    const rules = [
      { valid: validateFirstName(data.first_name), msg: `Error-Sign up: First name [${data.first_name}] is invalid.` },
      { valid: validateLastName(data.last_name), msg: `Error-Sign up: Last name [${data.last_name}] is invalid.` },
      { valid: validateEmail(data.email), msg: `Error-Sign up: Invalid Email [${data.email}].` },
      { valid: validateBirthDate(data.date_of_birth), msg: `Error-Sign up: Invalid Birth date [${data.date_of_birth}].` },
      { valid: validatePassword(data.password), msg: `Error-Sign up: Invalid Password.` },
      { valid: validatePhoneNumber(data.phone), msg: `Error-Sign up: Invalid Phone number [${data.phone}].` },
    ];

    rules.forEach(rule => {
      if (!rule.valid) errors.push(rule.msg);//add the error message if any
    });

    return errors;
  }
}


export { SignUpWithEmailValidator };

