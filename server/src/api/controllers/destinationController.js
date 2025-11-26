/**
 * @file        destinationController.js
 * @description Controller for handling destination API requests
 *              Routes requests to DestinationsRepository and manages business logic
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-18
 */

import DestinationsRepository from '../repositories/DestinationsRepository.js';
import supabase from '../../config/supabase.js';

// CREATE - Add a new destination
export const createDestination = async (req, res) => {
  try {
    const destinationRepo = new DestinationsRepository(supabase);
    const { destination_pic, destination_country, description, destination_city } = req.body;

    // Validation
    if (!destination_country || !destination_city) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: destination_country, destination_city'
      });
    }

    // Check if destination (country + city combination) already exists
    const existingDestination = await destinationRepo.searchDestinationsByCountry(destination_country);
    const duplicate = existingDestination.find(
      d => d.destination_city.toLowerCase() === destination_city.toLowerCase()
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'Destination with this country and city combination already exists',
        data: duplicate
      });
    }

    const destination = await destinationRepo.createDestination({
      destination_pic,
      destination_country,
      description,
      destination_city
    });

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: destination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating destination',
      error: error.message
    });
  }
};

// READ - Get all destinations
export const getAllDestinations = async (req, res) => {
  try {
    const destinationRepo = new DestinationsRepository(supabase);
    const { city, country, limit = 10, offset = 0 } = req.query;
    
    let destinations;
    
    if (country) {
      destinations = await destinationRepo.searchDestinationsByCountry(country);
    } else if (city) {
      destinations = await destinationRepo.searchDestinationsByCity(city);
    } else {
      destinations = await destinationRepo.getAllDestinations();
    }

    // Apply pagination
    const paginatedDestinations = destinations.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    res.status(200).json({
      success: true,
      message: 'Destinations retrieved successfully',
      data: paginatedDestinations,
      total: destinations.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving destinations',
      error: error.message
    });
  }
};

// READ - Get destination by ID
export const getDestinationById = async (req, res) => {
  try {
    const destinationRepo = new DestinationsRepository(supabase);
    const { id } = req.params;

    const destination = await destinationRepo.getDestinationById(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Destination retrieved successfully',
      data: destination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving destination',
      error: error.message
    });
  }
};

// UPDATE - Update destination by ID
export const updateDestination = async (req, res) => {
  try {
    const destinationRepo = new DestinationsRepository(supabase);
    const { id } = req.params;
    const { destination_pic, destination_country, description, destination_city } = req.body;

    // Verify destination exists
    const existingDestination = await destinationRepo.getDestinationById(id);
    if (!existingDestination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    const destination = await destinationRepo.updateDestination(id, {
      destination_pic,
      destination_country,
      description,
      destination_city
    });

    res.status(200).json({
      success: true,
      message: 'Destination updated successfully',
      data: destination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating destination',
      error: error.message
    });
  }
};

// DELETE - Delete destination by ID
export const deleteDestination = async (req, res) => {
  try {
    const destinationRepo = new DestinationsRepository(supabase);
    const { id } = req.params;

    // Verify destination exists
    const existingDestination = await destinationRepo.getDestinationById(id);
    if (!existingDestination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    await destinationRepo.deleteDestination(id);

    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting destination',
      error: error.message
    });
  }
};