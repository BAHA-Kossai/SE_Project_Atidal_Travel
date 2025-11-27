/**
 * @file        GuidedTripsRepository.js
 * @description Repository class for the "Guided_tips" table.
 *              Extends BaseRepository and provides generic CRUD operations
 *              along with entity-specific methods like findTripsByUser and findTripsByAvailableSeats.
 * 
 * @extends     BaseRepository
 * 
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-17
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
      updated_at: new Date().toISOString(), // optional if you have updated_at
    };
    return this.update(this.primaryKey, id, updatedRecord);
  }

  deleteTrip(id) {
    return this.delete(this.primaryKey, id);
  }

  async getTripByInfoId(infoId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('info_id', infoId)
      .maybeSingle();
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data || null;
  }

  async adjustAvailableSeats(tripId, delta) {
    const trip = await this.getTripById(tripId);
    if (!trip) {
      throw new Error('Guided trip not found');
    }
    const nextSeats = Number(trip.available_seats || 0) + delta;
    if (nextSeats < 0) {
      throw new Error('Not enough available seats');
    }
    return this.updateTrip(tripId, { available_seats: nextSeats });
  }
}

export default GuidedTripsRepository;
