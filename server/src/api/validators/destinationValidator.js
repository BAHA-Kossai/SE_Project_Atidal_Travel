/**
 * @file        destinationValidator.js
 * @description Request validation middleware for destination endpoints
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-19
 */

export const validateDestination = (req, res, next) => {
  const { destination_country, destination_city, destination_pic, description } = req.body;

  // For POST requests, validate required fields
  if (req.method === 'POST') {
    const errors = [];

    if (!destination_country || typeof destination_country !== 'string' || destination_country.trim().length === 0) {
      errors.push('destination_country is required and must be a non-empty string');
    }

    if (!destination_city || typeof destination_city !== 'string' || destination_city.trim().length === 0) {
      errors.push('destination_city is required and must be a non-empty string');
    }

    if (destination_pic !== undefined && destination_pic !== null) {
      if (typeof destination_pic !== 'string') {
        errors.push('destination_pic must be a string or null');
      }
    }

    if (description !== undefined && description !== null) {
      if (typeof description !== 'string') {
        errors.push('description must be a string or null');
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

    if (destination_country !== undefined) {
      if (typeof destination_country !== 'string' || destination_country.trim().length === 0) {
        errors.push('destination_country must be a non-empty string');
      }
    }

    if (destination_city !== undefined) {
      if (typeof destination_city !== 'string' || destination_city.trim().length === 0) {
        errors.push('destination_city must be a non-empty string');
      }
    }

    if (destination_pic !== undefined) {
      if (typeof destination_pic !== 'string' && destination_pic !== null) {
        errors.push('destination_pic must be a string or null');
      }
    }

    if (description !== undefined) {
      if (typeof description !== 'string' && description !== null) {
        errors.push('description must be a string or null');
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

export default validateDestination;