import UpdateUserUseCase from "../../core/usecases/Users/UpdateUserUseCase.js";
import UserRepository from "../../repositories/userRepository.js";
import DeleteUserUseCase from "../../core/usecases/Users/DeleteUserUseCase.js";
import { supabaseAdmin } from "../../config/supabase.js";
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
        message: "No access token provided"
      });
    }
    const accessToken = authHeader.split(" ")[1];

    // Pass the token to the use case
    const result = await updateUserUseCase.updateInfo(authUser, updateData, accessToken);

    return res.status(200).json({
      status: "success",
      data: result.data,
      message: result.message
    });

  } catch (err) {
    return res.status(err.status || 500).json({
      status: "error",
      data: {},
      message: err.message || "Something went wrong"
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
        message: "Unauthorized"
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
      message: err.message || "Something went wrong"
    });
  }
};