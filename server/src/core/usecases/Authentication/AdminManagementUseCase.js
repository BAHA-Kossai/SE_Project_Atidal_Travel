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
    if (superAdmin.type !== 'SUPER_ADMIN') {
      throw { status: 403, message: 'Forbidden: only super admins can add admins' };
    }

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(adminData.email);
 
    if (existingUser) throw { status: 409, message: 'Email already in use' };
 
    // Hash password
    const password_hash = await hashPassword(adminData.password);
    const { password, ...adminWithoutPassword } = adminData;
    console.log(adminData)
    // Create user object for DB insert
    const adminUser = {
      ...adminWithoutPassword,
      type: 'ADMIN',
      password_hash
    };

    // Create user in Supabase Auth (admin API)
    const supabaseUser = await this.userRepository.registerAdminAuthUser(adminData);

    // Store in DB including supabase_id
    const dbUser = await this.userRepository.createAdminUser({
      ...adminUser,
      supabase_id: supabaseUser.id
    });

    return {
      supabase: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        type: 'ADMIN',
        first_name: adminData.first_name,
        last_name: adminData.last_name
      },
      database: {
        user_id: dbUser.user_id,
        email: dbUser.email,
        type: dbUser.type,
        first_name: dbUser.first_name,
        last_name: dbUser.last_name,
        phone: dbUser.phone,
        supabase_id: dbUser.supabase_id
      }
    };
  }
}
export default AdminManagementUseCase;

