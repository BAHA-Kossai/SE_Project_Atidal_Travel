export class GetGuideUseCase {
  constructor({ guideRepository }) {
    this.guideRepository = guideRepository;
  }

  async execute({ guideId }) {
    try {
      const guide = await this.guideRepository.getGuideById(guideId);
      if (!guide) {
        return { success: false, error: 'Guide not found', status: 404 };
      }
      return { success: true, data: guide };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetGuideUseCase;


