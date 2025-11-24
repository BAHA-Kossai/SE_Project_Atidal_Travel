/**
 * @file        UpdateUserUseCase.js
 * @description Use case class for handling user profile updates.
 *              Supports updating user information such as email, name,
 *              and other editable fields depending on business rules.
 *
 * @requires    UserRepository       - Repository for database operations
 * @requires    UpdateUserValidator  - Validator for update input
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-19
 * @lastModified 2025-11-19
 *
 * @notes       - This class contains business logic only; does not manage HTTP request/response.
 *              - Requires user ID and update payload to proceed.
 *              - Validates input before performing update.
 *              - Throws errors for invalid data, missing user, or database issues.
 */

import { UpdateUserValidator } from "../../../api/validators/User/UpdateUserValidator.js";
import supabase from '../../../config/supabase.js';
import User from "../../entities/Users.js";

class UpdateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async updateInfo(authUser, data, accessToken) {
    // Validate input
    const errors = UpdateUserValidator.validate(data);
    if (errors.length > 0) throw { status: 400, message: errors.join("\n ") };

    // Find user in internal database
    const existingUser = await this.userRepository.findByEmail(authUser.email);
    if (!existingUser) throw { status: 404, message: "User not found." };

    // Detect if email changed
    const emailChanged = data.email && data.email !== existingUser.email;

    // Build updated user model for DB
    const updatedUser = new User({
      ...data,
      created_at: existingUser.created_at,
      user_id: existingUser.user_id,
      supabase_id: existingUser.supabase_id,
      password_hash: existingUser.password_hash,
      type: existingUser.type
    });

    // Prepare payload for supabase.auth.updateUser
    const payload = {
      user_metadata: {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        type: existingUser.type
      }
    };

    // Include email if it changed
    if (emailChanged) payload.email = data.email;

    // Use the user session token to update via client SDK
    const { data: supabaseUpdate, error } = await supabase.auth.updateUser(payload, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (error) throw { status: 500, message: "Failed to update Supabase user", detail: error.message };

    // Update internal database
    const { updated_at, password, user_id, created_at, supabase_id, type, ...cleanUpdatedUser } = updatedUser;
    await this.userRepository.updateUser(existingUser.user_id, cleanUpdatedUser);

    return {
      status: 200,
      message: emailChanged
        ? "User updated successfully. A confirmation email has been sent to your new email address."
        : "User updated successfully.",
      data: updatedUser
    };
  }
}

export default UpdateUserUseCase;


