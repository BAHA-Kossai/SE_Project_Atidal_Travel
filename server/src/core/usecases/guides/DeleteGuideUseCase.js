export class DeleteGuideUseCase {
  constructor({ guideRepository }) {
    this.guideRepository = guideRepository;
  }

  async execute({ guideId }) {
    try {
      const guide = await this.guideRepository.getGuideById(guideId);
      if (!guide) {
        return { success: false, error: 'Guide not found', status: 404 };
      }

      await this.guideRepository.deleteGuide(guideId);
      return { success: true, data: { message: 'Guide deleted' } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default DeleteGuideUseCase;


