export class GetAllDestinationsUseCase {
  constructor({ destinationsRepository }) {
    this.destinationsRepository = destinationsRepository;
  }

  async execute({ city, country, limit = 10, offset = 0 } = {}) {
    try {
      let destinations;
      if (country) {
        destinations =
          await this.destinationsRepository.searchDestinationsByCountry(
            country
          );
      } else if (city) {
        destinations = await this.destinationsRepository.searchDestinationsByCity(
          city
        );
      } else {
        destinations = await this.destinationsRepository.getAllDestinations();
      }

      const start = Number(offset);
      const end = start + Number(limit);
      const paginated = destinations.slice(start, end);

      return {
        success: true,
        data: {
          destinations: paginated,
          total: destinations.length,
          limit: Number(limit),
          offset: Number(offset)
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetAllDestinationsUseCase;

