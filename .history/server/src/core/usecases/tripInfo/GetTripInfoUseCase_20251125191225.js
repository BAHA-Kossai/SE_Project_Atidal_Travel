export class GetTripInfoUseCase {
  constructor({ tripInfoRepository }) {
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute({ tripInfoId }) {
    try {
      const tripInfo = await this.tripInfoRepository.getTripInfoById(tripInfoId);
      if (!tripInfo) {
        return { success: false, error: 'Trip info not found', status: 404 };
      }

      return {
        success: true,
        data: tripInfo
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetTripInfoUseCase;

