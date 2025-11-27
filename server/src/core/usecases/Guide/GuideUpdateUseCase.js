/**
 * @file        GuideUpdateUseCase.js
 * @description Use case class for updating an existing guide.
 *              Delegates database operations to GuideRepository.
 *              Validates input using CreateGuideValidator before update.
 * 
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-23
 */

import { CreateGuideValidator } from '../../../api/validators/Guide/GuideValidator.js';

class UpdateGuideUseCase {
  constructor(guideRepository) {
    this.guideRepository = guideRepository;
  }

  /**
   * @description Updates an existing guide in the system
   * @param {Object} admin - user object performing the action
   * @param {string|number} guideId - ID of the guide to update
   * @param {Object} guideData - Object containing fields to update
   * @param {string} [guideData.first_name]
   * @param {string} [guideData.last_name]
   * @param {string} [guideData.phone]
   * @param {string} [guideData.experiance]
   * @param {string} [guideData.birth_date]
   * 
   * @returns {Object} Updated guide object
   */
  async execute(admin, guideId, guideData) {
    if (!admin || !guideId || !guideData) {
      throw { status: 400, message: 'Admin, guide ID, and guide data must be provided' };
    }

    // Permission check
    if (admin.type !== 'SUPER_ADMIN' && admin.type !== 'ADMIN') {
      throw { status: 403, message: 'Forbidden: only admins can update guides' };
    }

    //  validate guideData
    const validationErrors = CreateGuideValidator.validate(guideData); 
    if (validationErrors.length > 0) {
      throw { status: 400, message: 'Validation errors', errors: validationErrors };
    }

    // Prepare update object
    const guideToUpdate = {
      ...guideData,
      experiance: guideData.experiance || 'no experience',
    };

    // Update guide in DB
    const updatedGuide = await this.guideRepository.updateGuide(guideId, guideToUpdate);

    return {
      database: {
        guide_id: updatedGuide.guide_id,
        first_name: updatedGuide.first_name,
        last_name: updatedGuide.last_name,
        phone: updatedGuide.phone,
        experiance: updatedGuide.experiance,
        birth_date: updatedGuide.birth_date,
      }
    };
  }
}

export default UpdateGuideUseCase;
