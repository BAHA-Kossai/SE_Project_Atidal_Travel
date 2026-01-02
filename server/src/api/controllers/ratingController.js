import GetApprovedRatingsUseCase from '../../core/usecases/Rating/GetApprovedRatingsUseCase.js';
import RatingRepository from '../../repositories/RatingRepository.js';
import supabase from '../../config/supabase.js';

const ratingRepository = new RatingRepository(supabase);

class RatingController {
  
  async createRating(req, res) {
    try {
      const { user_id, comment, rating } = req.body;

      if (!user_id || !rating) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Missing required fields: user_id, rating"
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Rating must be between 1 and 5"
        });
      }

      const ratingData = {
        user_id: user_id,
        comment: comment || null,
        rating: rating,
        approved: false,
        created_at: req.body.created_at || new Date().toISOString()
      };

      const createdRating = await ratingRepository.createRating(ratingData);

      return res.status(201).json({
        status: "success",
        data: createdRating,
        message: "Rating submitted successfully and is pending approval"
      });

    } catch (error) {
      return res.status(500).json({
        status: "error",
        data: null,
        message: error.message || "Failed to submit rating"
      });
    }
  }

  async getAllApprovedRatings(req, res) {
    try {
      const { limit, withUserDetails = 'false' } = req.query;
      
      const useCase = new GetApprovedRatingsUseCase({ ratingRepository });
      const result = await useCase.execute(
        limit ? parseInt(limit) : null,
        withUserDetails === 'true'
      );
      
      if (!result.success) {
        return res.status(result.status).json({
          status: "error",
          data: null,
          message: result.error
        });
      }

      res.json({
        status: "success",
        data: result.data,
        message: "Approved ratings retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message
      });
    }
  }

}

export default new RatingController();