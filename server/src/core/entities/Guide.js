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
 */

class Guide {
  constructor({
    guide_id,
    created_at,
    first_name,
    last_name,
    phone,
    experiance,
    birth_date
  }) {
    this.guide_id = guide_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
    this.experiance = experiance || 'no experience';
    this.birth_date = birth_date;
    this.created_at = created_at || new Date(); // default to now if not provided
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
