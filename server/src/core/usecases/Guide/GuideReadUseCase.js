class GuideReadUseCase {
  constructor(guideRepository) {
    this.guideRepository = guideRepository;
  }

  /**
   * @param {Object} params
   * @param {boolean} params.single - true = fetch one, false = fetch all
   * @param {number} [params.id] - guide ID if single=true
   */
  async execute({ single, id }) {

    // Single guide
    if (single) {
      if (!id) {
        throw { status: 400, message: "Guide ID must be provided when single=true" };
      }

      const guide = await this.guideRepository.getGuideById(id);

      if (!guide) {
        throw { status: 404, message: `No guide found with ID ${id}` };
      }

      return guide;
    }

    // All guides
    return await this.guideRepository.getAllGuides();
  }
}

export default GuideReadUseCase;
