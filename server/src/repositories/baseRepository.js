/**
 * @file        baseRepository.js
 * @description Base repository class for generic CRUD operations using Supabase.
 *              All entity repositories should extend this class.
 * 
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-17  // date of creation
 * @lastModified 2025-11-17 
 * 
 * @notes       - This file contains only database access logic.
 *              - No business logic should be placed here.
 *              - All methods return data or throw errors from Supabase.
 *              - Data retuned is an object {prop1: ...  ,prop2: ...}
 * 
 * Usage Example:
 * 
 * import BaseRepository from './BaseRepository.js';
 * const repo = new BaseRepository(supabaseClient, 'users');
 * const users = await repo.getAll();
 */




// repositories/BaseRepository.js - one entity orianted
class BaseRepository {
  constructor(supabaseClient, tableName) {
    this.supabase = supabaseClient;
    this.table = tableName;
  }

  //fetch/select all rows from table
  async getAll() {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*');
    if (error) throw error;
    return data;
  }

//fetch/select all rows from table with specific primary key
  async getById(primary_key,id) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq(primary_key, id)
      .single();
    if (error) throw error;
    return data;
  }

  //create new entity in a table
  async create(record) {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert(record)
      .select(); // return created row
    if (error) throw error;
    return data[0]; 
  }

  //update entity in a table
  async update(primary_key,id, updates) {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(updates)
      .eq(primary_key, id)
      .select(); // return updated row
    if (error) throw error;
    return data[0]; 
  }

  async delete(primary_key,id) {
    const { data, error } = await this.supabase
      .from(this.table)
      .delete()
      .eq(primary_key, id)
      .select();  // return deleted row
    if (error) throw error;
    return data[0];
  }
}


export default BaseRepository;