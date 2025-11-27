/**
 * @file        GetActiveBranchesWithLimitUseCase.js
 * @description Use case for retrieving active branches with optional limit.
 *              Handles business logic for fetching active branches with pagination support.
 *              Validates input parameters and coordinates data retrieval from repository.
 *
 * @requires    BranchesRepository - Access to branches database operations
 *
 * @author      Ahlem Toubrient
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-25
 */

class GetActiveBranchesWithLimitUseCase {
  constructor(branchesRepository) {
    this.branchesRepository = branchesRepository;
  }

  async execute(limit = null) {
    if (limit && (isNaN(limit) || limit <= 0)) {
      throw new Error('Limit must be a positive number');
    }
    const activeBranches = await this.branchesRepository.getActiveBranchesWithLimit(limit);

    return activeBranches;
  }
}

export default GetActiveBranchesWithLimitUseCase;