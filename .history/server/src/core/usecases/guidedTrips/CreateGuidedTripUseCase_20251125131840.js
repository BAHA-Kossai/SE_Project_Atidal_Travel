import { validateGuidedTripInput } from '../../../api/validators/guidedTripValidator.js';

export class CreateGuidedTripUseCase {
  constructor({
    guidedTripsRepository,
    destinationsRepository,
    guideRepository
  }) {
    this.guidedTripsRepository = guidedTripsRepository;
    this.destinationsRepository = destinationsRepository;
    this.guideRepository = guideRepository;
  }

  async execute(input) {
    try {
      const existingTrips = await this.guidedTripsRepository.getAllTrips();
      const { valid, errors } = validateGuidedTripInput(input, {
        existingTrips,
        currentDestinationId: input.destination_id
      });
      if (!valid) {
        return { success: false, error: errors.join(', '), status: 400 };
      }

      const destination = await this.destinationsRepository.getDestinationById(
        input.destination_id
      );
      if (!destination) {
        return { success: false, error: 'Destination not found', status: 404 };
      }

      const guide = await this.guideRepository.getGuideById(input.guide_id);
      if (!guide) {
        return { success: false, error: 'Guide not found', status: 404 };
      }

      const now = new Date().toISOString();
      const trip = await this.guidedTripsRepository.createTrip({
        ...input,
        available_seats: input.max_seats,
        created_at: now,
        updated_at: now
      });

      return { success: true, data: trip };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default CreateGuidedTripUseCase;

