/**
 * @file        DestinationsController.js
 * @description Defines controller functions for handling destinations-related requests.
 *              Controllers receive HTTP request data, invoke UseCases, and return JSON results.
 *              No business logic is implemented here.
 *
 * @requires    GetAllDestinationsUseCase       - Handles retrieval of all destinations
 * @requires    SearchDestinationsUseCase       - Handles destination search logic  
 * @requires    GetFeaturedDestinationsUseCase  - Handles featured destinations retrieval
 * @requires    DestinationsRepository          - Access to destinations database operations
 *
 * @author      Ahlem Toubrinet, Abderahim
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-12-26
 */

import GetAllDestinationsUseCase from '../../core/usecases/Destinations/GetAllDestinationsUseCase.js';
import SearchDestinationsUseCase from '../../core/usecases/Destinations/SearchDestinationsUseCase.js';
import GetFeaturedDestinationsUseCase from '../../core/usecases/Destinations/GetFeaturedDestinationsUseCase.js'; 
import DestinationsRepository from '../../repositories/DestinationsRepository.js';
import supabase from '../../config/supabase.js';
import { uploadImageToSupabase, deleteImageFromSupabase } from '../../utils/supabaseUpload.js';

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

  async createDestination(req, res) {
    try {
      console.log('[Create] Incoming req.body:', req.body);
      const { destination_country, description, destination_city } = req.body;
      let { created_by } = req.body;
      const pictureFile = req.file;

      if (!destination_country || !destination_city) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Missing required fields: destination_country, destination_city"
        });
      }

      // Ensure created_by is always a non-empty string
      if (!created_by || !created_by.trim()) {
        created_by = "admin";
      }

      console.log(`[Create] Creating destination: ${destination_city}, ${destination_country}, created_by: ${created_by}`);

      const existingDestination = await destinationsRepository.searchDestinationsByCountry(destination_country);
      const duplicate = existingDestination.find(
        d => d.destination_city.toLowerCase() === destination_city.toLowerCase()
      );

      if (duplicate) {
        return res.status(409).json({
          status: "error",
          data: null,
          message: "Destination with this country and city combination already exists"
        });
      }

      let imageUrl = null;

      // Upload image if provided
      if (pictureFile) {
        try {
          console.log(`[Create] Uploading image: ${pictureFile.originalname}`);
          imageUrl = await uploadImageToSupabase(pictureFile, 'destinations');
          console.log(`[Create] Image uploaded: ${imageUrl}`);
        } catch (uploadError) {
          console.error('[Create] Image upload failed:', uploadError.message);
          return res.status(400).json({
            status: "error",
            data: null,
            message: `Image upload failed: ${uploadError.message}`
          });
        }
      }

      const destination = await destinationsRepository.createDestination({
        destination_pic: imageUrl,
        destination_country,
        description,
        destination_city,
        created_by
      });

      console.log(`[Create] Destination created successfully`);

      res.status(201).json({
        status: "success",
        data: destination,
        message: "Destination created successfully"
      });
    } catch (error) {
      console.error('[Create] Error:', error.message);
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message
      });
    }
  }

  async getDestinationById(req, res) {
    try {
      const { id } = req.params;

      const destination = await destinationsRepository.getDestinationById(id);

      if (!destination) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "Destination not found"
        });
      }

      res.json({
        status: "success",
        data: destination,
        message: "Destination retrieved successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message
      });
    }
  }

  async updateDestination(req, res) {
    try {
      const { id } = req.params;
      const { destination_country, description, destination_city } = req.body;
      const pictureFile = req.file;

      console.log(`[Update] Updating destination: ${id}`);

      const existingDestination = await destinationsRepository.getDestinationById(id);
      if (!existingDestination) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "Destination not found"
        });
      }

      let imageUrl = existingDestination.destination_pic;

      // Handle image replacement
      if (pictureFile) {
        try {
          console.log(`[Update] Uploading new image: ${pictureFile.originalname}`);
          
          // Delete old image if exists
          if (existingDestination.destination_pic) {
            console.log(`[Update] Deleting old image`);
            await deleteImageFromSupabase(existingDestination.destination_pic);
          }

          // Upload new image
          imageUrl = await uploadImageToSupabase(pictureFile, 'destinations');
          console.log(`[Update] Image updated: ${imageUrl}`);
        } catch (uploadError) {
          console.error('[Update] Image upload failed:', uploadError.message);
          return res.status(400).json({
            status: "error",
            data: null,
            message: `Image upload failed: ${uploadError.message}`
          });
        }
      }

      const destination = await destinationsRepository.updateDestination(id, {
        destination_pic: imageUrl,
        destination_country: destination_country || existingDestination.destination_country,
        description: description || existingDestination.description,
        destination_city: destination_city || existingDestination.destination_city
      });

      console.log(`[Update] Destination updated successfully`);

      res.json({
        status: "success",
        data: destination,
        message: "Destination updated successfully"
      });
    } catch (error) {
      console.error('[Update] Error:', error.message);
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message
      });
    }
  }

  async deleteDestination(req, res) {
    try {
      const { id } = req.params;

      const existingDestination = await destinationsRepository.getDestinationById(id);
      if (!existingDestination) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "Destination not found"
        });
      }

      await destinationsRepository.deleteDestination(id);

      res.json({
        status: "success",
        data: null,
        message: "Destination deleted successfully"
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