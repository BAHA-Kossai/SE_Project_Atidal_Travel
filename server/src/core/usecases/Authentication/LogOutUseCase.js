/**
 * @file        LogoutUseCase.js
 * @description Use case class for handling user logout.
 *              Logs out the user by revoking the Supabase session token.
 *
 * @requires    UserRepository       - Repository for database operations and Supabase client
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-22
 */

class LogoutUseCase {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  async logout(accessToken) {
    if (!accessToken) {
      throw { status: 400, message: "Access token is required for logout." };
    }

    const { error } = await this.supabase.auth.signOut({ 
      access_token: accessToken 
    });

    if (error) throw { status: 500, message: error.message };

    return { status: "success", message: "User logged out successfully." };
  }
}

export default LogoutUseCase;
