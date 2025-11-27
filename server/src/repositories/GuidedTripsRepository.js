/**
 * @file        GuidedTripsRepository.js
 * @description Repository class for the "Guided_tips" table.
 *              Extends BaseRepository and provides generic CRUD operations
 *              along with entity-specific methods like findTripsByUser and findTripsByAvailableSeats.
 * 
 * @extends     BaseRepository
 * 
 * @author      Kossai Baha, Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 * 
 * @notes       - This repository contains only database access logic for Guided Trips.
 *              - Business logic (validation, authentication, etc.) should be placed in service layer.
 *              - All methods return data or throw errors from Supabase.
 * 
 * Usage Example:
 * 
 * import GuidedTripsRepository from './GuidedTripsRepository.js';
 * const tripRepo = new GuidedTripsRepository(supabaseClient);
 * 
 * // Fetch all trips
 * const trips = await tripRepo.getAllTrips();
 * 
 * // Fetch a trip by ID
 * const trip = await tripRepo.getTripById(1);
 * 
 * // Find trips created by a specific user
 * const userTrips = await tripRepo.findTripsByUser(3);
 * 
 * // Find trips with available seats >= 5
 * const availableTrips = await tripRepo.findTripsByAvailableSeats(5);
 * 
 * // Find trips by type with complete information
 * const guidedTrips = await tripRepo.findTripsByTypeWithInfo('guided_trip', 10);
 */


import BaseRepository from './baseRepository.js';

class GuidedTripsRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'Guided_trips');
    this.primaryKey = 'trip_id';
  }

  // CRUD methods
  getAllTrips() {
    return this.getAll();
  }

  getTripById(id) {
    return this.getById(this.primaryKey, id);
  }

  createTrip(record) {
    return this.create(record);
  }

  updateTrip(id, updates) {
    const updatedRecord = {
      ...updates,
      updated_at: new Date().toISOString(), 
    };
    return this.update(this.primaryKey, id, updatedRecord);
  }

  deleteTrip(id) {
    return this.delete(this.primaryKey, id);
  }

  // Custom methods

  // Find trips by creator (user_id)
  async findTripsByUser(user_id) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('created_by', user_id);
    if (error) throw error;
    return data;
  }

  // Find trips with available seats >= given number
  async findTripsByAvailableSeats(minSeats) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .gte('available_seats', minSeats);
    if (error) throw error;
    return data;
  }

  // Find trips by type with TripInfo joined
  async findTripsByTypeWithInfo(tripType, limit = null) {
    let query = this.supabase
      .from(this.table)
      .select(`
        *,
        TripInfo (*)
      `)
      .eq('type', tripType);

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}

export default GuidedTripsRepository;
