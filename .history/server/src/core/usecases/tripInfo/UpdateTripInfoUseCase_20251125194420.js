import { validateTripInfoPayload } from '../../../api/validators/tripInfoValidator.js';

export class UpdateTripInfoUseCase {
  constructor({ tripInfoRepository }) {
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute({ tripInfoId, updates }) {
    try {
      const existing = await this.tripInfoRepository.getTripInfoById(tripInfoId);
      if (!existing) {
        return { success: false, error: 'Trip info not found', status: 404 };
      }

      const {
        valid,
        errors,
        payload
      } = validateTripInfoPayload(updates, { isUpdate: true });
      if (!valid) {
        return { success: false, error: errors.join(', '), status: 400 };
      }

      const updated = await this.tripInfoRepository.updateTripInfo(
        tripInfoId,
        payload
      );
      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default UpdateTripInfoUseCase;

