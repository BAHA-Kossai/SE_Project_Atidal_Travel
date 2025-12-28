/**
 * @file        TravelersRepository.js
 * @description Repository class for the "Travelers" table.
 *              Extends BaseRepository and provides CRUD operations for travelers management.
 *              Handles database operations for traveler information linked to payers and bookings.
 *
 * @extends     BaseRepository
 * @requires    BaseRepository - Base repository class for common operations
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 *
 * @notes       - This repository contains only database access logic for Travelers
 *              - Business logic should be placed in service/use case layer
 *              - Supports batch operations for multiple travelers
 *              - All methods return Promise-based results from Supabase
 *
 * Usage Example:
 * 
 * import TravelersRepository from './TravelersRepository.js';
 * const travelersRepo = new TravelersRepository(supabaseClient);
 * 
 * // Create single traveler
 * const traveler = await travelersRepo.createTraveler(travelerData);
 * 
 * // Create multiple travelers
 * const travelers = await travelersRepo.createTravelersBatch(travelersData);
 * 
 * // Find travelers by payer booking ID
 * const travelers = await travelersRepo.findTravelersByPayerBookingId(123);
 */

import BaseRepository from './baseRepository.js';

class TravelersRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'Travelers');
    this.primaryKey = 'traveler_id';
  }

  // Get all travelers with pagination and filtering
  async getAllTravelers(filters = {}) {
    let query = this.supabase.from(this.table).select('*');
    
    if (filters.booking_id) {
      query = query.eq('booking_id', filters.booking_id);
    }
    if (filters.traveler_id) {
      query = query.eq('traveler_id', filters.traveler_id);
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

  // Get single traveler by ID
  async getTravelerById(travelerId) {
    return this.getById(this.primaryKey, travelerId);
  }

  // Get travelers by booking ID
  async getTravelersByBookingId(bookingId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('booking_id', bookingId);
    
    if (error) throw error;
    return data;
  }

  // Create traveler
  async createTraveler(travelerData) {
    return this.create(travelerData);
  }

  // Update traveler by ID
  async updateTraveler(travelerId, updates) {
    return this.update(this.primaryKey, travelerId, updates);
  }

  // Delete traveler by ID
  async deleteTraveler(travelerId) {
    return this.delete(this.primaryKey, travelerId);
  }

  // Legacy methods for backward compatibility
  async createTravelersBatch(travelersData) {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert(travelersData)
      .select();
    
    if (error) throw error;
    return data;
  }

  // Find travelers by payer_booking_id (if you want to keep the original relationship)
  async findTravelersByPayerBookingId(bookingId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('payer_id', bookingId);
    
    if (error) throw error;
    return data;
  }
}

export default TravelersRepository;