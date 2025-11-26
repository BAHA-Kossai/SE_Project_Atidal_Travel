/**
 * @file        CreateGuideUseCase.js
 * @description Use case class for handling creation of a new guide.
 *              Delegates database operations to GuideRepository.
 *              Validates input using CreateGuideValidator before creation.
 * 
 * @author      Kossai Baha
 * @version     1.1.0
 * @date        2025-11-23
 * @lastModified 2025-11-23
 */


import { CreateGuideValidator } from '../../../api/validators/Guide/GuideValidator.js';

class CreateGuideUseCase {
  constructor(guideRepository) {
    this.guideRepository = guideRepository;
  }

  /**
   * @description Creates a new guide in the system
   * @param {Object} admin - user object performing the action (optional validation)
   * @param {Object} guideData - Object containing guide fields:
   * @param {string} guideData.first_name - Guide first name
   * @param {string} guideData.last_name - Guide last name
   * @param {string} guideData.phone - Contact phone
   * @param {string} [guideData.experiance] - Guide experience description
   * @param {string} guideData.birth_date - Date of birth in YYYY-MM-DD
   * 
   * @returns {Object} Returns created guide data from the database
   */
  async execute(admin, guideData) {
    if (!admin || !guideData) {
      throw { status: 400, message: 'Error-creating guide-usecase: admin and guide data must be provided' };
    }

    // Check if admin has permissions to create guides
    if (admin.type !== 'SUPER_ADMIN' && admin.type !== 'ADMIN') {
      throw { status: 403, message: 'Forbidden: only admins can add guides' };
    }

    // Validate guide data using CreateGuideValidator
    const validationErrors = CreateGuideValidator.validate(guideData);
    if (validationErrors.length > 0) {
      throw { status: 400, message: 'Validation errors', errors: validationErrors };
    }

    // Prepare guide object with defaults
    const guideToCreate = {
      ...guideData,
      experiance: guideData.experiance || 'no experience',
    };

    // Insert guide into DB
    const createdGuide = await this.guideRepository.createGuide(guideToCreate);

    return {
      database: {
        first_name: createdGuide.first_name,
        last_name: createdGuide.last_name,
        phone: createdGuide.phone,
        experiance: createdGuide.experiance,
        birth_date: createdGuide.birth_date,
      }
    };
  }
}

export default CreateGuideUseCase;
