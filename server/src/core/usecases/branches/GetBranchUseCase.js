export class GetBranchUseCase {
  constructor({ branchRepository }) {
    this.branchRepository = branchRepository;
  }

  async execute({ branchId }) {
    try {
      const branch = await this.branchRepository.getBranchById(branchId);
      if (!branch) {
        return { success: false, error: 'Branch not found', status: 404 };
      }
      return { success: true, data: branch };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetBranchUseCase;

