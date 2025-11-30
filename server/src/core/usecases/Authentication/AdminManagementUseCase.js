/**
 * @file        adminController.js
 * @description Defines controller functions for handling admin management requests.
 *              Controllers receive HTTP request data, invoke UseCases, and return JSON results.
 *              No business logic is implemented here; all logic is delegated to UseCases.
 *
 * @requires    UserRepository         - Access to database and Supabase operations
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-21
 * @lastModified 2025-11-21
 */

import { hashPassword } from "../../../utils/formValidation.js";
import { supabaseAdmin } from "../../../config/supabase.js";

class AdminManagementUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * @description Only super admin can create admin users
   * @param {Object} superAdmin - user object of the super admin performing the action
   * @param {Object} adminData - email, password, first_name, last_name, etc.
   */
  async createAdmin(superAdmin, adminData) {
    // Verify superAdmin role
    if (superAdmin.type !== "SUPER_ADMIN") {
      throw {
        status: 403,
        message: "Forbidden: only super admins can add admins",
      };
    }

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(adminData.email);

    if (existingUser) throw { status: 409, message: "Email already in use" };

    // Hash password
    const password_hash = await hashPassword(adminData.password);
    const { password, ...adminWithoutPassword } = adminData;
   
    // Create user object for DB insert
    const adminUser = {
      ...adminWithoutPassword,
      type: "ADMIN",
      password_hash,
    };

    // Create user in Supabase Auth (admin API)
    const {supabase: supabaseUser} = await this.userRepository.registerAdminAuthUser(
      adminData
    );
    
    // Store in DB including supabase_id
    const dbUser = await this.userRepository.createAdminUser({
      ...adminUser,
      supabase_id: supabaseUser.id,
    });

    return {
      supabase: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        type: "ADMIN",
        first_name: adminData.first_name,
        last_name: adminData.last_name,
      },
      database: {
        user_id: dbUser.user_id,
        email: dbUser.email,
        type: dbUser.type,
        first_name: dbUser.first_name,
        last_name: dbUser.last_name,
        phone: dbUser.phone,
        supabase_id: dbUser.supabase_id,
      },
    };
  }

  async deleteAdmin(adminId) {
  if (!adminId) {
    throw new Error("Admin ID is required");
  }

  // Check if user exists
  const user = await this.userRepository.getUserById(adminId);
  if (!user) {
    throw new Error("Admin not found");
  }

  // Ensure the user is actually an admin
  if (user.type !== "ADMIN" && user.type !== "SUPER_ADMIN") {
    throw new Error("User is not an admin");
  }

  // Prevent deleting super admin (safety rule)
  if (user.type === "SUPER_ADMIN") {
    throw new Error("Cannot delete a SUPER_ADMIN");
  }

  // Delete from Supabase
  if (user.supabase_id) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
    if (error) {
      throw new Error("Failed to delete admin from Supabase: " + error.message);
    }
  }

  // Delete admin (user)
  const deleted = await this.userRepository.deleteUser(adminId);

  return {
    message: "Admin successfully deleted",
    data: deleted,
  };
}

 /**
   * @description Updates an admin user. Only SUPER_ADMIN can perform this action.
   * @param {Object} superAdmin - the requesting SUPER_ADMIN
   * @param {number} adminId - user_id of the admin to update
   * @param {Object} updateData - fields to update (email, first_name, last_name, phone, date_of_birth)
   */
async updateAdmin(superAdmin, adminId, updateData) {
  // Verify requester is SUPER_ADMIN
  if (!superAdmin || superAdmin.type !== "SUPER_ADMIN") {
    throw { status: 403, message: "Forbidden: only super admins can update admins" };
  }

  if (!adminId) {
    throw { status: 400, message: "Admin ID is required" };
  }

  // Fetch the user from DB
  const user = await this.userRepository.getUserById(adminId);
  if (!user) {
    throw { status: 404, message: "Admin not found" };
  }

  if (user.type !== "ADMIN") {
    throw { status: 400, message: "User is not an admin" };
  }

  // If updating email, check for conflicts
  if (updateData.email && updateData.email !== user.email) {
    const existing = await this.userRepository.findByEmail(updateData.email);
    if (existing) throw { status: 409, message: "Email already in use" };
  }

  // Make sure we have a valid supabase_id
  if (!user.supabase_id) {
    throw { status: 500, message: "Supabase ID missing for this admin" };
  }

  // Update in Supabase using **supabase_id**
  const supabaseUpdatePayload = { user_metadata: {} };

  if (updateData.email) supabaseUpdatePayload.email = updateData.email;
  if (updateData.password) supabaseUpdatePayload.password = updateData.password;

  supabaseUpdatePayload.user_metadata.first_name = updateData.first_name || user.first_name;
  supabaseUpdatePayload.user_metadata.last_name = updateData.last_name || user.last_name;
  supabaseUpdatePayload.user_metadata.phone = updateData.phone || user.phone;
  supabaseUpdatePayload.user_metadata.date_of_birth = updateData.date_of_birth || user.date_of_birth;
  supabaseUpdatePayload.user_metadata.type = "ADMIN";

  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    user.supabase_id,
    supabaseUpdatePayload
  );

  if (error) {
    throw { status: 500, message: "Failed to update admin in Supabase", detail: error.message };
  }
  const {password,...cleanData} = updateData;
  // Update in internal DB
  const updatedUser = await this.userRepository.updateUser(adminId, {...cleanData,password_hash:await hashPassword(updateData.password)});

  return {
    message: `Admin user with ID ${adminId} updated successfully`,
    data: updatedUser
  };
}

}
export default AdminManagementUseCase;
