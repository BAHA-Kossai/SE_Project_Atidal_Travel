/**
 * @file        AssignBranchUseCase.js
 * @description Use case class for assigning a branch to a booking.
 *              Only SUPER_ADMIN users can perform this action.
 *
 * @requires    BookingsRepository
 * @requires    BranchRepository
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-24
 */

class AssignBranchUseCase {
  constructor(bookingsRepository, branchRepository) {
    this.bookingsRepository = bookingsRepository;
    this.branchRepository = branchRepository;
  }

  /**
   * Assign a branch to a booking
   * @param {Object} authUser - Logged-in user (from middleware)
   * @param {number} booking_id - ID of the booking
   * @param {number} branch_id - ID of the branch to assign
   */
  async execute(authUser, booking_id, branch_id) {
    // Only SUPER_ADMIN allowed
    if (!authUser || authUser.type !== 'SUPER_ADMIN') {
      throw { status: 403, message: "Forbidden: Only super admins can assign branches" };
    }

    // Validate booking exists
    const booking = await this.bookingsRepository.getBookingById(booking_id);
    if (!booking) throw { status: 404, message: "Booking not found" };

    // Validate branch exists
    const branchExists = await this.branchRepository.exists(branch_id);
    if (!branchExists) throw { status: 400, message: "Invalid branch_id" };

    // Update the booking
    const updatedBooking = await this.bookingsRepository.updateBooking(booking_id, {
      branch_id: branch_id
    });

    return {
      status: 200,
      message: "Branch assigned successfully",
      data: updatedBooking
    };
  }
}

export default AssignBranchUseCase;
