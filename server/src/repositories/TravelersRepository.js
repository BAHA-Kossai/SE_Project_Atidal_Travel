/**
 * @file        TravelersRepository.js
 * @description Repository class for the "travelers" table.
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