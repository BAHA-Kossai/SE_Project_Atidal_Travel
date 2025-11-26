export class GetGuidedTripUseCase {
  constructor({ guidedTripsRepository, tripInfoRepository }) {
    this.guidedTripsRepository = guidedTripsRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute({ tripId }) {
    try {
      const trip = await this.guidedTripsRepository.getTripById(tripId);
      if (!trip) {
        return { success: false, error: 'Guided trip not found', status: 404 };
      }

      const tripInfo = trip.info_id
        ? await this.tripInfoRepository.getTripInfoById(trip.info_id)
        : null;

      return {
        success: true,
        data: {
          ...trip,
          trip_info: tripInfo
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetGuidedTripUseCase;

