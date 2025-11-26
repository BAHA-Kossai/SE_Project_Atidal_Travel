/**
 * @file BookingStatusHistory.js
 * @description Records state changes for a booking.
 */
class BookingStatusHistory {
  constructor({
    historyId = null,
    bookingId,
    status,
    changedAt = new Date().toISOString(),
    changedBy = null
  }) {
    this.historyId = historyId;
    this.bookingId = bookingId;
    this.status = status;
    this.changedAt = changedAt;
    this.changedBy = changedBy;
  }

  static fromPersistence(record = {}) {
    return new BookingStatusHistory({
      historyId: record.history_id ?? record.id,
      bookingId: record.booking_id,
      status: record.status,
      changedAt: record.changed_at,
      changedBy: record.changed_by
    });
  }

  toPersistence() {
    return {
      history_id: this.historyId,
      booking_id: this.bookingId,
      status: this.status,
      changed_at: this.changedAt,
      changed_by: this.changedBy
    };
  }
}

export default BookingStatusHistory;

