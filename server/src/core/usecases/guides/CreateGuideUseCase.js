import validator from 'validator';

const REQUIRED_FIELDS = [
  'first_name',
  'last_name',
  'guide_contact',
  'date_of_birth'
];

export class CreateGuideUseCase {
  constructor({ guideRepository }) {
    this.guideRepository = guideRepository;
  }

  async execute(input) {
    try {
      const missing = REQUIRED_FIELDS.filter(
        (field) => !input[field] && input[field] !== 0
      );
      if (missing.length > 0) {
        return {
          success: false,
          error: `Missing required fields: ${missing.join(', ')}`,
          status: 400
        };
      }

      if (
        input.guide_contact &&
        !validator.isMobilePhone(input.guide_contact, 'any', {
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
        input.date_of_birth &&
        !validator.isISO8601(input.date_of_birth, { strict: true })
      ) {
        return {
          success: false,
          error: 'date_of_birth must be a valid ISO8601 date',
          status: 400
        };
      }

      const now = new Date().toISOString();
      const guide = await this.guideRepository.createGuide({
        ...input,
        created_at: now,
        updated_at: now
      });

      return { success: true, data: guide, status: 201 };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default CreateGuideUseCase;


