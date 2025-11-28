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

  // Create a new traveler
  async createTraveler(travelerData) {
    return this.create(travelerData);
  }

  // Create multiple travelers in batch
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