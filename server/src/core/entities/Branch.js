/**
 * @file Branch.js
 * @description Immutable representation of a branch record.
 */
class Branch {
  constructor({
    branchId = null,
    name,
    address,
    city,
    phone,
    email,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.branchId = branchId;
    this.name = name;
    this.address = address;
    this.city = city;
    this.phone = phone;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(record = {}) {
    return new Branch({
      branchId: record.branch_id,
      name: record.branch_name,
      address: record.branch_address,
      city: record.branch_city,
      phone: record.phone,
      email: record.email,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  }

  toPersistence() {
    return {
      branch_id: this.branchId,
      branch_name: this.name,
      branch_address: this.address,
      branch_city: this.city,
      phone: this.phone,
      email: this.email,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
}

export default Branch;

