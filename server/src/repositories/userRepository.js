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

import BaseRepository from "./baseRepository.js";
import { hashPassword } from "../utils/formValidation.js";
import { supabaseAdmin } from "../config/supabase.js";
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
  async createRegularUser(record) {
    //create user record
    const userRecord = {
      ...record,
      type: "USER",
    };
    return this.create(userRecord);
  }

  createAdminUser(record) {
    const userRecord = {
      ...record,
      type: "ADMIN",
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
  deleteUserBySupabaseId(supabase_id) {
    return this.delete("supabase_id", supabase_id);
  }

  // Custom methods
  async findByEmail(email) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  //function to controll supabase (Authentication)
  /**
   * @method registerAuthUser
   * @description Creates a user in Supabase Auth and stores all fields in user.metadata
   * @param {Object} userData The user data
   * @returns {Object} Supabase Auth user object
   * @throws {Object} Error object with status and message
   */
  async registerAuthUser(userData) {
    const {password,password_hash,...userWithoutpass} = userData;
    const { data: authData, error } = await this.supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: "http://localhost:5173/profile",
        data: userWithoutpass, // store full user object in metadata
      },
    });

    if (error) throw { status: 500, message: error.message };

    return authData.user;
  }

  /**
   * @method registerAdminAuthUser
   * @description Creates an admin user in Supabase Auth using the admin API.
   *              Bypasses email confirmation and stores relevant metadata.
   * @param {Object} adminData - The admin data (email, password, first_name, last_name, phone, date_of_birth)
   * @returns {Object} Supabase Auth user object
   * @throws {Object} Error object with status and message
   */
  async registerAdminAuthUser(adminData) {
    //Check if user already exists in DB
    const existingUser = await this.findByEmail(adminData.email);
    if (existingUser) {
      throw { status: 409, message: "Email already in use" };
    }
    
    //Hash password for DB
    const password_hash = await hashPassword(adminData.password);
    const { password, ...userWithoutPassword } = adminData;

    const adminUser = {
      ...userWithoutPassword,
      type: "ADMIN",
      password_hash,
    };

    //Create user in Supabase Auth using admin API
    const { data: supabaseUser, error } =
      await this.supabase.auth.admin.createUser({
        email: adminData.email,
        password: adminData.password,
        email_confirm: true, // skip confirmation
        user_metadata: {
          first_name: adminData.first_name,
          last_name: adminData.last_name,
          date_of_birth: adminData.date_of_birth,
          phone: adminData.phone,
          type: "ADMIN",
        },
      });
      
    if (error) throw { status: 500, message: error.message };
    //Return both objects
    return {
      supabase: {
        id: supabaseUser.user.id,
        email: supabaseUser.user.email,
        type: "ADMIN",
        first_name: adminData.first_name,
        last_name: adminData.last_name,
      },
    };
  }

  /**
   * @method registerSuperAdmin
   * @description Creates a Super Admin in Supabase Auth and stores it in Users table.
   * @param {Object} superAdminData - Object containing email, password, first_name, last_name, phone, date_of_birth
   * @returns {Object} Supabase and DB user objects
   * @throws {Object} Error object with status and message
   */
  async registerSuperAdmin(superAdminData) {
    //Check if user already exists in DB
    const existingUser = await this.findByEmail(superAdminData.email);
    if (existingUser) {
      throw { status: 409, message: "Email already in use" };
    }

    //Hash password for DB
    const password_hash = await hashPassword(superAdminData.password);
    const { password, ...userWithoutPassword } = superAdminData;

    const superAdminUser = {
      ...userWithoutPassword,
      type: "SUPER_ADMIN",
      password_hash,
    };

    //Create user in Supabase Auth using admin API
    const { data: supabaseUser, error } =
      await this.supabase.auth.admin.createUser({
        email: superAdminData.email,
        password: superAdminData.password,
        email_confirm: true, // skip confirmation
        user_metadata: {
          first_name: superAdminData.first_name,
          last_name: superAdminData.last_name,
          date_of_birth: superAdminData.date_of_birth,
          phone: superAdminData.phone,
          type: "SUPER_ADMIN",
        },
      });

    if (error) throw { status: 500, message: error.message };
      superAdminUser.supabase_id = supabaseUser.id;
    // Save in DB
    const dbUser = await this.createUser(superAdminUser);

    //Return both objects
    return {
      supabase: {
        id: supabaseUser.user.id,
        email: supabaseUser.user.email,
        type: "SUPER_ADMIN",
        first_name: superAdminData.first_name,
        last_name: superAdminData.last_name,
      },
      database: {
        user_id: dbUser.user_id,
        email: dbUser.email,
        type: dbUser.type,
        first_name: dbUser.first_name,
        last_name: dbUser.last_name,
        phone: dbUser.phone,
      },
    };
  }
}

export default UserRepository;
