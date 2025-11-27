/**
 * @file GuidedTrip.js
 * @description Template trip entity with optional departure list.
 */
class GuidedTrip {
  constructor({
    tripId = null,
    tripName,
    tripType,
    destinationId,
    branchId,
    guideId,
    description,
    highlights = null,
    coverImagePath = null,
    agendaPdfPath = null,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
    departures = []
  }) {
    this.tripId = tripId;
    this.tripName = tripName;
    this.tripType = tripType;
    this.destinationId = destinationId;
    this.branchId = branchId;
    this.guideId = guideId;
    this.description = description;
    this.highlights = highlights;
    this.coverImagePath = coverImagePath;
    this.agendaPdfPath = agendaPdfPath;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.departures = departures;
  }

  static fromPersistence(record = {}) {
    return new GuidedTrip({
      tripId: record.trip_id,
      tripName: record.trip_name,
      tripType: record.trip_type,
      destinationId: record.destination_id,
      branchId: record.branch_id,
      guideId: record.guide_id,
      description: record.description,
      highlights: record.highlights,
      coverImagePath: record.cover_image_path,
      agendaPdfPath: record.agenda_pdf_path,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      departures: record.departures ?? []
    });
  }

  toPersistence() {
    return {
      trip_id: this.tripId,
      trip_name: this.tripName,
      trip_type: this.tripType,
      destination_id: this.destinationId,
      branch_id: this.branchId,
      guide_id: this.guideId,
      description: this.description,
      highlights: this.highlights,
      cover_image_path: this.coverImagePath,
      agenda_pdf_path: this.agendaPdfPath,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  withDepartures(departures = []) {
    return new GuidedTrip({ ...this, departures });
  }
}

export default GuidedTrip;

