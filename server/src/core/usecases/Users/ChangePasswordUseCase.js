/**
 * @file        ChangePasswordUseCase.js
 * @description Use case class for changing a user's password.
 *              Updates both internal database (Users table) and Supabase Auth.
 *
 * @requires    UserRepository       - Repository for database operations
 * @requires    formValidation.js    - Utility for hashing passwords
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-24
 */

import { hashPassword, comparePassword } from "../../../utils/formValidation.js";
import supabase from "../../../config/supabase.js";

class ChangePasswordUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Change the password for the authenticated user
   * @param {Object} authUser - Object with user info from JWT
   * @param {string} currentPassword - Current password of the user
   * @param {string} newPassword - New password to set
   */
  async execute(authUser, currentPassword, newPassword) {
    if (!authUser) throw { status: 401, message: "Unauthorized" };
    if (!currentPassword || !newPassword)
      throw { status: 400, message: "Both current and new passwords are required" };

    // Get user from internal DB
    const user = await this.userRepository.findByEmail(authUser.email);
    if (!user) throw { status: 404, message: "User not found" };

    // Verify current password matches internal DB
    const isValid = await comparePassword(currentPassword, user.password_hash);
    if (!isValid) throw { status: 401, message: "Current password is incorrect" };

    // Hash the new password for internal DB
    const hashedNewPassword = await hashPassword(newPassword);

    // Update Supabase password using session token
    const { data: supabaseUpdate, error } = await supabase.auth.updateUser(
      { password: newPassword },
      {
        headers: { Authorization: `Bearer ${authUser.accessToken}` } // pass JWT token
      }
    );
    if (error) throw { status: 500, message: "Failed to update Supabase password", detail: error.message };

    // Update internal DB
    await this.userRepository.updateUser(user.user_id, { password_hash: hashedNewPassword });

    return {
      status: 200,
      message: "Password updated successfully",
    };
  }
}

export default ChangePasswordUseCase;
