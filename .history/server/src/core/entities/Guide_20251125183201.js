/**
 * @file Guide.js
 * @description Domain model for travel guides.
 */
class Guide {
  constructor({
    guideId = null,
    branchId = null,
    firstName,
    lastName,
    contact,
    experience = null,
    dateOfBirth,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.guideId = guideId;
    this.branchId = branchId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.contact = contact;
    this.experience = experience;
    this.dateOfBirth = dateOfBirth;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(record = {}) {
    return new Guide({
      guideId: record.guide_id,
      branchId: record.branch_id,
      firstName: record.first_name,
      lastName: record.last_name,
      contact: record.guide_contact ?? record.phone,
      experience: record.experience,
      dateOfBirth: record.date_of_birth,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  toPersistence() {
    return {
      guide_id: this.guideId,
      branch_id: this.branchId,
      first_name: this.firstName,
      last_name: this.lastName,
      guide_contact: this.contact,
      experience: this.experience,
      date_of_birth: this.dateOfBirth,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
}

export default Guide;

