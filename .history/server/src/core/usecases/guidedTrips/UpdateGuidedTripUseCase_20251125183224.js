import { validateGuidedTripInput } from '../../../api/validators/guidedTripValidator.js';
import { validateTripInfoPayload } from '../../../api/validators/tripInfoValidator.js';

export class UpdateGuidedTripUseCase {
  constructor({
    guidedTripsRepository,
    destinationsRepository,
    guideRepository,
    branchesRepository,
    tripInfoRepository
  }) {
    this.guidedTripsRepository = guidedTripsRepository;
    this.destinationsRepository = destinationsRepository;
    this.guideRepository = guideRepository;
    this.branchesRepository = branchesRepository;
    this.tripInfoRepository = tripInfoRepository;
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
        trip_name: updates.trip_name ?? trip.trip_name,
        destination_id: updates.destination_id ?? trip.destination_id
      };
      const { valid, errors } = validateGuidedTripInput(validationPayload, {
        isUpdate: true,
        existingTrips,
        currentTripId: trip.trip_id,
        currentDestinationId: trip.destination_id
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

      if (updates.branch_id) {
        const branch = await this.branchesRepository.getBranchById(
          updates.branch_id
        );
        if (!branch) {
          return { success: false, error: 'Branch not found', status: 404 };
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

      const tripUpdatePayload = { ...updates };
      delete tripUpdatePayload.trip_info;

      let updatedTrip = trip;
      if (Object.keys(tripUpdatePayload).length > 0) {
        updatedTrip = await this.guidedTripsRepository.updateTrip(
          tripId,
          tripUpdatePayload
        );
      }

      let updatedTripInfo = null;
      if (updates.trip_info) {
        if (!updates.trip_info.trip_info_id) {
          return {
            success: false,
            error: 'trip_info.trip_info_id is required when updating departures',
            status: 400
          };
        }
        const { valid: tripInfoValid, errors: tripInfoErrors, payload } =
          validateTripInfoPayload(updates.trip_info, { isUpdate: true });
        if (!tripInfoValid) {
          return {
            success: false,
            error: tripInfoErrors.join(', '),
            status: 400
          };
        }

        updatedTripInfo = await this.tripInfoRepository.updateTripInfo(
          updates.trip_info.trip_info_id,
          payload
        );
      }

      return {
        success: true,
        data: {
          ...updatedTrip,
          updated_departure: updatedTripInfo
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default UpdateGuidedTripUseCase;

