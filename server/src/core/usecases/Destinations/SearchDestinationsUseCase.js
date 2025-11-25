class SearchDestinationsUseCase {
  constructor(destinationsRepository) {
    this.destinationsRepository = destinationsRepository;
  }

  async execute(searchTerm) {
    // Business logic: Validate search term
    if (!searchTerm || searchTerm.trim() === '') {
      throw new Error('Search term is required');
    }

    // Search in both city and country
    const [byCity, byCountry] = await Promise.all([
      this.destinationsRepository.searchDestinationsByCity(searchTerm),
      this.destinationsRepository.searchDestinationsByCountry(searchTerm)
    ]);

    // Combine and remove duplicates
    const allResults = [...byCity, ...byCountry];
    const uniqueResults = allResults.filter((destination, index, self) =>
      index === self.findIndex(d => d.id === destination.id)
    );

    return uniqueResults;
  }
}

export default SearchDestinationsUseCase;