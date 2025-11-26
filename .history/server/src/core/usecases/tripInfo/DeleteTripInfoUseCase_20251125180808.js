export class DeleteTripInfoUseCase {
  constructor({ tripInfoRepository, bookingRepository }) {
    this.tripInfoRepository = tripInfoRepository;
    this.bookingRepository = bookingRepository;
  }

  async execute({ tripInfoId }) {
    try {
      const tripInfo = await this.tripInfoRepository.getTripInfoById(tripInfoId);
      if (!tripInfo) {
        return { success: false, error: 'Trip info not found', status: 404 };
      }

      const bookings =
        await this.bookingRepository.findBookingsByTripInfo(tripInfoId);
      if (bookings.length > 0) {
        return {
          success: false,
          error: 'Cannot delete trip info that is linked to existing bookings',
          status: 409
        };
      }

      await this.tripInfoRepository.deleteTripInfo(tripInfoId);
      return {
        success: true,
        data: { message: 'Trip info deleted successfully' }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default DeleteTripInfoUseCase;

