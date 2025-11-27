import { validateGuidedTripInput } from '../../../api/validators/guidedTripValidator.js';
import { validateTripInfoPayload } from '../../../api/validators/tripInfoValidator.js';

export class CreateGuidedTripUseCase {
  constructor({ guidedTripsRepository, tripInfoRepository }) {
    this.guidedTripsRepository = guidedTripsRepository;
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute(input) {
    try {
      const { valid, errors } = validateGuidedTripInput(input);
      if (!valid) {
        return { success: false, error: errors.join(', '), status: 400 };
      }

      const now = new Date().toISOString();
      const { tripInfo, infoId } = await this.resolveTripInfo(input, now);

      const tripRecord = await this.guidedTripsRepository.createTrip({
        available_seats: input.available_seats,
        trip_agenda: input.trip_agenda || null,
        created_by: input.created_by || null,
        description: input.description,
        type: input.type,
        info_id: infoId,
        image_path: input.image_path || null,
        created_at: now,
        updated_at: now
      });

      return {
        success: true,
        data: {
          ...tripRecord,
          trip_info: tripInfo
        },
        status: 201
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async resolveTripInfo(input, timestamp) {
    if (input.info_id) {
      const existing = await this.tripInfoRepository.getTripInfoById(
        input.info_id
      );
      if (!existing) {
        throw new Error('Referenced trip info not found');
      }
      return { tripInfo: existing, infoId: existing.info_id ?? existing.infoId };
    }

    const { payload, errors, valid } = validateTripInfoPayload(
      input.trip_info || {},
      { isUpdate: false }
    );
    if (!valid) {
      throw new Error(errors.join(', '));
    }

    const created = await this.tripInfoRepository.createTripInfo({
      ...payload,
      created_at: timestamp,
      updated_at: timestamp
    });
    return { tripInfo: created, infoId: created.info_id ?? created.infoId };
  }
}

export default CreateGuidedTripUseCase;
