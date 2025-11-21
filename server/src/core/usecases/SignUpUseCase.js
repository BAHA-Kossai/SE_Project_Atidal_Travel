/**
 * @file        SignUpUseCase.js
 * @description Use case class for handling user sign-up.
 *              Supports both regular signup (email/password) and Google signup.
 *              Contains validation, password hashing, and user creation logic.
 *
 * @requires    UserRepository       - Repository for database operations
 * @requires    SignUpValidator      - Validator for signup input
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-19
 * @lastModified 2025-11-19
 *
 * @notes       - This class handles business logic only; does not manage HTTP request/response.
 *              - Regular signup requires email and password.
 *              - Google signup requires Google account data (email, first_name, last_name, etc.).
 *              - Throws errors for invalid input, duplicate emails, or database issues.
 *
 */

import User from "../entities/Users.js";
import { hashPassword } from "../../utils/formValidation.js";
import UserRepository from "../../repositories/userRepository.js";
import supabase from "../../config/supabase.js";
import { SignUpWithEmailValidator } from "../../api/validators/SignUpValidator.js";
class SignUpUseCase {
  /**
   * @constructor
   * @param {UserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * @method signUpWithEmail
   * @description Handles regular email/password signup.
   * @param {Object} data - User signup input
   * @returns {Object} Created user data
   * @throws {Object} Error object with status and message
   */
  async signUpWithEmail(data) {
    //Validate input
    const errors = SignUpWithEmailValidator.validate(data);
    if (errors.length > 0) throw { status: 400, message: errors.join("\n ") };

    // Check for existing email
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
    if (!existingUser.confirmed) {
      // User exists but not confirmed → resend email
      await this.userRepository.registerAuthUser(data);
      return { status: 202, message: "Email not confirmed. Confirmation email resent." };
    }
    return { status: 409, message: "Email already in use." };
  }

    //Hash password
    const password_hash = await hashPassword(data.password);

    // Build the user object correctly
    const user = new User({
      ...data,
      password_hash: password_hash,
    });

    const supabaseToken = await this.userRepository.registerAuthUser(user);
    const {password,...userWithoutPassword} = user;
    const createdUser = await this.userRepository.createRegularUser(userWithoutPassword);


    const cleanSupabaseUser = {
  id: supabaseToken.id,
  email: supabaseToken.email,
  first_name: supabaseToken.user_metadata.first_name,
  last_name: supabaseToken.user_metadata.last_name,
  date_of_birth: supabaseToken.user_metadata.date_of_birth,
  confirmation_sent_at: supabaseToken.confirmation_sent_at,
  email_verified: supabaseToken.user_metadata.email_verified || false
};

  const cleanUser = {
    id: createdUser.user_id,
    phone : createdUser.phone,
    type : createdUser.type,

  }
    return {supabase:cleanSupabaseUser ,database: cleanUser};
  }


}

export default SignUpUseCase;
