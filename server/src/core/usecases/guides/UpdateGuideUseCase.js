import validator from 'validator';

export class UpdateGuideUseCase {
  constructor({ guideRepository }) {
    this.guideRepository = guideRepository;
  }

  async execute({ guideId, updates }) {
    try {
      const guide = await this.guideRepository.getGuideById(guideId);
      if (!guide) {
        return { success: false, error: 'Guide not found', status: 404 };
      }

      if (
        updates.guide_contact &&
        !validator.isMobilePhone(updates.guide_contact, 'any', {
          strictMode: false
        })
      ) {
        return {
          success: false,
          error: 'guide_contact must be a valid phone number',
          status: 400
        };
      }

      if (
        updates.date_of_birth &&
        !validator.isISO8601(updates.date_of_birth, { strict: true })
      ) {
        return {
          success: false,
          error: 'date_of_birth must be a valid ISO8601 date',
          status: 400
        };
      }

      const updated = await this.guideRepository.updateGuide(guideId, updates);
      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default UpdateGuideUseCase;


