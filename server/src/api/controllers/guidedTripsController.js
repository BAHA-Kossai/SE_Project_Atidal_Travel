/**
 * @file        guidedTripsController.js
 * @description Controller for handling guided trips API requests (Read-only)
 *              Routes requests to GuidedTripsRepository and manages business logic
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-22
 */
import GetGuidedTripsByTypeUseCase from '../../core/usecases/GuidedTrips/GetGuidedTripsByTypeUseCase.js';
import GuidedTripsRepository from '../../repositories/GuidedTripsRepository.js';
import supabase from '../../config/supabase.js';



// READ - Get all guided trips
export const getAllGuidedTrips = async (req, res) => {
  try {
    const tripRepo = new GuidedTripsRepository(supabase);
    const { min_seats, limit = 10, offset = 0 } = req.query;
    
    let trips;
    
    if (min_seats) {
      trips = await tripRepo.findTripsByAvailableSeats(parseInt(min_seats));
    } else {
      trips = await tripRepo.getAllTrips();
    }

    // Apply pagination
    const paginatedTrips = trips.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    res.status(200).json({
      success: true,
      message: 'Guided trips retrieved successfully',
      data: paginatedTrips,
      total: trips.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving guided trips',
      error: error.message
    });
  }
};

// READ - Get guided trip by ID
export const getGuidedTripById = async (req, res) => {
  try {
    const tripRepo = new GuidedTripsRepository(supabase);
    const { id } = req.params;

    const trip = await tripRepo.getTripById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Guided trip not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Guided trip retrieved successfully',
      data: trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving guided trip',
      error: error.message
    });
  }
};




const guidedTripsRepository = new GuidedTripsRepository(supabase);

class GuidedTripsController {

    async getTripsByType(req, res) {
        try {
            const { type } = req.params;
            const { limit } = req.query;
            
            const useCase = new GetGuidedTripsByTypeUseCase(guidedTripsRepository);
            const trips = await useCase.execute(
                type, 
                limit ? parseInt(limit) : null
            );
            
            res.json({
                status: "success",
                data: trips,
                message: `Guided trips of type ${type} retrieved successfully`
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
                data: null,
                message: error.message
            });
        }
    }
}

export default new GuidedTripsController();

