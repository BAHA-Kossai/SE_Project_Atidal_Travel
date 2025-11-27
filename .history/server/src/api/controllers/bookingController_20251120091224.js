/**
 * @file        bookingController.js
 * @description Controller for handling booking API requests (Read-only)
 *              Routes requests to BookingsRepository and manages business logic
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-18
 */

import BookingsRepository from '../repositories/BookingsRepository.js';

class BookingController {
  constructor(supabaseClient) {
    this.bookingRepo = new BookingsRepository(supabaseClient);
  }

  // READ - Get all bookings
  async getAllBookings(req, res) {
    try {
      const { 
        user_id, 
        status, 
        type, 
        start_date, 
        end_date, 
        limit = 10, 
        offset = 0 
      } = req.query;
      
      let bookings;
      
      if (user_id && type) {
        bookings = await this.bookingRepo.findUserBookingsByType(user_id, type);
      } else if (user_id) {
        bookings = await this.bookingRepo.findBookingsByUserId(user_id);
      } else if (status) {
        bookings = await this.bookingRepo.findBookingsByStatus(status);
      } else if (type) {
        bookings = await this.bookingRepo.findBookingsByType(type);
      } else if (start_date && end_date) {
        bookings = await this.bookingRepo.findBookingsByDateRange(start_date, end_date);
      } else {
        bookings = await this.bookingRepo.getAllBookings();
      }

      // Apply pagination
      const paginatedBookings = bookings.slice(
        parseInt(offset),
        parseInt(offset) + parseInt(limit)
      );

      res.status(200).json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: paginatedBookings,
        total: bookings.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving bookings',
        error: error.message
      });
    }
  }

  // READ - Get booking by ID
  async getBookingById(req, res) {
    try {
      const { id } = req.params;

      const booking = await this.bookingRepo.getBookingById(id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Booking retrieved successfully',
        data: booking
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving booking',
        error: error.message
      });
    }
  }
}

export default BookingController;

