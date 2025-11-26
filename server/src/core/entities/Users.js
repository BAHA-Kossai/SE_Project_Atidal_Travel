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
    userId,
    createdAt,
    type,
    branchId,
    email,
    passwordHash,
    lastName,
    firstName,
    phone,
    dateOfBirth,
    updatedAt
  }) {
        userId,
    type = "USER",// default to 'USER' if not provided
    branchId,
    email,
    passwordHash,
    lastName,
    firstName,
    phone,
    dateOfBirth,
    createdAt = new Date(), // default to now if not provided
    updatedAt = new Date()  // default to now if not provided
  }

  // Helper method to check user type
  isType(type) {
    return this.type === type;
  }
  

}

export default User;
