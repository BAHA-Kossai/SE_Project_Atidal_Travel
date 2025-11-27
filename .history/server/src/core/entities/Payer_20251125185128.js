/**
 * @file Payer.js
 * @description Represents the payer attached to a booking.
 */

class Payer {
  constructor({
    bookingId,
    firstName,
    lastName,
    phone,
    confirmedAt = null,
    cancelledAt = null,
    bookingNotes = null,
    createdAt = new Date().toISOString()
  }) {
    this.bookingId = bookingId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.confirmedAt = confirmedAt;
    this.cancelledAt = cancelledAt;
    this.bookingNotes = bookingNotes;
    this.createdAt = createdAt;
  }

  static fromPersistence(record = {}) {
    return new Payer({
      bookingId: record.booking_id,
      firstName: record.first_name,
      lastName: record.last_name,
      phone: record.phone,
      confirmedAt: record.confirmed_at,
      cancelledAt: record.cancelled_at,
      bookingNotes: record.booking_notes,
      createdAt: record.created_at
    });
  }

  toPersistence() {
    return {
      booking_id: this.bookingId,
      first_name: this.firstName,
      last_name: this.lastName,
      phone: this.phone,
      confirmed_at: this.confirmedAt,
      cancelled_at: this.cancelledAt,
      booking_notes: this.bookingNotes,
      created_at: this.createdAt
    };
  }
}

export default Payer;
/**
 * @file Payer.js
 * @description Represents the payer attached to a booking.
 */

