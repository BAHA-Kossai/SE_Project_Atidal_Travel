import UpdateUserUseCase from "../../core/usecases/Users/UpdateUserUseCase.js";
import UserRepository from "../../repositories/userRepository.js";
import DeleteUserUseCase from "../../core/usecases/Users/DeleteUserUseCase.js";
import ChangePasswordUseCase from "../../core/usecases/Users/ChangePasswordUseCase.js";
import { supabaseAdmin } from "../../config/supabase.js";
import ReadUserUseCase, {ReadAdminsUseCase} from "../../core/usecases/Users/ReadUserUseCase.js";
const userRepository = new UserRepository(supabaseAdmin);

// /**
//  * Controller to handle user profile update
//  */

export const updateUserController = async (req, res) => {
  const updateUserUseCase = new UpdateUserUseCase(userRepository);

  try {
    const authUser = req.user; // from verifySupabaseToken
    const updateData = req.body;

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        data: {},
        message: "No access token provided",
      });
    }
    const accessToken = authHeader.split(" ")[1];

    // Pass the token to the use case
    const result = await updateUserUseCase.updateInfo(
      authUser,
      updateData,
      accessToken
    );

    return res.status(200).json({
      status: "success",
      data: result.data,
      message: result.message,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: {},
      message: err.message || "Something went wrong",
    });
  }
};

/**
 * Controller to delete the logged-in user's account
 */
export const deleteUserController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        data: {},
        message: "Unauthorized",
      });
    }

    // Instantiate the use case
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);

    // Use the Supabase token from headers
    const accessToken = req.headers.authorization.split(" ")[1];

    const result = await deleteUserUseCase.deleteUser(accessToken);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: {},
      message: err.message || "Something went wrong",
    });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const authUser = req.user; // set by verifySupabaseToken
    if (!authUser) {
      return res.status(401).json({
        status: "error",
        data: {},
        message: "Unauthorized",
      });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        data: {},
        message: "Current password and new password are required",
      });
    }

    // Attach access token for Supabase
    authUser.accessToken = req.headers.authorization?.split(" ")[1];

    const useCase = new ChangePasswordUseCase(userRepository);
    const result = await useCase.execute(
      authUser,
      currentPassword,
      newPassword
    );

    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: {},
      message: err.message || "Something went wrong",
    });
  }
};

/**
 * @description Controller to allow logged-in users to read their own profile.
 */

export const readUserController = async (req, res) => {
  try {
    const authUser = req.user; // from verifySupabaseToken
    const useCase = new ReadUserUseCase(userRepository);

    const safeData = await useCase.execute(authUser);

    return res.status(200).json({
      status: "success",
      data: safeData,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: {},
      message: err.message || "Something went wrong",
    });
  }
};

export const readAdminsController = async (req, res) => {
  try {
    const authUser = req.user; // set by verifySupabaseToken

    const useCase = new ReadAdminsUseCase(userRepository);
    const admins = await useCase.execute(authUser);

    return res.status(200).json({
      status: "success",
      data: admins,
      message: "Admin users fetched successfully",
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: {},
      message: err.message || "Something went wrong",
    });
  }
};