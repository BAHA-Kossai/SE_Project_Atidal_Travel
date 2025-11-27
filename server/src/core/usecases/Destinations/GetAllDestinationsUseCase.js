/**
 * @file        GetAllDestinationsUseCase.js
 * @description Use case for retrieving all destinations.
 *              Handles business logic for fetching all available destinations.
 *              Coordinates data retrieval from repository without additional processing.
 *
 * @requires    DestinationsRepository - Access to destinations database operations
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

class GetAllDestinationsUseCase {
  constructor(destinationsRepository) {
    this.destinationsRepository = destinationsRepository;
  }

  async execute() {
    const destinations = await this.destinationsRepository.getAllDestinations();
    return destinations;
  }
}

export default GetAllDestinationsUseCase;