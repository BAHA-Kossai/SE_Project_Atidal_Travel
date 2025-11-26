import express from "express";
import { verifySupabaseToken, requireSuperAdmin,requireAdmin_or_SuperAdmin } from "../middlewares/authMiddleware.js";
import { assignBranchController,updateBookingStatusController } from "../controllers/BookingController.js";

const router = express.Router();

// PATCH /bookings/assign-branch
router.patch(
  "/assign-branch",
  verifySupabaseToken,
  requireSuperAdmin,
  assignBranchController
);

// PATCH /bookings/update-status
router.patch(
  "/update-status",
  verifySupabaseToken,
  requireAdmin_or_SuperAdmin,
  updateBookingStatusController
);

export default router;
