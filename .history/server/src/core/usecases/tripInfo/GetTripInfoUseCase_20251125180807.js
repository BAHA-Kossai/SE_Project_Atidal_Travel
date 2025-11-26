export class GetTripInfoUseCase {
  constructor({
    tripInfoRepository,
    guidedTripsRepository,
    destinationsRepository,
    branchesRepository
  }) {
    this.tripInfoRepository = tripInfoRepository;
    this.guidedTripsRepository = guidedTripsRepository;
    this.destinationsRepository = destinationsRepository;
    this.branchesRepository = branchesRepository;
  }

  async execute({ tripInfoId }) {
    try {
      const tripInfo = await this.tripInfoRepository.getTripInfoById(tripInfoId);
      if (!tripInfo) {
        return { success: false, error: 'Trip info not found', status: 404 };
      }

      const [guidedTrip, destination, branch] = await Promise.all([
        tripInfo.guided_trip_id
          ? this.guidedTripsRepository.getTripById(tripInfo.guided_trip_id)
          : null,
        tripInfo.destination_id
          ? this.destinationsRepository.getDestinationById(
              tripInfo.destination_id
            )
          : null,
        tripInfo.branch_id
          ? this.branchesRepository.getBranchById(tripInfo.branch_id)
          : null
      ]);

      return {
        success: true,
        data: {
          ...tripInfo,
          guided_trip: guidedTrip || null,
          destination: destination || null,
          branch: branch || null
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetTripInfoUseCase;

