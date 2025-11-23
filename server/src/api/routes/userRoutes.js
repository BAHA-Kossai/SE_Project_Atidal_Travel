import express from "express";
import { verifySupabaseToken } from "../middlewares/authMiddleware.js";
import { updateUserController } from "../controllers/userController.js";
import { deleteUserController } from "../controllers/userController.js";
const router = express.Router();

// PUT /api/user/update-profile
router.put("/update-profile", verifySupabaseToken, updateUserController);
// DELETE /api/user/delete-profile
router.delete("/delete-profile", verifySupabaseToken,deleteUserController );
export default router;
