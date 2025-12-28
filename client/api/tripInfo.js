import { request } from "./request.js";

/**
 * Get all trip info with optional filters
 */
export const getAllTripInfo = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.destination_country) params.append("destination_country", filters.destination_country);
  if (filters.destination_city) params.append("destination_city", filters.destination_city);
  if (filters.limit) params.append("limit", filters.limit);
  if (filters.offset) params.append("offset", filters.offset);
  
  const queryString = params.toString();
  return request(`/api/trip-info${queryString ? `?${queryString}` : ''}`, {
    method: "GET",
    requiresAuth: false
  });
};

/**
 * Get trip info by ID
 */
export const getTripInfoById = (id) =>
  request(`/api/trip-info/${id}`, {
    method: "GET",
    requiresAuth: false
  });

/**
 * Create new trip info
 */
export const createTripInfo = (tripInfoData) =>
  request("/api/trip-info", {
    method: "POST",
    data: tripInfoData,
    requiresAuth: true
  });

/**
 * Update trip info by ID
 */
export const updateTripInfo = (id, tripInfoData) =>
  request(`/api/trip-info/${id}`, {
    method: "PUT",
    data: tripInfoData,
    requiresAuth: true
  });

/**
 * Delete trip info by ID
 */
export const deleteTripInfo = (id) =>
  request(`/api/trip-info/${id}`, {
    method: "DELETE",
    requiresAuth: true
  });

