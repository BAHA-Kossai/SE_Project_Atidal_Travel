/**
 * @file        destinationsController.js
 * @description Defines controller functions for handling destinations-related requests.
 *              Controllers receive HTTP request data, invoke UseCases, and return JSON results.
 *              No business logic is implemented here.
 *
 * @requires    GetAllDestinationsUseCase       - Handles retrieval of all destinations
 * @requires    SearchDestinationsUseCase       - Handles destination search logic  
 * @requires    GetFeaturedDestinationsUseCase  - Handles featured destinations retrieval
 * @requires    DestinationsRepository          - Access to destinations database operations
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

import GetAllDestinationsUseCase from '../../core/usecases/Destinations/GetAllDestinationsUseCase.js';
import SearchDestinationsUseCase from '../../core/usecases/Destinations/SearchDestinationsUseCase.js';
import GetFeaturedDestinationsUseCase from '../../core/usecases/Destinations/GetFeaturedDestinationsUseCase.js'; 
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
      const { q } = req.query; 
      
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

  async getFeaturedDestinations(req, res) {
    try {
      const { limit } = req.query;
      const useCase = new GetFeaturedDestinationsUseCase(destinationsRepository);
      const featuredDestinations = await useCase.execute(parseInt(limit) || 3);
      
      res.json({
        status: "success",
        data: featuredDestinations,
        message: "Featured destinations retrieved successfully"
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