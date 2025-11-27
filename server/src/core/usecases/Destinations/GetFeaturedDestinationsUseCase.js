/**
 * @file        GetFeaturedDestinationsUseCase.js
 * @description Use case for retrieving featured destinations with limit.
 *              Handles business logic for fetching featured destinations with pagination.
 *              Coordinates data retrieval from repository with default limit handling.
 *
 * @requires    DestinationsRepository - Access to destinations database operations
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

class GetFeaturedDestinationsUseCase {
  constructor(destinationsRepository) {
    this.destinationsRepository = destinationsRepository;
  }

  async execute(limit = 3) {
    const destinations = await this.destinationsRepository.getDestinationsWithLimit(limit);
    return destinations;
  }
}

export default GetFeaturedDestinationsUseCase;