/**
 * @file        TripInfoRepository.js
 * @description Repository class for the "TripInfo" table.
 *              Extends BaseRepository and provides CRUD operations for trip information.
 *              Handles database access logic for trip details, pricing, and scheduling.
 *
 * @extends     BaseRepository
 * @requires    BaseRepository - Base repository class for common operations
 *
 * @author      Ahlem Toubrient
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 *
 * @notes       - This repository contains only database access logic for TripInfo
 *              - Business logic should be placed in service/use case layer
 *              - All methods return Promise-based results from Supabase
 *
 * Usage Example:
 * 
 * import TripInfoRepository from './TripInfoRepository.js';
 * const tripInfoRepo = new TripInfoRepository(supabaseClient);
 * 
 * // Create new trip info
 * const tripInfo = await tripInfoRepo.createTripInfo(tripData);
 * 
 * // Get trip info by ID
 * const info = await tripInfoRepo.getTripInfoById(1);
 */

import BaseRepository from './baseRepository.js';

class TripInfoRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'TripInfo');
    this.primaryKey = 'info_id';
  }

  // CRUD methods

  async createTripInfo(tripInfoData) {
    return this.create(tripInfoData);
  }

  async getTripInfoById(id) {
    return this.getById(this.primaryKey, id);
  }

  async updateTripInfo(id, updates) {
    const updatedRecord = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.update(this.primaryKey, id, updatedRecord);
  }

  async deleteTripInfo(id) {
    return this.delete(this.primaryKey, id);
  }
}

export default TripInfoRepository;