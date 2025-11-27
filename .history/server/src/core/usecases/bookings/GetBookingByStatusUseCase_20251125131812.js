const ALLOWED_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export class GetBookingByStatusUseCase {
  constructor({ bookingRepository }) {
    this.bookingRepository = bookingRepository;
  }

  async execute({ status }) {
    try {
      if (!status || !ALLOWED_STATUSES.includes(status)) {
        return {
          success: false,
          error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
          status: 400
        };
      }

      const bookings = await this.bookingRepository.findBookingsByStatus(status);
      return { success: true, data: bookings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetBookingByStatusUseCase;

