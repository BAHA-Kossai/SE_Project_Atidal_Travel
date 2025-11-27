export class GetTripInfosUseCase {
  constructor({ tripInfoRepository }) {
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute(filters = {}) {
    try {
      const limit = Number(filters.limit) || 20;
      const offset = Number(filters.offset) || 0;

      const result = await this.tripInfoRepository.listTripInfos({
        destination_country: filters.destination_country,
        destination_city: filters.destination_city,
        limit,
        offset
      });

      return {
        success: true,
        data: {
          trip_info: result.data,
          total: result.total,
          limit,
          offset
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetTripInfosUseCase;

