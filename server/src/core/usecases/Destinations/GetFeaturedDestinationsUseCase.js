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