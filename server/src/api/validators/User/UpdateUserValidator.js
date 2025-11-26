/**
 * @file        UpdateUserValidator.js
 * @description Validator class for user update profile data.
 *              Validates fields submitted when updating user information such as email, names,
 *              or other editable attributes depending on business requirements.
 *              Ensures data integrity and format correctness before UpdateUserUseCase execution.
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-18  // date of creation
 * @lastModified 2025-11-18
 *
 * @notes       - This file contains only input validation logic.
 *              - Should not contain database queries or business logic.
 *              - Used by UpdateUserUseCase prior to performing any user data modification.
 *              - Throws validation errors or returns structured validation results based on implementation.
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
 * Validate Update user info input fields.
 * even if one info modified everything is resubmited
 * 
 * @param {Object} data - Form input data.
 * @param {string} data.firstname - User first name.
 * @param {string} data.lastname - User last name.
 * @param {string} data.email - User email address.
 * @param {string} data.phone - User phone number.
 * @param {string|Date} data.birthDate - User birth date.
 *
 * @returns {string[]} Array of validation error messages.
 *                     Returns empty array if no validation errors.
 */
class UpdateUserValidator {
  static validate(data) {
    const errors = [];

    //set of checks must be validated
    //map  of  {valid : (true/false) msg : "error message"}
    const rules = [
      { valid: validateFirstName(data.first_name), msg: `Error-Update: First name [${data.first_name}] is invalid.` },
      { valid: validateLastName(data.last_name), msg: `Error-Update: Last name [${data.last_name}] is invalid.` },
      { valid: validateEmail(data.email), msg: `Error-Update: Invalid Email [${data.email}].` },
      { valid: validateBirthDate(data.date_of_birth), msg: `Error-Update: Invalid Birth date [${data.date_of_birth}].` },
      { valid: validatePhoneNumber(data.phone), msg: `Error-Update: Invalid Phone number [${data.phone}].` },
    ];

    rules.forEach(rule => {
      if (!rule.valid) errors.push(rule.msg);//add the error message if any
    });

    return errors;
  }
}


export { UpdateUserValidator };