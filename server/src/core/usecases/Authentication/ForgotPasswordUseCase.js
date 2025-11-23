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

import UserRepository from "../../../repositories/userRepository.js";
import { validateEmail } from "../../../utils/formValidation.js";
import supabase from "../../../config/supabase.js";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "../../../config/supabase.js";
import { hashPassword } from "../../../utils/formValidation.js";

import jwt from "jsonwebtoken";

const decodeEmailFromToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded?.email; // usually the email is inside the payload
};
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
        redirectTo: "http://localhost:5173/", // frontend page to handle password reset
      });

    if (error) throw { status: 500, message: error.message };

    return { status: 200, message: "a reset link has been sent." };
  }
}

export default ForgotPasswordUseCase;


class ResetPasswordUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async resetPassword(data) {
    const { token, newPassword } = data;
    if (!token || !newPassword) {
      throw { status: 400, message: "Token and new password are required." };
    }

    const email = decodeEmailFromToken(token);
    if (!email) throw { status: 400, message: "Invalid token." };

    // Find user via listUsers
    const { data: listData, error: listError } =
      await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listError) throw { status: 500, message: listError.message };

    const user = listData.users.find((u) => u.email === email);
    if (!user) throw { status: 404, message: "User not found" };

    // Update password
    const { data: updatedUser, error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });
    if (updateError) throw { status: 500, message: updateError.message };

    // Hash and update in DB
    const password_hash = await hashPassword(newPassword);
    const userInDb = await this.userRepository.findByEmail(email);
    if (userInDb) {
      await this.userRepository.updateUser(userInDb.user_id, { password_hash });
    }

    return { status: 200, message: "Password reset successful." };
  }
}

export { ResetPasswordUseCase };
