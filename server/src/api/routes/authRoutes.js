/**
 * @file        authRoutes.js
 * @description Defines all authentication-related HTTP routes for the server.
 *              Handles signup and signin operations for users.
 *              Routes parse incoming request data, call the corresponding UseCases, 
 *              and send appropriate JSON responses back to the client.
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-21
 * @lastModified 2025-11-21
 *
 * @notes       - This file should not contain business logic; delegate logic to UseCases.
 *              - Handles POST requests for '/auth/signup' and '/auth/signin'.
 *              - Returns JSON responses with either success data or error messages.
 *              - Works with pure Node.js HTTP server (no Express).
 */


/**
 * authRouter
 * @function
 * @description Handles authentication routes: signup and signin.
 *              Parses request body, calls the appropriate UseCase, and returns JSON responses.
 * @param {http.IncomingMessage} req - The incoming HTTP request object.
 * @param {http.ServerResponse} res - The HTTP response object used to send data back to the client.
 * @returns {void} - Sends JSON response directly via the res object.
 *
 * @throws {Error} - Throws errors internally if UseCase execution fails. Errors are returned in JSON responses.
 *
 * @notes
 * - This function does not return values; responses are sent through the res object.
 * - Request body is expected to be JSON; parse accordingly.
 * - All errors should be handled gracefully and returned with proper HTTP status codes.
 */
import express from 'express';
import { signUpController, signInController,forgotPasswordController,resetPasswordController,logoutController } from '../controllers/authController.js';
import { validateResetToken,verifySupabaseToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', signUpController);

// POST /api/auth/signin
router.post('/signin', signInController);

// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPasswordController);

// POST /api/auth/reset-password
router.post("/reset-password", validateResetToken, resetPasswordController);

// POST /api/auth/signout
router.post("/signout",  logoutController);

export default router;
