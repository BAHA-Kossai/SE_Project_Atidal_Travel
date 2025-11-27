const REQUIRED_FIELDS = [
  'branch_name',
  'branch_address',
  'branch_city',
  'phone',
  'email',
  'manager_name'
];

export class CreateBranchUseCase {
  constructor({ branchRepository }) {
    this.branchRepository = branchRepository;
  }

  async execute(input) {
    try {
      const missing = REQUIRED_FIELDS.filter(
        (field) => !input[field] && input[field] !== 0
      );
      if (missing.length > 0) {
        return {
          success: false,
          error: `Missing required fields: ${missing.join(', ')}`,
          status: 400
        };
      }

      const existing = await this.branchRepository.getAllBranches();
      const duplicate = existing.find(
        (branch) =>
          branch.branch_name?.toLowerCase() ===
          input.branch_name.toLowerCase()
      );
      if (duplicate) {
        return {
          success: false,
          error: 'Branch with this name already exists',
          status: 409
        };
      }

      const now = new Date().toISOString();
      const branch = await this.branchRepository.createBranch({
        ...input,
        is_active: input.is_active ?? true,
        created_at: now,
        updated_at: now
      });
      return { success: true, data: branch, status: 201 };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default CreateBranchUseCase;

