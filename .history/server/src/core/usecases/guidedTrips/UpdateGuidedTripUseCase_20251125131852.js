import { validateGuidedTripInput } from '../../../api/validators/guidedTripValidator.js';

export class UpdateGuidedTripUseCase {
  constructor({
    guidedTripsRepository,
    destinationsRepository,
    guideRepository
  }) {
    this.guidedTripsRepository = guidedTripsRepository;
    this.destinationsRepository = destinationsRepository;
    this.guideRepository = guideRepository;
  }

  async execute({ tripId, updates }) {
    try {
      const trip = await this.guidedTripsRepository.getTripById(tripId);
      if (!trip) {
        return { success: false, error: 'Guided trip not found', status: 404 };
      }

      const existingTrips = await this.guidedTripsRepository.getAllTrips();
      const validationPayload = {
        ...updates,
        trip_name: updates.trip_name ?? trip.trip_name
      };
      const { valid, errors } = validateGuidedTripInput(validationPayload, {
        isUpdate: true,
        existingTrips,
        currentTripId: trip.trip_id,
        currentDestinationId: updates.destination_id ?? trip.destination_id
      });
      if (!valid) {
        return { success: false, error: errors.join(', '), status: 400 };
      }

      if (updates.destination_id) {
        const destination = await this.destinationsRepository.getDestinationById(
          updates.destination_id
        );
        if (!destination) {
          return { success: false, error: 'Destination not found', status: 404 };
        }
      }

      if (updates.guide_id) {
        const guide = await this.guideRepository.getGuideById(
          updates.guide_id
        );
        if (!guide) {
          return { success: false, error: 'Guide not found', status: 404 };
        }
      }

      if (updates.max_seats && trip.max_seats) {
        const usedSeats = (trip.max_seats || 0) - (trip.available_seats || 0);
        if (updates.max_seats < usedSeats) {
          return {
            success: false,
            error: 'max_seats cannot be lower than seats already booked',
            status: 400
          };
        }
      }

      const updatedTrip = await this.guidedTripsRepository.updateTrip(
        tripId,
        updates
      );
      return { success: true, data: updatedTrip };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default UpdateGuidedTripUseCase;

