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
import supabase from "../../config/supabase.js";

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

// Add this route to see ALL bookings and their user_ids
router.get('/debug/all-bookings', async (req, res) => {
  try {
    console.log('🧪 DEBUG: Fetching ALL bookings from database...');
    
    const { data, error, count } = await supabase
      .from('Booking')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('❌ DEBUG Error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log(`🧪 DEBUG: Found ${count} total bookings in database`);
    console.log(`🧪 DEBUG: Showing ${data.length} recent bookings`);
    
    // Log each booking's user_id
    data.forEach((booking, index) => {
      console.log(`📋 Booking ${index + 1}:`);
      console.log(`   ID: ${booking.booking_id}`);
      console.log(`   User ID: ${booking.user_id} (type: ${typeof booking.user_id})`);
      console.log(`   Type: ${booking.type}`);
      console.log(`   Status: ${booking.booking_status}`);
      console.log(`   Created: ${booking.created_at}`);
      console.log('---');
    });
    
    return res.json({
      debug_info: {
        total_bookings_in_db: count,
        sample_shown: data.length,
        message: "Check server console for detailed logs"
      },
      sample_bookings: data.map(b => ({
        booking_id: b.booking_id,
        user_id: b.user_id,
        user_id_type: typeof b.user_id,
        type: b.type,
        status: b.booking_status,
        created_at: b.created_at
      }))
    });
    
  } catch (error) {
    console.error('🔴 DEBUG Exception:', error);
    return res.status(500).json({ error: error.message });
  }
});

// In bookingsRoutes.js, add:
router.get('/test-logging', (req, res) => {
  console.log('🧪 TEST LOGGING: This should appear in server terminal');
  console.log('🧪 Time:', new Date().toISOString());
  res.json({ message: 'Check server terminal for logs' });
});

export default router;