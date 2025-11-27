/**
 * @file        GetUserBookingsUseCase.js
 * @description Use case for retrieving all bookings for a specific user.
 *              Handles business logic for fetching user bookings with user validation.
 *              Coordinates data retrieval from repository for user-specific bookings.
 *
 * @requires    BookingsRepository - Access to bookings database operations
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

class GetUserBookingsUseCase {
  constructor(bookingsRepository) {
    this.bookingsRepository = bookingsRepository;
  }

  async execute(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const bookings = await this.bookingsRepository.findBookingsByUserId(userId);
    return bookings;
  }
}

export default GetUserBookingsUseCase;