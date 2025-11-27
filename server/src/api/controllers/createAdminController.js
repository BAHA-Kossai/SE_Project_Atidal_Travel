/**
 * @function createAdminController
 * @description Handles HTTP request for creating a new admin user.
 *              Validates super admin role, calls AdminManagementUseCase, and returns created admin data.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Logged-in super admin performing the action (from JWT)
 * @param {Object} req.body - Incoming JSON body with new admin data:
 * @param {string} req.body.email - New admin email
 * @param {string} req.body.password - New admin password
 * @param {string} req.body.first_name - First name
 * @param {string} req.body.last_name - Last name
 * @param {string} [req.body.phone] - Phone number
 * @param {string} [req.body.date_of_birth] - Date of birth in YYYY-MM-DD
 *
 * @param {Object} res - Express response object
 *
 * @returns {JSON} 
 * On Success: Newly created admin data from Supabase and database
 * On Failure: Error JSON with status and message
 */
import AdminManagementUseCase from '../../core/usecases/Authentication/AdminManagementUseCase.js';
import UserRepository from '../../repositories/userRepository.js';
import { supabaseAdmin } from '../../config/supabase.js';


const userRepo = new UserRepository(supabaseAdmin);
const adminUseCase = new AdminManagementUseCase(userRepo);

/**
 * @function createAdminController
 * @description Handles HTTP request for creating a new admin user.
 *              Validates super admin role (middleware), calls AdminManagementUseCase.
 */
export const createAdminController = async (req, res) => {
  try {
    const superAdmin = req.user; // set by middleware
    const adminData = req.body;

    const result = await adminUseCase.createAdmin(superAdmin, adminData);

    return res.status(201).json({
      status: "success",
      data: result
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: {},
      message: err.message || "Internal Server Error"
    });
  }
};
