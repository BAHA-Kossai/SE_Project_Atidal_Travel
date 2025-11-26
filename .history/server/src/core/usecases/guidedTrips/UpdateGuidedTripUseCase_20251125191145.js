import { validateGuidedTripInput } from '../../../api/validators/guidedTripValidator.js';
import { validateTripInfoPayload } from '../../../api/validators/tripInfoValidator.js';

export class UpdateGuidedTripUseCase {
  constructor({ guidedTripsRepository, tripInfoRepository }) {
    this.guidedTripsRepository = guidedTripsRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute({ tripId, updates }) {
    try {
      const trip = await this.guidedTripsRepository.getTripById(tripId);
      if (!trip) {
        return { success: false, error: 'Guided trip not found', status: 404 };
      }

      const { valid, errors } = validateGuidedTripInput(updates, {
        isUpdate: true
      });
      if (!valid) {
        return { success: false, error: errors.join(', '), status: 400 };
      }

      if (updates.info_id && updates.info_id !== trip.info_id) {
        return {
          success: false,
          error: 'info_id cannot be reassigned after creation',
          status: 400
        };
      }

      const tripPatch = {};
      if (updates.available_seats !== undefined) {
        tripPatch.available_seats = updates.available_seats;
      }
      if (updates.trip_agenda !== undefined) {
        tripPatch.trip_agenda = updates.trip_agenda;
      }
      if (updates.description !== undefined) {
        tripPatch.description = updates.description;
      }
      if (updates.type !== undefined) {
        tripPatch.type = updates.type;
      }
      if (updates.image_path !== undefined) {
        tripPatch.image_path = updates.image_path;
      }

      let updatedTrip = trip;
      if (Object.keys(tripPatch).length > 0) {
        updatedTrip = await this.guidedTripsRepository.updateTrip(
          tripId,
          tripPatch
        );
      }

      let updatedTripInfo = null;
      if (updates.trip_info) {
        const targetInfoId = updates.trip_info.info_id || trip.info_id;
        if (!targetInfoId) {
          return {
            success: false,
            error: 'trip_info.info_id is required when updating departure data',
            status: 400
          };
        }

        const {
          valid: tripValid,
          errors: tripErrors,
          payload
        } = validateTripInfoPayload(updates.trip_info, { isUpdate: true });
        if (!tripValid) {
          return {
            success: false,
            error: tripErrors.join(', '),
            status: 400
          };
        }

        updatedTripInfo = await this.tripInfoRepository.updateTripInfo(
          targetInfoId,
          payload
        );
      }

      const tripInfo =
        updatedTripInfo ||
        (updatedTrip.info_id
          ? await this.tripInfoRepository.getTripInfoById(updatedTrip.info_id)
          : null);

      return {
        success: true,
        data: {
          ...updatedTrip,
          trip_info: tripInfo
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default UpdateGuidedTripUseCase;

