/**
 * @file        BookingsRepository.js
 * @description Repository class for the "bookings" table.
 *              Extends BaseRepository and provides generic CRUD operations
 *              along with entity-specific methods for different booking types.
 *              Contains only database access logic for Bookings entity.
 *
 * @extends     BaseRepository
 * @requires    BaseRepository - Base repository class for common operations
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 *
 * @notes       - This repository contains only database access logic for Bookings
 *              - Business logic should be placed in service/use case layer
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

  // Find bookings by user ID with complete trip information
  async findBookingsByUserId(userId) {
    try {
      console.log('=== REPOSITORY: findBookingsByUserId START ===');
      console.log(`📊 Input: userId = ${userId} (type: ${typeof userId})`);
      console.log(`📊 Table: ${this.table}`);
      
      // First, let's test if the table exists and we can query it
      console.log('🔍 Testing basic query without join...');
      const { data: testData, error: testError } = await this.supabase
        .from(this.table)
        .select('booking_id, user_id, type')
        .eq('user_id', userId)
        .limit(1);
      
      console.log(`🔍 Basic test query result:`, testData);
      console.log(`🔍 Basic test query error:`, testError);
      
      if (testError) {
        console.error('❌ Basic query failed:', testError);
        throw testError;
      }
      
      // Now try with the join
      console.log('🔍 Trying query WITH join...');
      const { data, error } = await this.supabase
        .from(this.table)
        .select(`
          *,
          TripInfo:info_id (*)
        `)
        .eq('user_id', userId);
      
      console.log(`📥 Query completed`);
      console.log(`   Error:`, error);
      console.log(`   Error details:`, error?.message, error?.details, error?.hint);
      console.log(`   Data count: ${data?.length || 0}`);
      
      if (error) {
        console.error('❌ Join query failed:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // If join fails, try without it
        console.log('🔄 Falling back to query without join...');
        const { data: simpleData, error: simpleError } = await this.supabase
          .from(this.table)
          .select('*')
          .eq('user_id', userId);
        
        if (simpleError) {
          console.error('❌ Simple query also failed:', simpleError);
          throw simpleError;
        }
        
        console.log(`✅ Simple query found ${simpleData?.length || 0} bookings`);
        return simpleData || [];
      }
      
      console.log(`✅ Join query found ${data?.length || 0} bookings`);
      console.log('=== REPOSITORY: findBookingsByUserId END ===');
      
      return data || [];
      
    } catch (error) {
      console.error('🔴 EXCEPTION in findBookingsByUserId:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
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




}

export default BookingsRepository;