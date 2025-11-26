/**
 * @file Booking.js
 * @description Booking aggregate referencing Tripinfo.
 */

class Booking {
  constructor({
    bookingId = null,
    infoId,
    userId = null,
    branchId = null,
    guideId = null,
    bookingStatus = 'pending',
    needsVisaAssistance = false,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.bookingId = bookingId;
    this.infoId = infoId;
    this.userId = userId;
    this.branchId = branchId;
    this.guideId = guideId;
    this.bookingStatus = bookingStatus;
    this.needsVisaAssistance = Boolean(needsVisaAssistance);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(record = {}) {
    return new Booking({
      bookingId: record.booking_id,
      infoId: record.info_id,
      userId: record.user_id,
      branchId: record.branch_id,
      guideId: record.guide_id,
      bookingStatus: record.booking_status,
      needsVisaAssistance: record.needs_visa_assistance,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  toPersistence() {
    return {
      booking_id: this.bookingId,
      info_id: this.infoId,
      user_id: this.userId,
      branch_id: this.branchId,
      guide_id: this.guideId,
      booking_status: this.bookingStatus,
      needs_visa_assistance: this.needsVisaAssistance,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  get isPending() {
    return this.bookingStatus === 'pending';
  }
}

export default Booking;
/**
 * @file Booking.js
 * @description Booking aggregate referencing TripInfo.
 */

