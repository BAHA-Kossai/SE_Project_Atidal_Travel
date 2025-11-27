/**
 * @file        PayersRepository.js
 * @description Repository class for the "Payers" table. Handles CRUD operations
 *              and payer-specific queries such as lookup by booking or email.
 */

import BaseRepository from './baseRepository.js';

class PayersRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'Payer');
    this.primaryKey = 'booking_id';
  }

  getByBookingId(bookingId) {
    return this.getById(this.primaryKey, bookingId);
  }

  createPayer(record) {
    return this.create(record);
  }

  updatePayer(bookingId, updates) {
    return this.update(this.primaryKey, bookingId, updates);
  }

  deletePayer(bookingId) {
    return this.delete(this.primaryKey, bookingId);
  }
}

export default PayersRepository;

