/**
 * @file        BookingsRepository.js
 * @description Repository class for the "bookings" table.
 *              Extends BaseRepository and provides generic CRUD operations
 *              along with entity-specific methods for different booking types.
 * 
 * @extends     BaseRepository
 * 
 * @author      Ahlem
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-17
 * 
 * @notes       - This repository contains only database access logic for Bookings.
 *              - Business logic (validation, operational rules, etc.) should be placed in service layer.
 *              - Bookings are independent from destinations (no joins needed).
 * 
 * Usage Example:
 * 
 * import BookingsRepository from './BookingsRepository.js';
 * const bookingRepo = new BookingsRepository(supabaseClient);
 * 
 * // Fetch all bookings
 * const bookings = await bookingRepo.getAllBookings();
 * 
 * // Fetch bookings by type
 * const normalBookings = await bookingRepo.findBookingsByType('normal');
 * const guidedTrips = await bookingRepo.findBookingsByType('guided_trip');
 * const umrahTrips = await bookingRepo.findBookingsByType('umrah_trip');
 */

import BaseRepository from './baseRepository.js';

class BookingsRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'Booking');
    this.primaryKey = 'booking_id';
  }

  // CRUD methods
  getAllBookings() {
    return this.getAll();
  }

  getBookingById(id) {
    return this.getById(this.primaryKey, id);
  }

  createBooking(record) {
    return this.create(record);
  }

  updateBooking(id, updates) {
    const updatedRecord = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.update(this.primaryKey, id, updatedRecord);
  }

  deleteBooking(id) {
    return this.delete(this.primaryKey, id);
  }

  // Custom methods

  async filterBookings({
    created_by,
    status,
    date_from,
    date_to,
    limit = 10,
    offset = 0
  }) {
    const from = Number(offset);
    const to = from + Number(limit) - 1;

    let query = this.supabase
      .from(this.table)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (created_by) {
      query = query.eq('created_by', created_by);
    }
    if (status) {
      query = query.eq('booking_status', status);
    }
    if (date_from) {
      query = query.gte('booking_date', date_from);
    }
    if (date_to) {
      query = query.lte('booking_date', date_to);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) throw error;
    return { data, total: count ?? data.length };
  }

  // Find bookings by user ID
  async findBookingsByUserId(userId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  }

  // Find bookings by status
  async findBookingsByStatus(status) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('booking_status', status);
    if (error) throw error;
    return data;
  }

  // Find bookings by type (normal, guided_trip, umrah_trip)
  async findBookingsByType(bookingType) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('type', bookingType);
    if (error) throw error;
    return data;
  }

  // Find user bookings by type
  async findUserBookingsByType(userId, bookingType) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .eq('type', bookingType);
    if (error) throw error;
    return data;
  }

  // Find bookings within a date range
  async findBookingsByDateRange(startDate, endDate) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .gte('departure_time', startDate)
      .lte('returning_time', endDate);
    if (error) throw error;
    return data;
  }

  // Find upcoming bookings (future check-ins)
  async getUpcomingBookings() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .gte('departure_time', today);
    if (error) throw error;
    return data;
  }

  // Find upcoming bookings by type
  async getUpcomingBookingsByType(bookingType) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('_type', bookingType)
      .gte('departure_time', today);
    if (error) throw error;
    return data;
  }

  // Update booking status
  async updateBookingStatus(id, status) {
    const { data, error } = await this.supabase
      .from(this.table)
      .update({ 
        booking_status: status,
        updated_at: new Date().toISOString()
      })
      .eq(this.primaryKey, id)
      .select();
    if (error) throw error;
    return data[0];
  }

  // Get bookings with pagination
  async getBookingsPaginated(page = 1, pageSize = 10) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await this.supabase
      .from(this.table)
      .select('*', { count: 'exact' })
      .range(from, to);
    
    if (error) throw error;
    return { data, totalCount: count };
  }

  // Get bookings by type with pagination
  async getBookingsByTypePaginated(bookingType, page = 1, pageSize = 10) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await this.supabase
      .from(this.table)
      .select('*', { count: 'exact' })
      .eq('type', bookingType)
      .range(from, to);
    
    if (error) throw error;
    return { data, totalCount: count };
  }

  async getBookingsByTrip(tripId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('trip_id', tripId);
    if (error) throw error;
    return data;
  }
}

export default BookingsRepository;