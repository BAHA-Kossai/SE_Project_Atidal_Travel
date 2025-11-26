/**
 * @file Guide.js
 * @description Domain model for travel guides.
 */

class Guide {
  constructor({
    guideId = null,
    firstName,
    lastName,
    phone,
    experience = null,
    birthDate,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.guideId = guideId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.experience = experience;
    this.birthDate = birthDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(record = {}) {
    return new Guide({
      guideId: record.guide_id,
      firstName: record.first_name,
      lastName: record.last_name,
      phone: record.phone,
      experience: record.experience,
      birthDate: record.birth_date,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  toPersistence() {
    return {
      guide_id: this.guideId,
      first_name: this.firstName,
      last_name: this.lastName,
      phone: this.phone,
      experience: this.experience,
      birth_date: this.birthDate,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
}

export default Guide;
