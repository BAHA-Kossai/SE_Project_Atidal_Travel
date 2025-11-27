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
      updated_at: new Date().toISOString()
    };
    return this.update(this.primaryKey, id, updatedRecord);
  }

  deleteBooking(id) {
    return this.delete(this.primaryKey, id);
  }

  async filterBookings({
    created_by,
    status,
    branch_id,
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
    if (branch_id) {
      query = query.eq('branch_id', branch_id);
    }
    if (date_from) {
      query = query.gte('created_at', date_from);
    }
    if (date_to) {
      query = query.lte('created_at', date_to);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) throw error;
    return { data, total: count ?? data.length };
  }

  async findBookingsByUserId(userId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  }

  async findBookingsByStatus(status) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('booking_status', status);
    if (error) throw error;
    return data;
  }

  async findBookingsByTripInfo(tripInfoId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('trip_info_id', tripInfoId);
    if (error) throw error;
    return data;
  }

  async findBookingsByTripInfoIds(tripInfoIds = []) {
    if (!Array.isArray(tripInfoIds) || tripInfoIds.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .in('trip_info_id', tripInfoIds);

    if (error) throw error;
    return data;
  }

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
}

export default BookingsRepository;