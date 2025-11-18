/**
 * @file        UserRepository.js
 * @description Repository class for the "Users" table.
 *              Extends BaseRepository and provides generic CRUD operations
 *              along with entity-specific methods like findByEmail and findByBranch.
 *
 * @extends     BaseRepository
 *
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-17  // date of creation
 * @lastModified 2025-11-17
 *
 * @notes       - This repository contains only database access logic for Users.
 *              - Business logic (validation, authentication, etc.) should be placed in service layer.
 *              - All methods return data or throw errors from Supabase.
 *
 * Usage Example:
 *
 * import UserRepository from './UserRepository.js';
 * const userRepo = new UserRepository(supabaseClient);
 *
 * // Fetch all users
 * const users = await userRepo.getAllUsers();
 *
 * // Fetch a user by ID
 * const user = await userRepo.getUserById(1);
 *
 * // Find a user by email
 * const found = await userRepo.findByEmail('test@example.com');
 */

import BaseRepository from './baseRepository.js'

class UserRepository extends BaseRepository {
  constructor(supabaseClient) {
    super(supabaseClient, "Users");
    this.primaryKey = "user_id";
  }

  // CRUD methods using BaseRepository
  getAllUsers() {
    return this.getAll();

  }
  //---- variantes to getAll
    // New: get all admins
  async getAllAdmins() {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("type", "ADMIN");
    if (error) throw error;
    return data;
  }

  // New: get all regular users
  async getAllRegularUsers() {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("type", "USER");
    if (error) throw error;
    return data;
  }
  getUserById(id) {
    return this.getById(this.primaryKey, id);
  }
  createUser(record) {
    return this.create(record);
  }

  //---variante for create user 
  // Create methods with automatic type
  createRegularUser(record) {
    const userRecord = {
      ...record,
      type: "USER"
    };
    return this.create(userRecord);
  }

  createAdminUser(record) {
    const userRecord = {
      ...record,
      type: "ADMIN"
    };
    return this.create(userRecord);
  }
  updateUser(id, updates) {
    // Add updated_at timestamp automatically
    const updatedRecord = {
      ...updates,
      updated_at: new Date().toISOString(), // current date-time in ISO format
    };

    return this.update(this.primaryKey, id, updatedRecord);
  }
  deleteUser(id) {
    return this.delete(this.primaryKey, id);
  }

  // Custom methods
  async findByEmail(email) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("email", email)
      .single();
    if (error) throw error;
    return data;
  }

  async findByBranch(branch_id) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("branch_id", branch_id);
    if (error) throw error;
    return data;
  }
}

export default UserRepository;
