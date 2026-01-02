import { request } from "./request";

/**
 * Get all travelers (requires Admin/SuperAdmin)
 */
export const getAllTravelers = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.booking_id) params.append("booking_id", filters.booking_id);
  if (filters.user_id) params.append("user_id", filters.user_id);
  if (filters.first_name) params.append("first_name", filters.first_name);
  if (filters.last_name) params.append("last_name", filters.last_name);
  if (filters.limit) params.append("limit", filters.limit);
  if (filters.offset) params.append("offset", filters.offset);
  
  const queryString = params.toString();
  return request(`/api/travelers${queryString ? `?${queryString}` : ''}`, {
    method: "GET",
    requiresAuth: true
  });
};

/**
 * Get a specific traveler by ID
 */
export const getTravelerById = (travelerId) =>
  request(`/api/travelers/${travelerId}`, {
    method: "GET",
    requiresAuth: true
  });

/**
 * Create a new traveler record
 */
export const createTraveler = (travelerData) =>
  request("/api/travelers", {
    method: "POST",
    data: travelerData,
    requiresAuth: true
  });

/**
 * Update an existing traveler
 */
export const updateTraveler = (travelerId, travelerData) =>
  request(`/api/travelers/${travelerId}`, {
    method: "PUT",
    data: travelerData,
    requiresAuth: true
  });

/**
 * Delete a traveler
 */
export const deleteTraveler = (travelerId) =>
  request(`/api/travelers/${travelerId}`, {
    method: "DELETE",
    requiresAuth: true
  });

/**
 * Get travelers by booking ID
 */
export const getTravelersByBookingId = (bookingId) =>
  request(`/api/travelers/booking/${bookingId}`, {
    method: "GET",
    requiresAuth: true
  });
