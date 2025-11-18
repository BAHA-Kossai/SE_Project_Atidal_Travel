import GetAllDestinationsUseCase from '../../core/usecases/GetAllDestinationsUseCase.js';
import SearchDestinationsUseCase from '../../core/usecases/SearchDestinationsUseCase.js';
import DestinationsRepository from '../../repositories/DestinationsRepository.js';
import supabase from '../../config/supabase.js';

const destinationsRepository = new DestinationsRepository(supabase);

class DestinationsController {
  async getAllDestinations(req, res) {
    try {
      const useCase = new GetAllDestinationsUseCase(destinationsRepository);
      const destinations = await useCase.execute();
      
      res.json({
        status: "success",
        data: destinations,
        message: "Destinations retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: "error", 
        data: null,
        message: error.message
      });
    }
  }

  async searchDestinations(req, res) {
    try {
      const { q } = req.query; // Search term from query params
      
      if (!q) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Search query parameter 'q' is required"
        });
      }

      const useCase = new SearchDestinationsUseCase(destinationsRepository);
      const results = await useCase.execute(q);
      
      res.json({
        status: "success",
        data: results,
        message: "Search completed successfully"
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

export default new DestinationsController();