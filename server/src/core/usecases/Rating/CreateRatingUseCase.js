const REQUIRED_FIELDS = ['user_id', 'rating'];

export class CreateRatingUseCase {
  constructor({ ratingRepository }) {
    this.ratingRepository = ratingRepository;
  }

  async execute(input) {
    try {
      // Validate required fields
      const missing = REQUIRED_FIELDS.filter(
        (field) => !input[field] && input[field] !== 0
      );
      if (missing.length > 0) {
        return {
          success: false,
          error: `Missing required fields: ${missing.join(', ')}`,
          status: 400
        };
      }

      // Validate rating range (assuming 1-5 scale)
      if (input.rating < 1 || input.rating > 5) {
        return {
          success: false,
          error: 'Rating must be between 1 and 5',
          status: 400
        };
      }

      const now = new Date().toISOString();
      const rating = await this.ratingRepository.createRating({
        ...input,
        approved: false, 
        created_at: now
      });

      return { 
        success: true, 
        data: rating, 
        status: 201 
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

export default CreateRatingUseCase;