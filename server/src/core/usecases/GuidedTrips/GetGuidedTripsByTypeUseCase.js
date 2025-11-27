/**
 * @file        GetGuidedTripsByTypeUseCase.js
 * @description Use case for retrieving guided trips by type with complete trip information.
 *              Handles business logic for fetching guided trips filtered by type with pagination.
 *              Validates trip type and limit parameters before data retrieval.
 *
 * @requires    GuidedTripsRepository - Access to guided trips database operations
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

class GetGuidedTripsByTypeUseCase {
  constructor(guidedTripsRepository) {
    this.guidedTripsRepository = guidedTripsRepository;
  }

  async execute(tripType, limit = null) {
    const validTypes = ['guided_trip', 'umrah'];
    if (!validTypes.includes(tripType)) {
      throw new Error('Invalid trip type. Must be: NORMAL or UMRAH');
    }

    if (limit && (isNaN(limit) || limit <= 0)) {
      throw new Error('Limit must be a positive number');
    }

    const trips = await this.guidedTripsRepository.findTripsByTypeWithInfo(tripType, limit);

    return trips;
  }
}

export default GetGuidedTripsByTypeUseCase;