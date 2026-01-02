export class GetApprovedRatingsUseCase {
  constructor({ ratingRepository }) {
    this.ratingRepository = ratingRepository;
  }

  async execute(limit = null, withUserDetails = false) {
    try {
      let ratings;
      
      if (withUserDetails) {
        ratings = await this.ratingRepository.getRatingsWithUserDetails(limit);
      } else if (limit) {
        ratings = await this.ratingRepository.getApprovedRatingsWithLimit(limit);
      } else {
        ratings = await this.ratingRepository.getAllApprovedRatings();
      }

      return {
        success: true,
        data: ratings,
        status: 200
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: 500
      };
    }
  }
}

export default GetApprovedRatingsUseCase;