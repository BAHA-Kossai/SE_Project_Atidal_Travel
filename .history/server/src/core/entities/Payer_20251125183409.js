/**
 * @file Payer.js
 * @description Represents the payer attached to a booking.
 */
class Payer {
  constructor({
    payerId = null,
    bookingId,
    firstName,
    lastName,
    email,
    phone,
    passwordHash,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.payerId = payerId;
    this.bookingId = bookingId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(record = {}) {
    return new Payer({
      payerId: record.payer_id,
      bookingId: record.booking_id,
      firstName: record.first_name,
      lastName: record.last_name,
      email: record.email,
      phone: record.phone,
      passwordHash: record.password_hash,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  toPersistence() {
    return {
      payer_id: this.payerId,
      booking_id: this.bookingId,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone,
      password_hash: this.passwordHash,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
}

export default Payer;

