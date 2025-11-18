/**
 * @file        DestinationsRepository.js
 * @description Repository class for the "destinations" table.
 *              Extends BaseRepository and provides generic CRUD operations
 *              along with entity-specific methods like findDestinationsByCountry.
 * 
 * @extends     BaseRepository
 * 
 * @author      Ahlem
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-17
 * 
 * @notes       - This repository contains only database access logic for Destinations.
 *              - Business logic (validation, operational rules, etc.) should be placed in service layer.
 *              - All methods return data or throw errors from Supabase.
 * 
 * Usage Example:
 * 
 * import DestinationsRepository from './DestinationsRepository.js';
 * const destinationRepo = new DestinationsRepository(supabaseClient);
 * 
 * // Fetch all destinations
 * const destinations = await destinationRepo.getAllDestinations();
 * 
 * // Fetch a destination by ID
 * const destination = await destinationRepo.getDestinationById(1);
 * 
 * // Find destinations by country
 * const countryDestinations = await destinationRepo.findDestinationsByCountry('France');
 * 
 * // Search destinations by city
 * const cityDestinations = await destinationRepo.searchDestinationsByCity('Paris');
 */

import BaseRepository from './baseRepository.js';

class DestinationsRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'Destinations');
    this.primaryKey = 'destination_id';
  }

  // CRUD methods
  getAllDestinations() {
    return this.getAll();
  }

  getDestinationById(id) {
    return this.getById(this.primaryKey, id);
  }

  createDestination(record) {
    return this.create(record);
  }

  updateDestination(id, updates) {
    // Optional: add updated_at if you have such a column
    const updatedRecord = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.update(this.primaryKey, id, updatedRecord);
  }

  deleteDestination(id) {
    return this.delete(this.primaryKey, id);
  }

  // Custom methods

  // Search destinations by city name (partial match)
  async searchDestinationsByCity(city) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .ilike('destination_city', `%${city}%`);
    if (error) throw error;
    return data;
  }

  // Search destinations by country name (partial match)
  async searchDestinationsByCountry(country) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .ilike('destination_country', `%${country}%`);
    if (error) throw error;
    return data;
  }

}

export default DestinationsRepository;