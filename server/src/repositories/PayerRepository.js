/**
 * @file        PayerRepository.js
 * @description Repository class for the "payers" table.
 */

import BaseRepository from './baseRepository.js';

class PayerRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'Payer');
    this.primaryKey = 'booking_id'; // Use booking_id as primary key
  }

  // Create a new payer
  async createPayer(payerData) {
    return this.create(payerData);
  }

  // Find payer by booking_id
  async findPayerByBookingId(bookingId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('booking_id', bookingId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Update payer by booking_id
  async updatePayerByBookingId(bookingId, updates) {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(updates)
      .eq('booking_id', bookingId)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  // Delete payer by booking_id
  async deletePayerByBookingId(bookingId) {
    return this.delete('booking_id', bookingId);
  }
}

export default PayerRepository;