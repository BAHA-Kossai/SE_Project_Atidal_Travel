const toBoolean = (value) =>
  value === true ||
  value === 'true' ||
  value === 1 ||
  value === '1';

export class GetAllBranchesUseCase {
  constructor({ branchRepository }) {
    this.branchRepository = branchRepository;
  }

  async execute({ city, is_active, limit = 10, offset = 0 } = {}) {
    try {
      let branches;
      if (city) {
        branches = await this.branchRepository.findBranchesByCity(city);
      } else {
        branches = await this.branchRepository.getAllBranches();
      }

      if (is_active !== undefined) {
        const desired = toBoolean(is_active);
        branches = branches.filter(
          (branch) => Boolean(branch.is_active) === desired
        );
      }

      const start = Number(offset);
      const end = start + Number(limit);
      const paginated = branches.slice(start, end);

      return {
        success: true,
        data: {
          branches: paginated,
          total: branches.length,
          limit: Number(limit),
          offset: Number(offset)
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default GetAllBranchesUseCase;

