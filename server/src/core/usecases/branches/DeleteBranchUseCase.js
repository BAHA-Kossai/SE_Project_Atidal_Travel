export class DeleteBranchUseCase {
  constructor({ branchRepository }) {
    this.branchRepository = branchRepository;
  }

  async execute({ branchId }) {
    try {
      const branch = await this.branchRepository.getBranchById(branchId);
      if (!branch) {
        return { success: false, error: 'Branch not found', status: 404 };
      }
      await this.branchRepository.deleteBranch(branchId);
      return { success: true, data: { message: 'Branch deleted' } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default DeleteBranchUseCase;

