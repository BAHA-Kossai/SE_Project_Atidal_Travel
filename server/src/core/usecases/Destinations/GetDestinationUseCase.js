export class GetDestinationUseCase {
  constructor({ destinationsRepository }) {
    this.destinationsRepository = destinationsRepository;
  }

  async execute({ destinationId }) {
    try {
      const destination =
        await this.destinationsRepository.getDestinationById(destinationId);
      if (!destination) {
        return { success: false, error: 'Destination not found', status: 404 };
      }
      return { success: true, data: destination };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetDestinationUseCase;

