/**
 * @file        guideController.js
 * @description Controller for handling guide API requests
 *              Routes requests to GuideRepository and manages business logic
 * 
 * @author      Abderahim
 * @version     1.0.0
 * @date        2025-11-18
 */

import GuideRepository from '../repositories/GuideRepository.js';

class GuideController {
  constructor(supabaseClient) {
    this.guideRepo = new GuideRepository(supabaseClient);
  }

  // CREATE - Add a new guide
  async createGuide(req, res) {
    try {
      const { first_name, last_name, guide_contact, experience, date_of_birth } = req.body;

      // Validation
      if (!first_name || !last_name || !guide_contact || !date_of_birth) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: first_name, last_name, guide_contact, date_of_birth'
        });
      }

      const guide = await this.guideRepo.createGuide({
        first_name,
        last_name,
        guide_contact,
        experience,
        date_of_birth
      });

      res.status(201).json({
        success: true,
        message: 'Guide created successfully',
        data: guide
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating guide',
        error: error.message
      });
    }
  }

  // READ - Get all guides
  async getAllGuides(req, res) {
    try {
      const { last_name, limit = 10, offset = 0 } = req.query;
      
      let guides;
      
      if (last_name) {
        guides = await this.guideRepo.findGuidesByLastName(last_name);
      } else {
        guides = await this.guideRepo.getAllGuides();
      }

      // Apply pagination
      const paginatedGuides = guides.slice(
        parseInt(offset),
        parseInt(offset) + parseInt(limit)
      );

      res.status(200).json({
        success: true,
        message: 'Guides retrieved successfully',
        data: paginatedGuides,
        total: guides.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving guides',
        error: error.message
      });
    }
  }

  // READ - Get guide by ID
  async getGuideById(req, res) {
    try {
      const { id } = req.params;

      const guide = await this.guideRepo.getGuideById(id);

      if (!guide) {
        return res.status(404).json({
          success: false,
          message: 'Guide not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Guide retrieved successfully',
        data: guide
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving guide',
        error: error.message
      });
    }
  }

  // UPDATE - Update guide by ID
  async updateGuide(req, res) {
    try {
      const { id } = req.params;
      const { first_name, last_name, guide_contact, experience, date_of_birth } = req.body;

      // Verify guide exists
      const existingGuide = await this.guideRepo.getGuideById(id);
      if (!existingGuide) {
        return res.status(404).json({
          success: false,
          message: 'Guide not found'
        });
      }

      const guide = await this.guideRepo.updateGuide(id, {
        first_name,
        last_name,
        guide_contact,
        experience,
        date_of_birth
      });

      res.status(200).json({
        success: true,
        message: 'Guide updated successfully',
        data: guide
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating guide',
        error: error.message
      });
    }
  }

  // DELETE - Delete guide by ID
  async deleteGuide(req, res) {
    try {
      const { id } = req.params;

      // Verify guide exists
      const existingGuide = await this.guideRepo.getGuideById(id);
      if (!existingGuide) {
        return res.status(404).json({
          success: false,
          message: 'Guide not found'
        });
      }

      await this.guideRepo.deleteGuide(id);

      res.status(200).json({
        success: true,
        message: 'Guide deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting guide',
        error: error.message
      });
    }
  }
}

export default GuideController;

