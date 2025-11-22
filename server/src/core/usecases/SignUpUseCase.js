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
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async signUpWithEmail(data) {
    // Validate input
    const errors = SignUpWithEmailValidator.validate(data);
    if (errors.length > 0) throw { status: 400, message: errors.join("\n ") };

    // Check existing user by email
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      // If already exists in Supabase but not confirmed, resend confirmation
      const { email, first_name, last_name, phone, date_of_birth } = existingUser;
      await this.userRepository.registerAuthUser({ email, first_name, last_name, phone, date_of_birth, password: data.password });
      return { status: 202, message: "Email not confirmed. Confirmation email resent." };
    }

    // Hash password for DB
    const password_hash = await hashPassword(data.password);

    // Create User entity
    const user = new User({ ...data, password_hash });

    // Register in Supabase Auth
    const supabaseUser = await this.userRepository.registerAuthUser(user);

    // Store in DB including supabase_id
    const { password, ...userWithoutPassword } = user;
    const createdUser = await this.userRepository.createRegularUser({
      ...userWithoutPassword,
      supabase_id: supabaseUser.id
    });

    // Return clean objects
    return {
      supabase: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        first_name: supabaseUser.user_metadata.first_name,
        last_name: supabaseUser.user_metadata.last_name,
        date_of_birth: supabaseUser.user_metadata.date_of_birth,
        confirmation_sent_at: supabaseUser.confirmation_sent_at,
        email_verified: supabaseUser.user_metadata.email_verified || false
      },
      database: {
        id: createdUser.user_id,
        supabase_id: createdUser.supabase_id,
        phone: createdUser.phone,
        type: createdUser.type
      }
    };
  }
}


export default SignUpUseCase;
