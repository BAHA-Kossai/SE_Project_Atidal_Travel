import express from "express";
import { verifySupabaseToken, requireSuperAdmin } from "../middlewares/authMiddleware.js";
import { assignBranchController } from "../controllers/BookingController.js";

const router = express.Router();

// PATCH /bookings/assign-branch
router.patch(
  "/assign-branch",
  verifySupabaseToken,
  requireSuperAdmin,
  assignBranchController
);

export default router;
