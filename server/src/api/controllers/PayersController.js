/**
 * @file        PayersController.js
 * @description Defines controller functions for handling payers-related requests.
 *              Controllers receive HTTP request data, invoke repositories, and return JSON results.
 *
 * @requires    PayerRepository - Access to payer database operations
 *
 * @author      System
 * @version     1.0.0
 * @date        2025-12-26
 */

import PayerRepository from "../../repositories/PayerRepository.js";
import supabase from "../../config/supabase.js";

const payerRepository = new PayerRepository(supabase);

class PayersController {
  async getAllPayers(req, res) {
    try {
      const { booking_id, traveler_id, first_name, last_name, limit = 50, offset = 0 } = req.query;

      const filters = {};
      if (booking_id) filters.booking_id = booking_id;
      if (traveler_id) filters.traveler_id = traveler_id;
      if (first_name) filters.first_name = first_name;
      if (last_name) filters.last_name = last_name;
      if (limit) filters.limit = parseInt(limit);
      if (offset) filters.offset = parseInt(offset);

      const payers = await payerRepository.getAllPayers(filters);

      res.json({
        status: "success",
        data: payers,
        message: "Payers retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching payers:", error);
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message || "Failed to fetch payers"
      });
    }
  }

  async getPayerById(req, res) {
    try {
      const { id } = req.params;

      const payer = await payerRepository.getPayerById(id);

      if (!payer) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "Payer not found"
        });
      }

      res.json({
        status: "success",
        data: payer,
        message: "Payer retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching payer:", error);
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message || "Failed to fetch payer"
      });
    }
  }

  async getPayersByBookingId(req, res) {
    try {
      const { bookingId } = req.params;

      const payers = await payerRepository.getPayersByBookingId(bookingId);

      res.json({
        status: "success",
        data: payers || [],
        message: "Payers retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching payers by booking ID:", error);
      res.status(500).json({
        status: "error",
        data: null,
        message: error.message || "Failed to fetch payers"
      });
    }
  }

  async createPayer(req, res) {
    try {
      const {
        booking_id,
        traveler_id,
        first_name,
        last_name,
        phone,
        email,
        booking_notes
      } = req.body;

      if (!booking_id || !first_name || !last_name) {
        return res.status(400).json({
          status: "error",
          data: null,
          message: "Missing required fields: booking_id, first_name, last_name"
        });
      }

      const payer = await payerRepository.createPayer({
        booking_id,
        traveler_id,
        first_name,
        last_name,
        phone,
        email,
        booking_notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      res.status(201).json({
        status: "success",
        data: payer,
        message: "Payer created successfully"
      });
    } catch (error) {
      console.error("Error creating payer:", error);
      res.status(400).json({
        status: "error",
        data: null,
        message: error.message || "Failed to create payer"
      });
    }
  }

  async updatePayer(req, res) {
    try {
      const { id } = req.params;
      const {
        first_name,
        last_name,
        phone,
        email,
        booking_notes,
        confirmed_at,
        cancelled_at
      } = req.body;

      const existingPayer = await payerRepository.getPayerById(id);
      if (!existingPayer) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "Payer not found"
        });
      }

      const updatedPayer = await payerRepository.updatePayer(id, {
        first_name: first_name || existingPayer.first_name,
        last_name: last_name || existingPayer.last_name,
        phone: phone !== undefined ? phone : existingPayer.phone,
        email: email !== undefined ? email : existingPayer.email,
        booking_notes: booking_notes !== undefined ? booking_notes : existingPayer.booking_notes,
        confirmed_at: confirmed_at !== undefined ? confirmed_at : existingPayer.confirmed_at,
        cancelled_at: cancelled_at !== undefined ? cancelled_at : existingPayer.cancelled_at,
        updated_at: new Date().toISOString()
      });

      res.json({
        status: "success",
        data: updatedPayer,
        message: "Payer updated successfully"
      });
    } catch (error) {
      console.error("Error updating payer:", error);
      res.status(400).json({
        status: "error",
        data: null,
        message: error.message || "Failed to update payer"
      });
    }
  }

  async deletePayer(req, res) {
    try {
      const { id } = req.params;

      const existingPayer = await payerRepository.getPayerById(id);
      if (!existingPayer) {
        return res.status(404).json({
          status: "error",
          data: null,
          message: "Payer not found"
        });
      }

      await payerRepository.deletePayer(id);

      res.json({
        status: "success",
        data: null,
        message: "Payer deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting payer:", error);
      res.status(400).json({
        status: "error",
        data: null,
        message: error.message || "Failed to delete payer"
      });
    }
  }
}

export default new PayersController();
