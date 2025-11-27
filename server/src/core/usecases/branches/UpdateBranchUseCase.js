export class UpdateBranchUseCase {
  constructor({ branchRepository }) {
    this.branchRepository = branchRepository;
  }

  async execute({ branchId, updates }) {
    try {
      const branch = await this.branchRepository.getBranchById(branchId);
      if (!branch) {
        return { success: false, error: 'Branch not found', status: 404 };
      }

      if (
        updates.branch_name &&
        updates.branch_name.toLowerCase() !== branch.branch_name.toLowerCase()
      ) {
        const allBranches = await this.branchRepository.getAllBranches();
        const duplicate = allBranches.find(
          (item) =>
            item.branch_id !== Number(branchId) &&
            item.branch_name?.toLowerCase() ===
              updates.branch_name.toLowerCase()
        );
        if (duplicate) {
          return {
            success: false,
            error: 'Branch with this name already exists',
            status: 409
          };
        }
      }
      const updated = await this.branchRepository.updateBranch(
        branchId,
        updates
      );
      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default UpdateBranchUseCase;

