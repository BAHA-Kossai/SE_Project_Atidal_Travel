/**
 * @file        guideValidator.js
 * @description Request validation middleware for guide endpoints
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-22
 */

export const validateGuide = (req, res, next) => {
  const { first_name, last_name, guide_contact, experience, date_of_birth } = req.body;

  // For POST requests, validate required fields
  if (req.method === 'POST') {
    const errors = [];

    if (!first_name || typeof first_name !== 'string' || first_name.trim().length === 0) {
      errors.push('first_name is required and must be a non-empty string');
    }

    if (!last_name || typeof last_name !== 'string' || last_name.trim().length === 0) {
      errors.push('last_name is required and must be a non-empty string');
    }

    if (!guide_contact || typeof guide_contact !== 'string' || guide_contact.trim().length === 0) {
      errors.push('guide_contact is required and must be a non-empty string');
    }

    if (!date_of_birth || typeof date_of_birth !== 'string' || date_of_birth.trim().length === 0) {
      errors.push('date_of_birth is required and must be a non-empty string (date format)');
    } else {
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date_of_birth)) {
        errors.push('date_of_birth must be in YYYY-MM-DD format');
      }
    }

    if (experience !== undefined && experience !== null) {
      if (typeof experience !== 'string') {
        errors.push('experience must be a string or null');
      }
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

    if (first_name !== undefined) {
      if (typeof first_name !== 'string' || first_name.trim().length === 0) {
        errors.push('first_name must be a non-empty string');
      }
    }

    if (last_name !== undefined) {
      if (typeof last_name !== 'string' || last_name.trim().length === 0) {
        errors.push('last_name must be a non-empty string');
      }
    }

    if (guide_contact !== undefined) {
      if (typeof guide_contact !== 'string' || guide_contact.trim().length === 0) {
        errors.push('guide_contact must be a non-empty string');
      }
    }

    if (date_of_birth !== undefined) {
      if (typeof date_of_birth !== 'string' || date_of_birth.trim().length === 0) {
        errors.push('date_of_birth must be a non-empty string (date format)');
      } else {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date_of_birth)) {
          errors.push('date_of_birth must be in YYYY-MM-DD format');
        }
      }
    }

    if (experience !== undefined && experience !== null) {
      if (typeof experience !== 'string') {
        errors.push('experience must be a string or null');
      }
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

export default validateGuide;

