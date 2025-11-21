/**
 * @file        LoginUseCase.js
 * @description Use case class for handling user login.
 *              Supports email/password login.
 *
 * @requires    UserRepository       - Repository for database operations
 * @requires    LoginInValidator      - Validator for login input
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-21
 * @lastModified 2025-11-21
 */

import UserRepository from "../../repositories/userRepository.js";
import supabase from "../../config/supabase.js";
import { comparePassword } from "../../utils/formValidation.js";
import { LogInValidator } from "../../api/validators/LogInValidator.js";

class LoginUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async loginWithEmail(data) {
    // Validate input
    const errors = LogInValidator.validate(data);
    if (errors.length > 0) throw { status: 400, message: errors.join("\n ") };

    const user = await this.userRepository.findByEmail(data.email);
    if (!user) return { status: 404, message: "User not found." };
 
    if (!user.confirmed) {
      // Resend confirmation email via Supabase Auth
      await this.userRepository.registerAuthUser({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        date_of_birth: user.date_of_birth,
        password: "temporaryPassword", 
      });

      return {
        status: 403,
        message: "Email not confirmed. Confirmation email resent.",
      };
    }

    if (user.password_hash === "authByGoogle") {
      return { status: 403, message: "Error: user must log in with Google." };
    }

    const passwordMatch = await comparePassword(
      data.password,
      user.password_hash
    );
    if (!passwordMatch) return { status: 401, message: "Incorrect password." };
   
    // Sign in with Supabase
    const { data: supabaseSession, error } =
      await this.userRepository.supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
    if (error) throw { status: 500, message: error.message };



    return supabaseSession ;
  }
}

export default LoginUseCase;
