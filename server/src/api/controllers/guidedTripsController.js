/**
 * @file        guidedTripsController.js
 * @description Defines controller functions for handling guided trips-related requests.
 *              Controllers receive HTTP request data, invoke UseCases, and return JSON results.
 *              No business logic is implemented here.
 *
 * @requires    GetGuidedTripsByTypeUseCase - Handles guided trips retrieval by type logic
 * @requires    GuidedTripsRepository       - Access to guided trips database operations
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */
import GetGuidedTripsByTypeUseCase from '../../core/usecases/GuidedTrips/GetGuidedTripsByTypeUseCase.js';
import GuidedTripsRepository from '../../repositories/GuidedTripsRepository.js';
import supabase from '../../config/supabase.js';

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