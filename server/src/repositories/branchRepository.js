/**
 * @file        BranchesRepository.js
 * @description Repository class for the "Branches" table.
 *              Extends BaseRepository and provides generic CRUD operations
 *              along with entity-specific methods like findBranchesByCity.
 * 
 * @extends     BaseRepository
 * 
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-17
 * 
 * @notes       - This repository contains only database access logic for Branches.
 *              - Business logic (validation, operational rules, etc.) should be placed in service layer.
 *              - All methods return data or throw errors from Supabase.
 * 
 * Usage Example:
 * 
 * import BranchesRepository from './BranchesRepository.js';
 * const branchRepo = new BranchesRepository(supabaseClient);
 * 
 * // Fetch all branches
 * const branches = await branchRepo.getAllBranches();
 * 
 * // Fetch a branch by ID
 * const branch = await branchRepo.getBranchById(1);
 * 
 * // Find branches by city
 * const cityBranches = await branchRepo.findBranchesByCity('Algiers');
 */

import BaseRepository from './baseRepository.js';

class BranchesRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'Branches');
    this.primaryKey = 'branch_id';
  }

  // CRUD methods
  getAllBranches() {
    return this.getAll();
  }

  getBranchById(id) {
    return this.getById(this.primaryKey, id);
  }

  createBranch(record) {
    return this.create(record);
  }

  updateBranch(id, updates) {
    // Optional: add updated_at if you have such a column
    const updatedRecord = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.update(this.primaryKey, id, updatedRecord);
  }

  deleteBranch(id) {
    return this.delete(this.primaryKey, id);
  }

  // Custom methods

  // Find branches by city
  async findBranchesByCity(city) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('branch_city', city);
    if (error) throw error;
    return data;
  }

  // Find branches that are active
  async getActiveBranches() {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('is_active', true);
    if (error) throw error;
    return data;
  }

  /**
 * Check if a branch exists by ID
 * @param {number} branch_id
 * @returns {boolean} true if exists, false otherwise
 */
async exists(branch_id) {
  const { data, error } = await this.supabase
    .from(this.table)
    .select('branch_id')
    .eq(this.primaryKey, branch_id)
    .maybeSingle();

  if (error) throw error;
  return !!data; // true if branch exists
}
}

export default BranchesRepository;
