import { request } from "./request";

/**
 * Get all payers (requires Admin/SuperAdmin)
 */
export const getAllPayers = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.booking_id) params.append("booking_id", filters.booking_id);
  if (filters.traveler_id) params.append("traveler_id", filters.traveler_id);
  if (filters.first_name) params.append("first_name", filters.first_name);
  if (filters.last_name) params.append("last_name", filters.last_name);
  if (filters.limit) params.append("limit", filters.limit);
  if (filters.offset) params.append("offset", filters.offset);
  
  const queryString = params.toString();
  return request(`/api/payers${queryString ? `?${queryString}` : ''}`, {
    method: "GET",
    requiresAuth: true
  });
};

/**
 * Get a specific payer by ID
 */
export const getPayerById = (payerId) =>
  request(`/api/payers/${payerId}`, {
    method: "GET",
    requiresAuth: true
  });

/**
 * Create a new payer record
 */
export const createPayer = (payerData) =>
  request("/api/payers", {
    method: "POST",
    data: payerData,
    requiresAuth: true
  });

/**
 * Update an existing payer
 */
export const updatePayer = (payerId, payerData) =>
  request(`/api/payers/${payerId}`, {
    method: "PUT",
    data: payerData,
    requiresAuth: true
  });

/**
 * Delete a payer
 */
export const deletePayer = (payerId) =>
  request(`/api/payers/${payerId}`, {
    method: "DELETE",
    requiresAuth: true
  });

/**
 * Get payers by booking ID
 */
export const getPayersByBookingId = (bookingId) =>
  request(`/api/payers/booking/${bookingId}`, {
    method: "GET",
    requiresAuth: true
  });
