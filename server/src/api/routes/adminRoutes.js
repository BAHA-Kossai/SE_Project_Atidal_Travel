/**
 * @file        adminRoutes.js
 * @description Defines Express routes for admin management.
 *              Routes delegate all business logic to AdminManagementUseCase via controllers.
 *
 * @requires    express                 - Express router
 * @requires    adminController.js      - Controller for admin actions
 * @requires    authMiddleware.js       - Middleware to verify JWT and roles
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-21
 * @lastModified 2025-11-21
 */

import express from 'express';
import { createAdminController,deleteAdminController,updateAdminController } from '../controllers/AdminController.js';
import { verifySupabaseToken, requireSuperAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * POST /admin
 * Create a new admin (Super Admin only)
 */
router.post(
  '/add-admin',
  verifySupabaseToken,   // validate JWT & attach req.user
  requireSuperAdmin,     // ensure SUPER_ADMIN
  createAdminController  // call controller
);

router.delete(
  "/delete",
  verifySupabaseToken,  
  requireSuperAdmin,   
  deleteAdminController,
);

router.put(
  "/update",
  verifySupabaseToken,
  requireSuperAdmin,
  updateAdminController
);

export default router;

