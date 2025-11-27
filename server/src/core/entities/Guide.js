/**
 * @file        Guide.js
 * @description Guide entity representing the core guide object in the system.
 *              Contains properties and minimal helper methods related to a guide.
 * 
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-23
 * @lastModified 2025-11-23
 * 
 * @notes       - This file contains only the domain representation of a Guide.
 *              - No database access or business logic should be implemented here.
 *              - Use this entity in UseCases for business operations.
 * 
 * Usage Example:
 * 
 * import Guide from './Guide.js';
 * const guide = new Guide({ guide_id: 1, first_name: 'John', last_name: 'Doe' });
 * console.log(guide.getFullName()); // John Doe
>>>>>>> feature/backend-repository
 */

class Guide {
  constructor({
    guide_id: guide_id = null,
    first_name: first_name,
    last_name,
    phone,
    experience = null,
    birthDate,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.guide_id = guide_id;
    this.first_name = first_name;
    this.last_name = last_name;
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
  // Helper method to get full name of the guide
  getFullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  // Helper method to calculate guide age
  getAge() {
    if (!this.birth_date) return null;
    const diff = new Date() - new Date(this.birth_date);
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }
}

export default Guide;
