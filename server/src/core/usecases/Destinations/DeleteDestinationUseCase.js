export class DeleteDestinationUseCase {
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

      await this.destinationsRepository.deleteDestination(destinationId);
      return { success: true, data: { message: 'Destination deleted' } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default DeleteDestinationUseCase;

