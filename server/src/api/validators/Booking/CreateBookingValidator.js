/**
 * @file        CreateBookingValidator.js
 * @description Validator class for booking creation input data.
 *              Validates fields submitted when creating a new booking including
 *              trip details, payer information, and traveler data.
 * 
 * @author      Ahlem Toubrinet
 * @version     1.1.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 * 
 * @notes       - This file contains only input validation logic.
 *              - Should not contain database queries or business logic.
 */

import {
  validateFirstName,
  validateLastName,
  validatePhoneNumber,
  validateAge,
  validatePrice,
  validateDate,
  validateTime,
  validateIdentityNumber,
  validatePassportNumber,
  validateGender
} from "./utils/formValidation.js";
import { BookingTypeValidator } from "./BookingTypeValidator.js";

/**
 * Validate Create booking input fields.
 * 
 * @param {Object} data 
 * @param {string} data.type 
 * @param {string} data.destination_country 
 * @param {number} data.price 
 * @param {string} data.trip_date 
 * @param {string} data.departure_time 
 * @param {string} data.returning_time 
 * @param {Object} data.payer_info 
 * @param {Array} data.travelers_info 
 * 
 * @returns {string[]} 
 */
class CreateBookingValidator {
  static validate(data) {
    const errors = [];

    errors.push(...BookingTypeValidator.validate(data.type));

    const basicRules = [
      { 
        valid: data.destination_country && data.destination_country.trim().length > 0, 
        msg: `Error-Create: Destination country is required.` 
      },
      { 
        valid: validatePrice(data.price), 
        msg: `Error-Create: Invalid price [${data.price}].` 
      },
      { 
        valid: validateDate(data.trip_date), 
        msg: `Error-Create: Invalid trip date [${data.trip_date}].` 
      },
      { 
        valid: validateTime(data.departure_time), 
        msg: `Error-Create: Invalid departure time [${data.departure_time}].` 
      },
      { 
        valid: validateTime(data.returning_time), 
        msg: `Error-Create: Invalid returning time [${data.returning_time}].` 
      },
    ];

    basicRules.forEach(rule => {
      if (!rule.valid) errors.push(rule.msg);
    });

    if (!data.payer_info) {
      errors.push('Error-Create: Payer information is required.');
    } else {
      errors.push(...this.validatePayerInfo(data.payer_info));
    }

    if (data.travelers_info && data.travelers_info.length > 0) {
      data.travelers_info.forEach((traveler, index) => {
        errors.push(...this.validateTravelerInfo(traveler, index));
      });
    }

    return errors;
  }

  /**
   * Validate payer information
   * @param {Object} payerInfo 
   * @returns {string[]}
   */
  static validatePayerInfo(payerInfo) {
    const errors = [];

    const payerRules = [
      { valid: validateFirstName(payerInfo.first_name), msg: `Error-Create: Payer first name [${payerInfo.first_name}] is invalid.` },
      { valid: validateLastName(payerInfo.last_name), msg: `Error-Create: Payer last name [${payerInfo.last_name}] is invalid.` },
      { valid: validatePhoneNumber(payerInfo.phone), msg: `Error-Create: Payer phone number [${payerInfo.phone}] is invalid.` },
    ];

    if (payerInfo.is_traveler) {
      const travelerRules = [
        { valid: validateAge(payerInfo.age), msg: `Error-Create: Payer age [${payerInfo.age}] is invalid.` },
        { valid: validateIdentityNumber(payerInfo.identity_number), msg: `Error-Create: Payer identity number [${payerInfo.identity_number}] is invalid.` },
        { valid: validatePassportNumber(payerInfo.passport_number), msg: `Error-Create: Payer passport number [${payerInfo.passport_number}] is invalid.` },
        { valid: validateGender(payerInfo.gender), msg: `Error-Create: Payer gender [${payerInfo.gender}] is invalid.` },
      ];
      
      travelerRules.forEach(rule => {
        if (!rule.valid) errors.push(rule.msg);
      });
    }

    payerRules.forEach(rule => {
      if (!rule.valid) errors.push(rule.msg);
    });

    return errors;
  }

  /**
   * Validate traveler information
   * @param {Object} traveler 
   * @param {number} index 
   * @returns {string[]}
   */
  static validateTravelerInfo(traveler, index) {
    const errors = [];

    const travelerRules = [
      { valid: validateFirstName(traveler.first_name), msg: `Error-Create: Traveler ${index + 1} first name [${traveler.first_name}] is invalid.` },
      { valid: validateLastName(traveler.last_name), msg: `Error-Create: Traveler ${index + 1} last name [${traveler.last_name}] is invalid.` },
      { valid: validateAge(traveler.age), msg: `Error-Create: Traveler ${index + 1} age [${traveler.age}] is invalid.` },
      { valid: validateIdentityNumber(traveler.identity_number), msg: `Error-Create: Traveler ${index + 1} identity number [${traveler.identity_number}] is invalid.` },
      { valid: validatePhoneNumber(traveler.travler_contact), msg: `Error-Create: Traveler ${index + 1} contact [${traveler.travler_contact}] is invalid.` },
      { valid: validatePassportNumber(traveler.passport_number), msg: `Error-Create: Traveler ${index + 1} passport number [${traveler.passport_number}] is invalid.` },
      { valid: validateGender(traveler.gender), msg: `Error-Create: Traveler ${index + 1} gender [${traveler.gender}] is invalid.` },
    ];

    travelerRules.forEach(rule => {
      if (!rule.valid) errors.push(rule.msg);
    });

    return errors;
  }
}

export { CreateBookingValidator };