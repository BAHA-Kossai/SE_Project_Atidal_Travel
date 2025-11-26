export class GetAllGuidesUseCase {
  constructor({ guideRepository }) {
    this.guideRepository = guideRepository;
  }

  async execute({ last_name, limit = 10, offset = 0 } = {}) {
    try {
      let guides;
      if (last_name) {
        guides = await this.guideRepository.findGuidesByLastName(last_name);
      } else {
        guides = await this.guideRepository.getAllGuides();
      }

      const start = Number(offset);
      const end = start + Number(limit);
      const paginated = guides.slice(start, end);

      return {
        success: true,
        data: {
          guides: paginated,
          total: guides.length,
          limit: Number(limit),
          offset: Number(offset)
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetAllGuidesUseCase;


