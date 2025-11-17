/**
 * @file        GuideRepository.js
 * @description Repository class for the "Guide" table.
 *              Extends BaseRepository and provides generic CRUD operations
 *              along with entity-specific methods like findGuidesByLastName.
 * 
 * @extends     BaseRepository
 * 
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-17
 * 
 * @notes       - This repository contains only database access logic for Guides.
 *              - Business logic (validation, authentication, etc.) should be placed in service layer.
 *              - All methods return data or throw errors from Supabase.
 * 
 * Usage Example:
 * 
 * import GuideRepository from './GuideRepository.js';
 * const guideRepo = new GuideRepository(supabaseClient);
 * 
 * // Fetch all guides
 * const guides = await guideRepo.getAllGuides();
 * 
 * // Fetch a guide by ID
 * const guide = await guideRepo.getGuideById(1);
 * 
 * // Find guides by last name
 * const matchingGuides = await guideRepo.findGuidesByLastName('Smith');
 */


import BaseRepository from './baseRepository.js';

class GuideRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'Guide');
    this.primaryKey = 'guide_id';
  }

  // CRUD methods
  getAllGuides() {
    return this.getAll();
  }

  getGuideById(id) {
    return this.getById(this.primaryKey, id);
  }

  createGuide(record) {
    return this.create(record);
  }

  updateGuide(id, updates) {
    const updatedRecord = {
      ...updates,
      updated_at: new Date().toISOString(), // optional if you have updated_at
    };
    return this.update(this.primaryKey, id, updatedRecord);
  }

  deleteGuide(id) {
    return this.delete(this.primaryKey, id);
  }

  // Custom methods

  // Find guides by last name
  async findGuidesByLastName(last_name) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('last_name', last_name);
    if (error) throw error;
    return data;
  }
}

export default GuideRepository;
