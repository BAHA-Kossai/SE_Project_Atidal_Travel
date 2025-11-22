/**
 * @file        authController.js
 * @description Defines controller functions for handling authentication requests.
 *              Controllers receive HTTP request data, invoke UseCases, and return JSON results.
 *              No business logic is implemented here.
 *
 * @requires    SignUpUseCase       - Handles user signup logic
 * @requires    LoginUseCase        - Handles user login logic
 * @requires    UserRepository      - Access to database operations
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-21
 * @lastModified 2025-11-21
 */

import SignUpUseCase from '../../core/usecases/SignUpUseCase.js';
import LoginUseCase from '../../core/usecases/LoginUseCase.js';
import LogoutUseCase from '../../core/usecases/LogOutUseCase.js';
import supabase, { supabaseAdmin } from '../../config/supabase.js';
import UserRepository from '../../repositories/userRepository.js';
import ForgotPasswordUseCase from '../../core/usecases/ForgotPasswordUseCase.js';
import { ResetPasswordUseCase } from '../../core/usecases/ForgotPasswordUseCase.js';
//user repository for database controle
const userRepo = new UserRepository(supabase);
const userAdminRepo = new UserRepository(supabaseAdmin);
/**
 * @function signUpController
 * @description Handles HTTP request for user signup via email/password.
 *              Validates data, calls SignUpUseCase, and returns created user data.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Incoming JSON body with signup data:
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @param {string} [req.body.first_name] - First name
 * @param {string} [req.body.last_name] - Last name
 * @param {string} [req.body.phone] - User phone number
 * @param {string} [req.body.date_of_birth] - Date of birth in YYYY-MM-DD
 *
 * @param {Object} res - Express response object
 *
 * @returns {JSON} 
 * On Success: Newly created user data  
 * On Failure: Error JSON with status and message
 */
export const signUpController = async (req, res) => {
    try {
        const signUp = new SignUpUseCase(userRepo);
        const user = await signUp.signUpWithEmail(req.body);

        return res.status(201).json({
            status: "success",
            data: user
        });
    } catch (err) {
        return res.status(err.status || 400).json({
            status: "error",
            data: {},
            message: err.message
        });
    }
};


/**
 * @function signInController
 * @description Handles HTTP request for user login via email/password.
 *              Validates data, calls LoginUseCase, and returns session token.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Incoming JSON body with login details:
 * @param {string} req.body.email - Email used for login
 * @param {string} req.body.password - Password used for login
 *
 * @param {Object} res - Express response object
 *
 * @returns {JSON}
 * On Success: 
 *  {
 *     token: { access, refresh },
 *     user: { id, email }
 *  }
 * On Failure:
 *  { error: "message" }
 */
export const signInController = async (req, res) => {
    try {
        const login = new LoginUseCase(userRepo);
        const result = await login.loginWithEmail(req.body);

        return res.status(200).json({
            status: "success",
            data: result
        });
    } catch (err) {
        return res.status(err.status || 401).json({
            status: "error",
            data: {},
            message: err.message
        });
    }
};

/**
 * @function forgotPasswordController
 * @description Handles "forgot password" requests.
 * @argument { email : string }
 */
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const forgotPasswordUseCase = new ForgotPasswordUseCase(userAdminRepo);
    const result = await forgotPasswordUseCase.sendResetEmail({ email });

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: {},
      message: err.message || "Internal Server Error",
    });
  }
};





export const resetPasswordController = async (req, res) => {
  const resetPasswordUseCase = new ResetPasswordUseCase(userAdminRepo);
  try {
    const { newPassword } = req.body;
    const token = req.token; // <- from middleware

    const result = await resetPasswordUseCase.resetPassword({ newPassword , token});

    return res.status(200).json({
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






export const logoutController = async (req, res) => {
  const logoutUseCase = new LogoutUseCase(userRepo.supabase);
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ status: "error", message: "Access token is required." });
    }

    const token = authHeader.split(" ")[1];

    const result = await logoutUseCase.logout(token);

    return res.json(result);
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: {},
      message: err.message || "Internal Server Error"
    });
  }
};
