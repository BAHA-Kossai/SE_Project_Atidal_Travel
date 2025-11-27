/**
 * @file Destination.js
 * @description Domain representation of a destination row.
 */
class Destination {
  constructor({
    destinationId = null,
    createdBy = null,
    country,
    city,
    description = null,
    picturePath = null,
    createdAt = new Date().toISOString()
  }) {
    this.destinationId = destinationId;
    this.createdBy = createdBy;
    this.country = country;
    this.city = city;
    this.description = description;
    this.picturePath = picturePath;
    this.createdAt = createdAt;
  }

  static fromPersistence(record = {}) {
    return new Destination({
      destinationId: record.destination_id,
      createdBy: record.created_by,
      country: record.destination_country,
      city: record.destination_city,
      description: record.description,
      picturePath: record.destination_pic,
      createdAt: record.created_at
    });
  }

  toPersistence() {
    return {
      destination_id: this.destinationId,
      created_by: this.createdBy,
      destination_country: this.country,
      destination_city: this.city,
      description: this.description,
      destination_pic: this.picturePath,
      created_at: this.createdAt
    };
  }
}

export default Destination;

