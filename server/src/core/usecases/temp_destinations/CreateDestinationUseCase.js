export class CreateDestinationUseCase {
  constructor({ destinationsRepository }) {
    this.destinationsRepository = destinationsRepository;
  }

  async execute(input) {
    try {
      if (!input.country || !input.city) {
        return {
          success: false,
          error: 'country and city are required',
          status: 400
        };
      }

      const matchingCountry =
        await this.destinationsRepository.searchDestinationsByCountry(
          input.country
        );
      const duplicate = matchingCountry.find(
        (destination) =>
          destination.city?.toLowerCase() === input.city.toLowerCase()
      );
      if (duplicate) {
        return {
          success: false,
          error:
            'Destination with this country and city combination already exists',
          status: 409
        };
      }

      const now = new Date().toISOString();
      const destination = await this.destinationsRepository.createDestination({
        country: input.country.trim(),
        city: input.city.trim(),
        description: input.description || null,
        picture_path: input.picture_path || null,
        created_at: now,
        updated_at: now
      });
      return { success: true, data: destination, status: 201 };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default CreateDestinationUseCase;

