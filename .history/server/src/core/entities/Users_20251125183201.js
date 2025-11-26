/**
 * @file        User.js
 * @description User entity representing the core user object in the system.
 *              Contains properties and minimal helper methods related to a user.
 * 
 * @author      Kossai Baha
 * @version     1.0.0
 * @date        2025-11-18  // date of creation
 * @lastModified 2025-11-18
 * 
 * @notes       - This file contains only the domain representation of a User.
 *              - No database access or business logic should be implemented here.
 *              - Use this entity in UseCases for business operations.
 * 
 * Usage Example:
 * 
 * import User from './User.js';
 * const user = new User({ id: 1, email: 'test@test.com', type: 1 });
 * if (user.isType(1)) {
 *     console.log('User is type 1');
 * }
 */

class User {
  constructor({
    userId = null,
    branchId = null,
    email,
    passwordHash,
    firstName,
    lastName,
    phone = null,
    dateOfBirth = null,
    type = 'USER',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.userId = userId;
    this.branchId = branchId;
    this.email = email;
    this.passwordHash = passwordHash;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(record = {}) {
    return new User({
      userId: record.user_id,
      branchId: record.branch_id,
      email: record.email,
      passwordHash: record.password_hash,
      firstName: record.first_name,
      lastName: record.last_name,
      phone: record.phone,
      dateOfBirth: record.date_of_birth,
      type: record.type ?? 'USER',
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  toPersistence() {
    return {
      user_id: this.userId,
      branch_id: this.branchId,
      email: this.email,
      password_hash: this.passwordHash,
      first_name: this.firstName,
      last_name: this.lastName,
      phone: this.phone,
      date_of_birth: this.dateOfBirth,
      type: this.type,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  isType(type) {
    return this.type === type;
  }
}

export default User;
