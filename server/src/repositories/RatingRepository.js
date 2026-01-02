import BaseRepository from './baseRepository.js';

class RatingRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'Rating');
    this.primaryKey = 'rating_id';
  }

  getAllRatings() {
    return this.getAll();
  }

  getRatingById(id) {
    return this.getById(this.primaryKey, id);
  }

  createRating(record) {
    return this.create(record);
  }

  updateRating(id, updates) {
    const updatedRecord = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.update(this.primaryKey, id, updatedRecord);
  }

  deleteRating(id) {
    return this.delete(this.primaryKey, id);
  }

  async getAllApprovedRatings() {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(`
        *,
        Users:user_id (
          user_id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('approved', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }


  async getApprovedRatingsWithLimit(limit = null) {
    let query = this.supabase
      .from(this.table)
      .select(`
        *,
        Users:user_id (
          user_id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }


  async approveRating(rating_id) {
    const { data, error } = await this.supabase
      .from(this.table)
      .update({ approved: true, updated_at: new Date().toISOString() })
      .eq(this.primaryKey, rating_id)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async getRatingsWithUserDetails(limit = null) {
    let query = this.supabase
      .from(this.table)
      .select(`
        *,
        Users:user_id (
          user_id,
          email,
          first_name,
          last_name
        )
      `)
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}

export default RatingRepository;