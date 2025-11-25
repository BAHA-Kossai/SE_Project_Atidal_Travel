class GetBookingsByTypeUseCase {
  constructor(bookingsRepository) {
    this.bookingsRepository = bookingsRepository;
  }

  async execute(bookingType, status = 'draft', limit = null) {
    // Validate booking type
    const validTypes = ['normal', 'guided_trip', 'umrah'];
    if (!validTypes.includes(bookingType)) {
      throw new Error('Invalid booking type. Must be: normal, guided_trip, or umrah_trip');
    }

    // Validate status
    const validStatuses = ['draft', 'confirmed', 'cancelled', 'completed'];
    if (status && !validStatuses.includes(status)) {
      throw new Error('Invalid booking status');
    }

    // Get bookings with filters
    const bookings = await this.bookingsRepository.getBookingsByTypeAndStatus(
      bookingType, 
      status, 
      limit
    );

    return bookings;
  }
}

export default GetBookingsByTypeUseCase;