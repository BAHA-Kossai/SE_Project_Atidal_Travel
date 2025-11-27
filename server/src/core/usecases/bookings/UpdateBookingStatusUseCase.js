/**
 * @file UpdateBookingStatusUseCase.js
 * @description Use case to update booking status.
 *              Only ADMIN or SUPER_ADMIN can perform this action.
 */

export default class UpdateBookingStatusUseCase {
  constructor(bookingsRepository) {
    this.bookingsRepository = bookingsRepository;
  }

  async execute(authUser, booking_id, booking_status) {
    //Check permissions
    if (!authUser || !["ADMIN", "SUPER_ADMIN"].includes(authUser.type)) {
      return {
        status: 403,
        message:
          "Forbidden: Only admins or super admins can update booking status",
        data: {},
      };
    }

    // Validate required inputs
    if (!booking_id || !booking_status) {
      return {
        status: 400,
        message: "booking_id and booking_status are required",
        data: {},
      };
    }

    // Allowed status values
    const allowedStatuses = [
      "pending",
      "confirmed",
      "cancelled",
      "completed",
      "rejected",
    ];

    if (!allowedStatuses.includes(booking_status)) {
      return {
        status: 400,
        message: `Invalid status. Valid values: ${allowedStatuses.join(", ")}`,
        data: {},
      };
    }

    // Check if booking exists
    const booking = await this.bookingsRepository.getBookingById(booking_id);

    if (!booking) {
      return {
        status: 404,
        message: "Booking not found",
        data: {},
      };
    }

    // Update booking
    const updatedBooking = await this.bookingsRepository.updateBookingStatus(
      booking_id,
      booking_status
    );

    return {
      status: 200,
      message: "Booking status updated successfully",
      data: updatedBooking,
    };
  }
}
