/**
 * @file        GuideDeleteUseCase.js
 * @description Use case class for deleting an existing guide.
 *              Delegates database operations to GuideRepository.
 * 
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-23
 */

class GuideDeleteUseCase {
  constructor(guideRepository) {
    this.guideRepository = guideRepository;
  }

  /**
   * @description Deletes a guide by ID
   * @param {Object} admin - user object performing the action
   * @param {string|number} guideId - ID of the guide to delete
   * 
   * @returns {Object} Confirmation message
   */
  async execute(admin, guideId) {
    if (!admin || !guideId) {
      throw { status: 400, message: 'Admin and guide ID must be provided' };
    }

    // Permission check
    if (admin.type !== 'SUPER_ADMIN' && admin.type !== 'ADMIN') {
      throw { status: 403, message: 'Forbidden: only admins can delete guides' };
    }

    // Delete guide in DB
    await this.guideRepository.deleteGuide(guideId);

    return {
      message: `Guide with ID ${guideId} successfully deleted`
    };
  }
}

export default GuideDeleteUseCase;
