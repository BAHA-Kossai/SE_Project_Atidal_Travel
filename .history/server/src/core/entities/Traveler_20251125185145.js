/**
 * @file Traveler.js
 * @description Traveler entity linked to a payer.
 */

class Traveler {
  constructor({
    travelerId = null,
    payerId,
    firstName,
    lastName,
    age,
    email,
    identityNumber,
    travelerContact,
    passportNumber,
    gender,
    createdAt = new Date().toISOString()
  }) {
    this.travelerId = travelerId;
    this.payerId = payerId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = Number(age);
    this.email = email;
    this.identityNumber = identityNumber;
    this.travelerContact = travelerContact;
    this.passportNumber = passportNumber;
    this.gender = gender;
    this.createdAt = createdAt;
  }

  static fromPersistence(record = {}) {
    return new Traveler({
      travelerId: record.traveler_id,
      payerId: record.payer_id,
      firstName: record.first_name,
      lastName: record.last_name,
      age: record.age,
      email: record.email,
      identityNumber: record.identity_number,
      travelerContact: record.traveler_contact,
      passportNumber: record.passport_number,
      gender: record.gender,
      createdAt: record.created_at
    });
  }

  toPersistence() {
    return {
      traveler_id: this.travelerId,
      payer_id: this.payerId,
      first_name: this.firstName,
      last_name: this.lastName,
      age: this.age,
      email: this.email,
      identity_number: this.identityNumber,
      traveler_contact: this.travelerContact,
      passport_number: this.passportNumber,
      gender: this.gender,
      created_at: this.createdAt
    };
  }
}

export default Traveler;
/**
 * @file Traveler.js
 * @description Traveler entity linked to a booking/payer.
 */

