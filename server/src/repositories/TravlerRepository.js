/**
 * @file        TravlersRepository.js
 * @description Repository class for the "Travlers" table.
 *              Extends BaseRepository and provides generic CRUD operations
 *              along with entity-specific methods like findTravlersByPayer.
 * 
 * @extends     BaseRepository
 * 
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-17
 * @lastModified 2025-11-17
 * 
 * @notes       - This repository contains only database access logic for Travlers.
 *              - Business logic (validation, verification, etc.) should be placed in service layer.
 *              - All methods return data or throw errors from Supabase.
 * 
 * Usage Example:
 * 
 * import TravlersRepository from './TravlersRepository.js';
 * const travlerRepo = new TravlersRepository(supabaseClient);
 * 
 * // Fetch all travlers
 * const travlers = await travlerRepo.getAllTravlers();
 * 
 * // Fetch a travler by ID
 * const travler = await travlerRepo.getTravlerById(1);
 * 
 * // Find travlers by payer ID
 * const payerTravlers = await travlerRepo.findTravlersByPayer(5);
 */

import BaseRepository from './baseRepository.js';

class TravlersRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, 'Travlers');
    this.primaryKey = 'travler_id';
  }

  // CRUD
  getAllTravlers() { return this.getAll(); }
  getTravlerById(id) { return this.getById(this.primaryKey, id); }
  createTravler(record) { return this.create(record); }
  updateTravler(id, updates) { return this.update(this.primaryKey, id, updates); }
  deleteTravler(id) { return this.delete(this.primaryKey, id); }

  // Custom: get travellers by payer (booking)
  async getTravlersByPayer(payer_id) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('payer_id', payer_id);
    if (error) throw error;
    return data;
  }
}

export default TravlersRepository;
