/**
 * @file        bookingsRoutes.js
 * @description Routes for booking API endpoints
 * 
 * @author      Abderahim, Ahlem Toubrient, kossai BAHA
 * @version     1.0.0
 * @date        2025-11-22
 */

import express from "express";
import {
  verifySupabaseToken,
  requireSuperAdmin,
  requireAdmin_or_SuperAdmin,
} from "../middlewares/authMiddleware.js";
import {
  assignBranchController,
  updateBookingStatusController,
} from "../controllers/bookingsController.js";


import bookingsController from "../controllers/bookingsController.js";

const router = express.Router();


router.use((req, res, next) => {
  next();
});


router.post("/create", bookingsController.createBooking);


router.get("/user/:userId", (req, res, next) => {
  next();
}, bookingsController.getUserBookings);

router.patch(
  "/assign-branch",
  verifySupabaseToken,
  requireSuperAdmin,
  assignBranchController
);

router.patch(
  "/update-status",
  verifySupabaseToken,
  requireAdmin_or_SuperAdmin,
  updateBookingStatusController
);

export default router;