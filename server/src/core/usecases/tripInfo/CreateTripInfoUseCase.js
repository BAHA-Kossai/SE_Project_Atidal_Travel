import { validateTripInfoPayload } from '../../../api/validators/tripInfoValidator.js';

export class CreateTripInfoUseCase {
  constructor({ tripInfoRepository }) {
    this.tripInfoRepository = tripInfoRepository;
  }

  async execute(input) {
    try {
      const { valid, errors, payload } = validateTripInfoPayload(input);
      if (!valid) {
        return { success: false, error: errors.join(', '), status: 400 };
      }

      const now = new Date().toISOString();
      const created = await this.tripInfoRepository.createTripInfo({
        ...payload,
        created_at: now,
        updated_at: now
      });

      return { success: true, data: created, status: 201 };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default CreateTripInfoUseCase;

