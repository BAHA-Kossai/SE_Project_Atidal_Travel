class GetUserBookingsUseCase {
  constructor(bookingsRepository) {
    this.bookingsRepository = bookingsRepository;
  }

  async execute(userId = null, bookingType = null) {
    // Business logic: Handle both logged-in users and guests
    
    // Validate bookingType if provided
    if (bookingType) {
      const validTypes = ['normal', 'guided_trip', 'umrah_trip'];
      if (!validTypes.includes(bookingType)) {
        throw new Error('Invalid booking type. Must be: normal, guided_trip, or umrah_trip');
      }
    }

    if (userId) {
      // User is logged in - get their bookings
      let bookings;
      if (bookingType) {
        // Get specific type of bookings for logged-in user
        bookings = await this.bookingsRepository.findUserBookingsByType(userId, bookingType);
      } else {
        // Get all bookings for logged-in user
        bookings = await this.bookingsRepository.findBookingsByUserId(userId);
      }
      return bookings;
    } else {   
      return [];
    }
  }
}

export default GetUserBookingsUseCase;