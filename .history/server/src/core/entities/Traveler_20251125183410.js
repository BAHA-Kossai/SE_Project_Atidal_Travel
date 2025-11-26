/**
 * @file Traveler.js
 * @description Traveler entity linked to a booking/payer.
 */
class Traveler {
  constructor({
    travelerId = null,
    bookingId,
    responsibleBookingId = null,
    responsibleId = null,
    firstName,
    lastName,
    email = null,
    phone = null,
    passportNumber,
    gender,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.travelerId = travelerId;
    this.bookingId = bookingId;
    this.responsibleBookingId = responsibleBookingId;
    this.responsibleId = responsibleId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.passportNumber = passportNumber;
    this.gender = gender;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(record = {}) {
    return new Traveler({
      travelerId: record.travler_id ?? record.traveler_id,
      bookingId: record.booking_id,
      responsibleBookingId: record.responsible_booking_id,
      responsibleId: record.responsible_id,
      firstName: record.first_name,
      lastName: record.last_name,
      email: record.email,
      phone: record.phone,
      passportNumber: record.passport_number,
      gender: record.gender,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  toPersistence() {
    return {
      travler_id: this.travelerId,
      booking_id: this.bookingId,
      responsible_booking_id: this.responsibleBookingId,
      responsible_id: this.responsibleId,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone,
      passport_number: this.passportNumber,
      gender: this.gender,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
}

export default Traveler;

