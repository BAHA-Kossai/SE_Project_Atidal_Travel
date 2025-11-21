class GetAllDestinationsUseCase {
  constructor(destinationsRepository) {
    this.destinationsRepository = destinationsRepository;
  }

  async execute() {
    // Business logic: Get all destinations
    const destinations = await this.destinationsRepository.getAllDestinations();
    return destinations;
  }
}

export default GetAllDestinationsUseCase;