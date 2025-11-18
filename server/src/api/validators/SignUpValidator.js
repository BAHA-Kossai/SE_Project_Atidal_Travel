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
 * Usage Example:
 * 
 * import SignUpValidator from './SignUpValidator.js';
 * const validator = new SignUpValidator();
 * 
 * // For email/password sign-up
 * validator.validateEmailSignUp({
 *     email: 'test@test.com',
 *     password: 'securePassword123',
 *     firstName: 'John',
 *     lastName: 'Doe'
 * });
 * 
 * // For Google OAuth sign-up
 * validator.validateGoogleSignUp({
 *     googleToken: '<token>'
 * });
 */

