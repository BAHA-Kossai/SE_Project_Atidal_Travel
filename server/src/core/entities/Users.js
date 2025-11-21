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
    user_id,
    created_at,
    type,
    email,
    password_hash,
     password,
    last_name,
    first_name,
    phone,
    date_of_birth,
    updated_at
  }) {
    this.user_id = user_id;
    this.type = type;
    this.email = email;
    this.password_hash = password_hash;
     this.password = password;
    this.last_name = last_name;
    this.first_name = first_name;
    this.phone = phone;
    this.date_of_birth = date_of_birth;
    this.created_at = created_at || new Date(); // default to now if not provided
    this.updated_at = updated_at || new Date(); // default to now if not provided
  }

  // Helper method to check user type
  isType(type) {
    return this.type === type;
  }
  

}

export default User;
