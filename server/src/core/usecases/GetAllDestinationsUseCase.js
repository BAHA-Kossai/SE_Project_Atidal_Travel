class GetAllDestinationsUseCase {
  constructor(destinationsRepository) {
    this.destinationsRepository = destinationsRepository;
  }

  async execute() {
    // Business logic: Get all destinations (no filtering needed since all are active)
    const destinations = await this.destinationsRepository.getAllDestinations();
    return destinations;
  }
}

export default GetAllDestinationsUseCase;