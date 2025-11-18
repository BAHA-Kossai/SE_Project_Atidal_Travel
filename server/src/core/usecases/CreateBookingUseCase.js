class CreateBookingUseCase {
  constructor(bookingsRepository) {
    this.bookingsRepository = bookingsRepository;
  }

  async execute(bookingData) {
    // Business logic validations - booking_type is REQUIRED for everyone
    if (!bookingData.booking_type) {
      throw new Error('Booking type is required for all bookings');
    }
    if (!bookingData.destination_name) {
      throw new Error('Destination name is required');
    }

    // Validate booking types
    const validTypes = ['normal', 'guided_trip', 'umrah_trip'];
    if (!validTypes.includes(bookingData.booking_type)) {
      throw new Error('Invalid booking type. Must be: normal, guided_trip, or umrah_trip');
    }

    // user_id is optional (can be null for guests)
    const bookingToCreate = {
      ...bookingData,
      user_id: bookingData.user_id || null, // Allow null for guests
      booking_status: bookingData.booking_status || 'pending',
      created_at: new Date().toISOString()
    };

    // Call repository
    const newBooking = await this.bookingsRepository.createBooking(bookingToCreate);
    
    return newBooking;
  }
}

export default CreateBookingUseCase;