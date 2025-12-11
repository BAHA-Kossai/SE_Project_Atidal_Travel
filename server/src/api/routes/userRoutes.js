import express from "express";
import {
  verifySupabaseToken,
  requireSuperAdmin,
} from "../middlewares/authMiddleware.js";
import {
  updateUserController,
  deleteUserController,
  readUserController,
  changePasswordController,
  readAdminsController,
} from "../controllers/userController.js";

const router = express.Router();

// PUT /api/user/update-profile
router.put("/update-profile", verifySupabaseToken, updateUserController);
// DELETE /api/user/delete-profile
router.delete("/delete-profile", verifySupabaseToken, deleteUserController);
// PATCH /api/users/change-password
router.patch("/change-password", verifySupabaseToken, changePasswordController);

// GET /api/user/admins
// Only accessible to SUPER_ADMIN users
router.get(
  "/admins",
  verifySupabaseToken,
  requireSuperAdmin,
  readAdminsController
);
export default router;
