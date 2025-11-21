/**
 * @file        ForgotPasswordUseCase.js
 * @description Use case class for handling "Forgot Password" functionality.
 *              Sends password reset emails via Supabase Auth.
 *
 * @requires    UserRepository       - Repository for database operations
 * @requires    validateEmail
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-21
 * @lastModified 2025-11-21
 *
 * @notes       - This class handles business logic only; does not manage HTTP request/response.
 *              - Sends password reset email with Supabase redirect URL.
 */

import UserRepository from "../../repositories/userRepository.js";
import { validateEmail } from "../../utils/formValidation.js";
import supabase from "../../config/supabase.js";

class ForgotPasswordUseCase {
  /**
   * @constructor
   * @param {UserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * @method sendResetEmail
   * @description Sends a password reset email to the user.
   * @param {Object} data - Object containing the email
   * @returns {Object} Result message
   * @throws {Object} Error object with status and message
   */
  async sendResetEmail(data) {
    // Validate email
    const { email } = data;
    if (!validateEmail(email)) {
      //even if user dont exist we dont reveal it
      throw { status: 400, message: "Invalid email address" };
    }

    //check if user exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) {
      return { status: 200, message: "a reset link has been sent." };
    }

    // Use Supabase Auth to send password reset email
    const { data: resetData, error } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "-----", // frontend page to handle password reset
      });

    if (error) throw { status: 500, message: error.message };

    return { status: 200, message: "a reset link has been sent." };
  }
}

export default ForgotPasswordUseCase;

import supabase from "../../config/supabase.js";
import { hashPassword } from "../../utils/formValidation.js";
import { hashPassword } from "../../utils/formValidation.js";

class ResetPasswordUseCase {
  /**
   * @constructor
   * @param {UserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * @method resetPassword
   * @description Reset user's password using token from Supabase email link.
   *              Also updates password hash in your database.
   * @param {Object} data - { token, newPassword }
   * @returns {Object} Success message
   * @throws {Object} Error object with status and message
   */
  async resetPassword(data) {
    const { token, newPassword } = data;

    if (!token || !newPassword) {
      throw { status: 400, message: "Token and new password are required." };
    }

    try {
      // Reset password in Supabase
      const { data: updatedUser, error } = await supabase.auth.updateUser(
        { password: newPassword },
        token
      );

      if (error) throw { status: 500, message: error.message };

      // Get email from Supabase response
      const email = updatedUser?.email;
      if (!email) throw { status: 500, message: "Could not retrieve user email." };

      // Hash the new password for your database
      const password_hash = await hashPassword(newPassword);

      // Update user record in DB
      const userInDb = await this.userRepository.findByEmail(email);
      if (!userInDb) {
        console.warn("User not found in DB after password reset:", email);
      } else {
        await this.userRepository.updateUser(userInDb.user_id, { password_hash });
      }

      return { status: 200, message: "Password reset successful." };
    } catch (err) {
      throw {
        status: err.status || 500,
        message: err.message || "Internal Server Error",
      };
    }
  }
}

export { ResetPasswordUseCase };
