import { request, requestWithFormData } from "./request";

/**
 * Get all guided trips with optional filters
 */
export const getAllGuidedTrips = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.destination_country) params.append("destination_country", filters.destination_country);
  if (filters.destination_city) params.append("destination_city", filters.destination_city);
  if (filters.date_from) params.append("date_from", filters.date_from);
  if (filters.date_to) params.append("date_to", filters.date_to);
  if (filters.min_price) params.append("min_price", filters.min_price);
  if (filters.max_price) params.append("max_price", filters.max_price);
  if (filters.only_available) params.append("only_available", filters.only_available);
  if (filters.sort_by) params.append("sort_by", filters.sort_by);
  if (filters.limit) params.append("limit", filters.limit);
  if (filters.offset) params.append("offset", filters.offset);
  
  const queryString = params.toString();
  return request(`/api/guided-trips${queryString ? `?${queryString}` : ''}`, {
    method: "GET",
    requiresAuth: false
  });
};

/**
 * Get guided trip by ID
 */
export const getGuidedTripById = (id) =>
  request(`/api/guided-trips/${id}`, {
    method: "GET",
    requiresAuth: false
  });

/**
 * Get guided trips by type (Umrah or Normal)
 */
export const getGuidedTripsByType = (type, limit = null) => {
  const params = limit ? `?limit=${limit}` : '';
  return request(`/api/guided-trips/type/${type}${params}`, {
    method: "GET",
    requiresAuth: false
  });
};

/**
 * Get Umrah trips
 */
export const getUmrahTrips = (limit = null) =>
  getGuidedTripsByType("Umrah", limit);

/**
 * Get normal guided trips
 */
export const getNormalGuidedTrips = (limit = null) =>
  getGuidedTripsByType("Normal", limit);