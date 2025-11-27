/**
 * @file        ReadUserUseCase.js
 * @description Use case class for fetching the logged-in user's profile.
 *              Excludes sensitive/internal fields like user_id, supabase_id,
 *              created_at, updated_at, and password_hash.
 *
 * @requires    UserRepository
 * 
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-24
 */

class ReadUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Get the logged-in user's profile
   * @param {Object} authUser - User object from JWT middleware
   * @returns {Object} Safe user profile data
   */
  async execute(authUser) {
    if (!authUser) {
      throw { status: 401, message: "Unauthorized" };
    }

    // Fetch user data from DB
    const userData = await this.userRepository.findByEmail(authUser.email);
    if (!userData) {
      throw { status: 404, message: "User not found" };
    }

    // Exclude sensitive fields
    const {
      user_id,
      supabase_id,
      created_at,
      updated_at,
      password_hash,
      ...safeData
    } = userData;

    return safeData;
  }
}

export default ReadUserUseCase;


/**
 * @description Use case class for fetching all users of type ADMIN.
 *              Only accessible by SUPER_ADMIN users.
 */

class ReadAdminsUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Get all ADMIN users
   * @param {Object} authUser - Logged-in user object from JWT middleware
   * @returns {Array<Object>} Array of admin users excluding sensitive fields
   */
  async execute(authUser) {
    if (!authUser) {
      throw { status: 401, message: "Unauthorized" };
    }

    if (authUser.type !== "SUPER_ADMIN") {
      throw { status: 403, message: "Forbidden: Only SUPER_ADMIN can access this" };
    }

    const admins = await this.userRepository.getAllAdmins();
    if (!admins || admins.length === 0) return [];

    // Exclude sensitive fields
    return admins.map(admin => {
      const { user_id, supabase_id, created_at, updated_at, password_hash, ...safeData } = admin;
      return safeData;
    });
  }
}

export  {ReadAdminsUseCase};
