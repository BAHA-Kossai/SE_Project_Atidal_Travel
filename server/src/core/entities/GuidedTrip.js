/**
 * @file GuidedTrip.js
 * @description Guided trip template linked to a Tripinfo row.
 */

class GuidedTrip {
  constructor({
    tripId = null,
    availableSeats,
    tripAgenda = null,
    createdBy = null,
    description,
    type,
    infoId,
    imagePath = null,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
    tripInfo = null
  }) {
    this.tripId = tripId;
    this.availableSeats = Number(availableSeats);
    this.tripAgenda = tripAgenda;
    this.createdBy = createdBy;
    this.description = description;
    this.type = type;
    this.infoId = infoId;
    this.imagePath = imagePath;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.tripInfo = tripInfo;
  }

  static fromPersistence(record = {}) {
    return new GuidedTrip({
      tripId: record.trip_id,
      availableSeats: record.available_seats,
      tripAgenda: record.trip_agenda,
      createdBy: record.created_by,
      description: record.description,
      type: record.type,
      infoId: record.info_id,
      imagePath: record.image_path ?? record.imgae_path,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      tripInfo: record.trip_info ?? null
    });
  }

  toPersistence() {
    return {
      trip_id: this.tripId,
      available_seats: this.availableSeats,
      trip_agenda: this.tripAgenda,
      created_by: this.createdBy,
      description: this.description,
      type: this.type,
      info_id: this.infoId,
      image_path: this.imagePath,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  withTripInfo(tripInfo) {
    return new GuidedTrip({ ...this, tripInfo });
  }
}

export default GuidedTrip;
