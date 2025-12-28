/**
 * @file        TravelersController.js
 * @description Defines controller functions for handling travelers-related requests.
 *              Controllers receive HTTP request data, invoke repositories, and return JSON results.
 *
 * @requires    TravelersRepository - Access to traveler database operations
 *
 * @author      System
 * @version     1.0.0
 * @date        2025-12-26
 */

import TravelersRepository from "../../repositories/TravelersRepository.js";
import supabase from "../../config/supabase.js";

const travelersRepository = new TravelersRepository(supabase);

class TravelersController {
  async getAllTravelers(req, res) {
    try {
      const { booking_id, user_id, first_name, last_name, limit = 50, offset = 0 } = req.query;

      const filters = {};
      if (booking_id) filters.booking_id = booking_id;
      if (user_id) filters.user_id = user_id;
      if (first_name) filters.first_name = first_name;
      if (last_name) filters.last_name = last_name;
      if (limit) filters.limit = parseInt(limit);
      if (offset) filters.offset = parseInt(offset);

      const travelers = await travelersRepository.getAllTravelers(filters);

      res.json({
        status: "success",
        data: travelers,
        message: "Travelers retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching travelers:", error);
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message || "Failed to fetch travelers"
      });
    }
  }

  async getTravelerById(req, res) {
    try {
      const { id } = req.params;

      const traveler = await travelersRepository.getTravelerById(id);

      if (!traveler) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "Traveler not found"
        });
      }

      res.json({
        status: "success",
        data: traveler,
        message: "Traveler retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching traveler:", error);
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message || "Failed to fetch traveler"
      });
    }
  }

  async getTravelersByBookingId(req, res) {
    try {
      const { bookingId } = req.params;

      const travelers = await travelersRepository.getTravelersByBookingId(bookingId);

      res.json({
        status: "success",
        data: travelers || [],
        message: "Travelers retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching travelers by booking ID:", error);
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message || "Failed to fetch travelers"
      });
    }
  }

  async createTraveler(req, res) {
    try {
      const {
        booking_id,
        user_id,
        first_name,
        last_name,
        age,
        gender,
        identity_number,
        passport_number,
        traveler_contact,
        payer_id
      } = req.body;

      if (!booking_id || !first_name || !last_name) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Missing required fields: booking_id, first_name, last_name"
        });
      }

      const traveler = await travelersRepository.createTraveler({
        booking_id,
        user_id,
        first_name,
        last_name,
        age,
        gender,
        identity_number,
        passport_number,
        traveler_contact,
        payer_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      res.status(201).json({
        status: "success",
        data: traveler,
        message: "Traveler created successfully"
      });
    } catch (error) {
      console.error("Error creating traveler:", error);
      res.status(400).json({
        status: "error",
        data: null,
        message: error.message || "Failed to create traveler"
      });
    }
  }

  async updateTraveler(req, res) {
    try {
      const { id } = req.params;
      const {
        first_name,
        last_name,
        age,
        gender,
        identity_number,
        passport_number,
        traveler_contact,
        payer_id
      } = req.body;

      const existingTraveler = await travelersRepository.getTravelerById(id);
      if (!existingTraveler) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "Traveler not found"
        });
      }

      const updatedTraveler = await travelersRepository.updateTraveler(id, {
        first_name: first_name || existingTraveler.first_name,
        last_name: last_name || existingTraveler.last_name,
        age: age !== undefined ? age : existingTraveler.age,
        gender: gender !== undefined ? gender : existingTraveler.gender,
        identity_number: identity_number !== undefined ? identity_number : existingTraveler.identity_number,
        passport_number: passport_number !== undefined ? passport_number : existingTraveler.passport_number,
        traveler_contact: traveler_contact !== undefined ? traveler_contact : existingTraveler.traveler_contact,
        payer_id: payer_id !== undefined ? payer_id : existingTraveler.payer_id,
        updated_at: new Date().toISOString()
      });

      res.json({
        status: "success",
        data: updatedTraveler,
        message: "Traveler updated successfully"
      });
    } catch (error) {
      console.error("Error updating traveler:", error);
      res.status(400).json({
        status: "error",
        data: null,
        message: error.message || "Failed to update traveler"
      });
    }
  }

  async deleteTraveler(req, res) {
    try {
      const { id } = req.params;

      const existingTraveler = await travelersRepository.getTravelerById(id);
      if (!existingTraveler) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "Traveler not found"
        });
      }

      await travelersRepository.deleteTraveler(id);

      res.json({
        status: "success",
        data: null,
        message: "Traveler deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting traveler:", error);
      res.status(400).json({
        status: "error",
        data: null,
        message: error.message || "Failed to delete traveler"
      });
    }
  }
}

export default new TravelersController();
