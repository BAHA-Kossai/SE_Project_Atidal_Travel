/**
 * @file        PayerRepository.js
 * @description Repository class for the "Payer" table.
 *              Extends BaseRepository and provides CRUD operations for payer management.
 *              Handles database operations for payer information linked to bookings.
 *
 * @extends     BaseRepository
 * @requires    BaseRepository - Base repository class for common operations
 *
 * @author      Ahlem Toubrinet, Abderrahim
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 *
 * @notes       - This repository contains only database access logic for Payers
 *              - Business logic should be placed in service/use case layer
 *              - Uses booking_id as primary key for payer records
 *              - All methods return Promise-based results from Supabase
 *
 * Usage Example:
 * 
 * import PayerRepository from './PayerRepository.js';
 * const payerRepo = new PayerRepository(supabaseClient);
 * 
 * // Create new payer
 * const payer = await payerRepo.createPayer(payerData);
 * 
 * // Find payer by booking ID
 * const payer = await payerRepo.findPayerByBookingId(123);
 */

import BaseRepository from './baseRepository.js';

class PayerRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'Payer');
    this.primaryKey = 'id';
  }

  // Get all payers with pagination and filtering
  async getAllPayers(filters = {}) {
    let query = this.supabase.from(this.table).select('*');
    
    if (filters.booking_id) {
      query = query.eq('booking_id', filters.booking_id);
    }
    if (filters.first_name) {
      query = query.ilike('first_name', `%${filters.first_name}%`);
    }
    if (filters.last_name) {
      query = query.ilike('last_name', `%${filters.last_name}%`);
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Get single payer by ID
  async getPayerById(payerId) {
    return this.getById(this.primaryKey, payerId);
  }

  // Get payers by booking ID
  async getPayersByBookingId(bookingId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('booking_id', bookingId);
    
    if (error) throw error;
    return data;
  }

  // Create payer
  async createPayer(payerData) {
    return this.create(payerData);
  }

  // Update payer by ID
  async updatePayer(payerId, updates) {
    return this.update(this.primaryKey, payerId, updates);
  }

  // Delete payer by ID
  async deletePayer(payerId) {
    return this.delete(this.primaryKey, payerId);
  }

  // Legacy methods for backward compatibility
  async findPayerByBookingId(bookingId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('booking_id', bookingId)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePayerByBookingId(bookingId, updates) {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(updates)
      .eq('booking_id', bookingId)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async deletePayerByBookingId(bookingId) {
    return this.delete('booking_id', bookingId);
  }
}

export default PayerRepository;