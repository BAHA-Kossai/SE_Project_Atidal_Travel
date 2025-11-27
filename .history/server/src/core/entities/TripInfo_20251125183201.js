/**
 * @file TripInfo.js
 * @description Shared departure entity between guided trips and bookings.
 */
class TripInfo {
  constructor({
    tripInfoId = null,
    guidedTripId = null,
    branchId,
    destinationId,
    guideId = null,
    price,
    tripDate,
    returningDate,
    departureTime,
    returningTime,
    maxSeats,
    availableSeats = maxSeats,
    hotelName = null,
    hotelRating = null,
    accommodation = null,
    visaRequired = false,
    notes = null,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.tripInfoId = tripInfoId;
    this.guidedTripId = guidedTripId;
    this.branchId = branchId;
    this.destinationId = destinationId;
    this.guideId = guideId;
    this.price = Number(price);
    this.tripDate = tripDate;
    this.returningDate = returningDate;
    this.departureTime = departureTime;
    this.returningTime = returningTime;
    this.maxSeats = Number(maxSeats);
    this.availableSeats =
      availableSeats !== undefined && availableSeats !== null
        ? Number(availableSeats)
        : this.maxSeats;
    this.hotelName = hotelName;
    this.hotelRating = hotelRating !== undefined && hotelRating !== null ? Number(hotelRating) : null;
    this.accommodation = accommodation;
    this.visaRequired = Boolean(visaRequired);
    this.notes = notes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(record = {}) {
    return new TripInfo({
      tripInfoId: record.trip_info_id,
      guidedTripId: record.guided_trip_id,
      branchId: record.branch_id,
      destinationId: record.destination_id,
      guideId: record.guide_id,
      price: record.price,
      tripDate: record.trip_date,
      returningDate: record.returning_date,
      departureTime: record.departure_time,
      returningTime: record.returning_time,
      maxSeats: record.max_seats,
      availableSeats: record.available_seats,
      hotelName: record.hotel_name,
      hotelRating: record.hotel_rating,
      accommodation: record.accommodation,
      visaRequired: record.visa_required,
      notes: record.notes,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  toPersistence() {
    return {
      trip_info_id: this.tripInfoId,
      guided_trip_id: this.guidedTripId,
      branch_id: this.branchId,
      destination_id: this.destinationId,
      guide_id: this.guideId,
      price: this.price,
      trip_date: this.tripDate,
      returning_date: this.returningDate,
      departure_time: this.departureTime,
      returning_time: this.returningTime,
      max_seats: this.maxSeats,
      available_seats: this.availableSeats,
      hotel_name: this.hotelName,
      hotel_rating: this.hotelRating,
      accommodation: this.accommodation,
      visa_required: this.visaRequired,
      notes: this.notes,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  get isSoldOut() {
    return (this.availableSeats ?? 0) <= 0;
  }
}

export default TripInfo;

