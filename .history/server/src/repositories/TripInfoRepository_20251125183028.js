import BaseRepository from './baseRepository.js';

class TripInfoRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'TripInfo');
    this.primaryKey = 'trip_info_id';
  }

  getTripInfoById(id) {
    return this.getById(this.primaryKey, id);
  }

  createTripInfo(record) {
    return this.create(record);
  }

  updateTripInfo(id, updates) {
    const patch = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.update(this.primaryKey, id, patch);
  }

  deleteTripInfo(id) {
    return this.delete(this.primaryKey, id);
  }

  async getTripInfosByGuidedTrip(guided_trip_id) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('guided_trip_id', guided_trip_id);

    if (error) {
      throw error;
    }
    return data;
  }

  async listTripInfos({
    guided_trip_id,
    destination_id,
    branch_id,
    limit = 20,
    offset = 0
  } = {}) {
    let query = this.supabase
      .from(this.table)
      .select('*', { count: 'exact' })
      .order('trip_date', { ascending: true });

    if (guided_trip_id) {
      query = query.eq('guided_trip_id', guided_trip_id);
    }
    if (destination_id) {
      query = query.eq('destination_id', destination_id);
    }
    if (branch_id) {
      query = query.eq('branch_id', branch_id);
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

  async getTripInfosByTripIds(tripIds = []) {
    if (!Array.isArray(tripIds) || tripIds.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .in('guided_trip_id', tripIds);

    if (error) {
      throw error;
    }

    return data;
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

  async adjustAvailableSeats(tripInfoId, delta) {
    const existing = await this.getTripInfoById(tripInfoId);
    if (!existing) {
      throw new Error('Trip info not found');
    }

    const nextSeats = (existing.available_seats || 0) + delta;
    if (nextSeats < 0) {
      throw new Error('Not enough available seats for this departure');
    }
    if (nextSeats > (existing.max_seats || 0)) {
      throw new Error('Available seats cannot exceed max seats');
    }

    const updated = await this.updateTripInfo(tripInfoId, {
      available_seats: nextSeats
    });
    return updated;
  }
}

export default TripInfoRepository;

