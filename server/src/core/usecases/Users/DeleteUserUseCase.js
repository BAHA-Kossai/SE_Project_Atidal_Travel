/**
 * @file        DeleteUserUseCase.js
 * @description Use case class for deleting a user account.
 *              Deletes the user from Supabase Auth and internal database.
 *
 * @requires    UserRepository       - Repository for database operations
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-23
 */

import {supabaseAdmin} from '../../../config/supabase.js';
import UserRepository from '../../../repositories/userRepository.js';

class DeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Delete the logged-in user
   * @param {string} accessToken - Supabase access token of the logged-in user
   */
  async deleteUser(accessToken) {
    if (!accessToken) throw { status: 400, message: "Access token is required" };

    // Get the logged-in user info from Supabase
    const { data: { user }, error: getUserError } = await supabaseAdmin.auth.getUser(accessToken);
    if (getUserError || !user) throw { status: 401, message: "Invalid or expired token" };

    // Delete the user from Supabase Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (deleteError) throw { status: 500, message: "Failed to delete user from Supabase", detail: deleteError.message };

    // Delete the user from internal database
    await this.userRepository.deleteUserBySupabaseId(user.id);

    return {
      status: 200,
      message: "User deleted successfully"
    };
  }
}

export default DeleteUserUseCase;
