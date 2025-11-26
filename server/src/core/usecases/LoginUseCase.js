/**
 * @file        SignUpUseCase.js
 * @description UseCase for handling user sign-up / registration.
 *              Supports both regular email/password registration and Google OAuth login.
 *              Handles extra validations, default values, and returns user info with supabase token.
 * 
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-18  // date of creation
 * @lastModified 2025-11-18
 * 
 * @notes       - This file contains only business logic related to user registration.
 *              - No database queries should be implemented directly here; use repository for DB access.
 *              - Verifies Supabase authentication and applies additional custom rules if needed.
 *              - Returns an object containing supabaseToken and extra user info for frontend use.
 * 
 * Usage Example:
 * 
 * import SignUpUseCase from './SignUpUseCase.js';
 * const signUpUseCase = new SignUpUseCase(userRepository);
 * 
 * // For email/password sign-up
 * const result = await signUpUseCase.executeEmailSignUp({
 *     email: 'test@test.com',
 *     password: 'securePassword123',
 *     firstName: 'John',
 *     lastName: 'Doe'
 * });
 * console.log(result.supabaseToken, result.userId, result.type);
 * 
 * // For Google OAuth sign-up (frontend handles redirect)
 * const googleResult = await signUpUseCase.executeGoogleSignUp(googleToken);
 * console.log(googleResult.supabaseToken, googleResult.userId, googleResult.type);
 */

