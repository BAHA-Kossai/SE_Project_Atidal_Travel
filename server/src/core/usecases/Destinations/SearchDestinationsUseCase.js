/**
 * @file        SearchDestinationsUseCase.js
 * @description Use case for searching destinations by city and country.
 *              Handles business logic for destination search with duplicate removal.
 *              Coordinates parallel searches and merges results from multiple criteria.
 *
 * @requires    DestinationsRepository - Access to destinations database operations
 *
 * @author      Ahlem Toubrinet
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

class SearchDestinationsUseCase {
  constructor(destinationsRepository) {
    this.destinationsRepository = destinationsRepository;
  }

  async execute(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      throw new Error('Search term is required');
    }

    const [byCity, byCountry] = await Promise.all([
      this.destinationsRepository.searchDestinationsByCity(searchTerm),
      this.destinationsRepository.searchDestinationsByCountry(searchTerm)
    ]);

    const allResults = [...byCity, ...byCountry];
    const uniqueResults = allResults.filter((destination, index, self) =>
      index === self.findIndex(d => d.id === destination.id)
    );

    return uniqueResults;
  }
}

export default SearchDestinationsUseCase;