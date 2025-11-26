/**
 * @file        BookingStatusHistoryRepository.js
 * @description Repository for persisting booking status transitions.
 */

import BaseRepository from './baseRepository.js';

class BookingStatusHistoryRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'Booking_status_history');
    this.primaryKey = 'history_id';
  }

  addHistory(record) {
    return this.create(record);
  }

  getHistoryById(id) {
    return this.getById(this.primaryKey, id);
  }

  async getHistoryForBooking(booking_id) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('booking_id', booking_id)
      .order('changed_at', { ascending: true });
    if (error) throw error;
    return data;
  }

  async deleteByBooking(booking_id) {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq('booking_id', booking_id);
    if (error) throw error;
    return true;
  }
}

export default BookingStatusHistoryRepository;

