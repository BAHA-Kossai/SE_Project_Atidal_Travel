
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
    super(supabaseClient, 'Tripinfo');
    this.primaryKey = 'info_id';
  }




  async listTripInfos({
    destination_country,
    destination_city,
    limit = 20,
    offset = 0
  } = {}) {
    let query = this.supabase
      .from(this.table)
      .select('*', { count: 'exact' })
      .order('trip_date', { ascending: true });

    if (destination_country) {
      query = query.ilike('destination_country', `%${destination_country}%`);
    }
    if (destination_city) {
      query = query.ilike('destination_city', `%${destination_city}%`);
    }

    const from = Number(offset);
    const to = from + Number(limit) - 1;
    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw error;
    }

    return {
      data,
      total: count ?? data.length
    };
  }

  async getTripInfosByIds(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .in(this.primaryKey, ids);

    if (error) {
      throw error;
    }

    return data;
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

