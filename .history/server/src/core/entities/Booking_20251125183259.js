/**
 * @file Booking.js
 * @description Booking aggregate referencing TripInfo.
 */
class Booking {
  constructor({
    bookingId = null,
    tripInfoId,
    branchId = null,
    guideId = null,
    userId = null,
    bookingStatus = 'pending',
    visaAssistance = false,
    createdBy = null,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.bookingId = bookingId;
    this.tripInfoId = tripInfoId;
    this.branchId = branchId;
    this.guideId = guideId;
    this.userId = userId;
    this.bookingStatus = bookingStatus;
    this.visaAssistance = Boolean(visaAssistance);
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(record = {}) {
    return new Booking({
      bookingId: record.booking_id,
      tripInfoId: record.trip_info_id,
      branchId: record.branch_id,
      guideId: record.guide_id,
      userId: record.user_id,
      bookingStatus: record.booking_status,
      visaAssistance: record.visa_assistance,
      createdBy: record.created_by,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  toPersistence() {
    return {
      booking_id: this.bookingId,
      trip_info_id: this.tripInfoId,
      branch_id: this.branchId,
      guide_id: this.guideId,
      user_id: this.userId,
      booking_status: this.bookingStatus,
      visa_assistance: this.visaAssistance,
      created_by: this.createdBy,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  get isPending() {
    return this.bookingStatus === 'pending';
  }
}

export default Booking;

