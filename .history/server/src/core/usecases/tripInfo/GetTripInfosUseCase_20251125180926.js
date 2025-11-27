export class GetTripInfosUseCase {
  constructor({ tripInfoRepository }) {
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute(filters = {}) {
    try {
      const limit = Number(filters.limit) || 20;
      const offset = Number(filters.offset) || 0;
      const result = await this.tripInfoRepository.listTripInfos({
        guided_trip_id: filters.guided_trip_id,
        destination_id: filters.destination_id,
        branch_id: filters.branch_id,
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

