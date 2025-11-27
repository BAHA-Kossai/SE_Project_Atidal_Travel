import BaseRepository from './baseRepository.js';

class TripInfoRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'Tripinfo');
    this.primaryKey = 'info_id';
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
}

export default TripInfoRepository;

