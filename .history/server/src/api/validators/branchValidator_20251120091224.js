/**
 * @file        branchValidator.js
 * @description Request validation middleware for branch endpoints
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-19
 */

export const validateBranch = (req, res, next) => {
  const { 
    branch_name, 
    branch_address, 
    branch_city, 
    phone, 
    email, 
    manager_name, 
    opening_time, 
    closing_time, 
    working_days, 
    is_active 
  } = req.body;

  // For POST requests, validate required fields
  if (req.method === 'POST') {
    const errors = [];

    if (!branch_name || typeof branch_name !== 'string' || branch_name.trim().length === 0) {
      errors.push('branch_name is required and must be a non-empty string');
    }

    if (!branch_address || typeof branch_address !== 'string' || branch_address.trim().length === 0) {
      errors.push('branch_address is required and must be a non-empty string');
    }

    if (!branch_city || typeof branch_city !== 'string' || branch_city.trim().length === 0) {
      errors.push('branch_city is required and must be a non-empty string');
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      errors.push('phone is required and must be a non-empty string');
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      errors.push('email is required and must be a non-empty string');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('email must be a valid email address');
    }

    if (!manager_name || typeof manager_name !== 'string' || manager_name.trim().length === 0) {
      errors.push('manager_name is required and must be a non-empty string');
    }

    if (opening_time !== undefined && typeof opening_time !== 'string') {
      errors.push('opening_time must be a string (time format)');
    }

    if (closing_time !== undefined && typeof closing_time !== 'string') {
      errors.push('closing_time must be a string (time format)');
    }

    if (working_days !== undefined && typeof working_days !== 'object') {
      errors.push('working_days must be an object or array');
    }

    if (is_active !== undefined && typeof is_active !== 'boolean') {
      errors.push('is_active must be a boolean');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
  }

  // For PUT requests, validate only provided fields
  if (req.method === 'PUT') {
    const errors = [];

    if (branch_name !== undefined) {
      if (typeof branch_name !== 'string' || branch_name.trim().length === 0) {
        errors.push('branch_name must be a non-empty string');
      }
    }

    if (branch_address !== undefined) {
      if (typeof branch_address !== 'string' || branch_address.trim().length === 0) {
        errors.push('branch_address must be a non-empty string');
      }
    }

    if (branch_city !== undefined) {
      if (typeof branch_city !== 'string' || branch_city.trim().length === 0) {
        errors.push('branch_city must be a non-empty string');
      }
    }

    if (phone !== undefined) {
      if (typeof phone !== 'string' || phone.trim().length === 0) {
        errors.push('phone must be a non-empty string');
      }
    }

    if (email !== undefined) {
      if (typeof email !== 'string' || email.trim().length === 0) {
        errors.push('email must be a non-empty string');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('email must be a valid email address');
      }
    }

    if (manager_name !== undefined) {
      if (typeof manager_name !== 'string' || manager_name.trim().length === 0) {
        errors.push('manager_name must be a non-empty string');
      }
    }

    if (opening_time !== undefined && typeof opening_time !== 'string') {
      errors.push('opening_time must be a string (time format)');
    }

    if (closing_time !== undefined && typeof closing_time !== 'string') {
      errors.push('closing_time must be a string (time format)');
    }

    if (working_days !== undefined && typeof working_days !== 'object') {
      errors.push('working_days must be an object or array');
    }

    if (is_active !== undefined && typeof is_active !== 'boolean') {
      errors.push('is_active must be a boolean');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
  }

  next();
};

export default validateBranch;

