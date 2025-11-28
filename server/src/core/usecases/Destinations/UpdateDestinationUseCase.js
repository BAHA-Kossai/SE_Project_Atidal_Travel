export class UpdateDestinationUseCase {
  constructor({ destinationsRepository }) {
    this.destinationsRepository = destinationsRepository;
  }

  async execute({ destinationId, updates }) {
    try {
      const destination =
        await this.destinationsRepository.getDestinationById(destinationId);
      if (!destination) {
        return { success: false, error: 'Destination not found', status: 404 };
      }

      const nextCountry = updates.country || destination.country;
      const nextCity = updates.city || destination.city;

      if (
        (updates.country &&
          updates.country.toLowerCase() !== destination.country?.toLowerCase()) ||
        (updates.city &&
          updates.city.toLowerCase() !== destination.city?.toLowerCase())
      ) {
        const candidates =
          await this.destinationsRepository.searchDestinationsByCountry(
            nextCountry
          );
        const duplicate = candidates.find(
          (item) =>
            item.destination_id !== Number(destinationId) &&
            item.city?.toLowerCase() === nextCity.toLowerCase()
        );
        if (duplicate) {
          return {
            success: false,
            error:
              'Destination with this country and city combination already exists',
            status: 409
          };
        }
      }

      const updated = await this.destinationsRepository.updateDestination(
        destinationId,
        {
          ...updates,
          country: nextCountry,
          city: nextCity
        }
      );

      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default UpdateDestinationUseCase;

