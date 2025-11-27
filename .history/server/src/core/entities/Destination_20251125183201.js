/**
 * @file Destination.js
 * @description Domain representation of a destination row.
 */
class Destination {
  constructor({
    destinationId = null,
    country,
    city,
    description = null,
    picturePath = null,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.destinationId = destinationId;
    this.country = country;
    this.city = city;
    this.description = description;
    this.picturePath = picturePath;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(record = {}) {
    return new Destination({
      destinationId: record.destination_id,
      country: record.country ?? record.destination_country,
      city: record.city ?? record.destination_city,
      description: record.description,
      picturePath: record.picture_path ?? record.destination_pic,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  toPersistence() {
    return {
      destination_id: this.destinationId,
      country: this.country,
      city: this.city,
      description: this.description,
      picture_path: this.picturePath,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
}

export default Destination;

