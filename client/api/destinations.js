import { request, requestWithFormData } from "./request";

/**
 * Get all destinations
 */
export const getAllDestinations = () =>
  request("/api/destinations", {
    method: "GET",
    requiresAuth: false
  });

/**
 * Get featured destinations
 */
export const getFeaturedDestinations = (limit = 3) =>
  request(`/api/destinations/featured?limit=${limit}`, {
    method: "GET",
    requiresAuth: false
  });

/**
 * Search destinations
 */
export const searchDestinations = (query) =>
  request(`/api/destinations/search?q=${encodeURIComponent(query)}`, {
    method: "GET",
    requiresAuth: false
  });

/**
 * Get destination by ID
 */
export const getDestinationById = (id) =>
  request(`/api/destinations/${id}`, {
    method: "GET",
    requiresAuth: false
  });

/**
 * Create a new destination (with file upload)
 */
export const createDestination = (destinationData, pictureFile = null) => {
  // Ensure created_by is always a non-empty string
  const safeData = {
    ...destinationData,
    created_by: destinationData.created_by && destinationData.created_by.trim() ? destinationData.created_by : "admin"
  };
  if (pictureFile) {
    // Use FormData for file upload
    const formData = new FormData();
    formData.append("destination_country", safeData.destination_country);
    formData.append("destination_city", safeData.destination_city);
    formData.append("description", safeData.description || "");
    formData.append("created_by", safeData.created_by);
    if (pictureFile) {
      formData.append("picture", pictureFile);
    }
    
    return requestWithFormData("/api/destinations", formData, {
      method: "POST",
      requiresAuth: true
    });
  } else {
    // Regular JSON request
    return request("/api/destinations", {
      method: "POST",
      data: safeData,
      requiresAuth: true
    });
  }
};

/**
 * Update a destination (with optional file upload)
 */
export const updateDestination = (id, destinationData, pictureFile = null) => {
  // Ensure created_by is always a non-empty string
  const safeData = {
    ...destinationData,
    created_by: destinationData.created_by && destinationData.created_by.trim() ? destinationData.created_by : "admin"
  };
  if (pictureFile) {
    // Use FormData for file upload
    const formData = new FormData();
    if (safeData.destination_country) formData.append("destination_country", safeData.destination_country);
    if (safeData.destination_city) formData.append("destination_city", safeData.destination_city);
    if (safeData.description) formData.append("description", safeData.description);
    if (safeData.created_by) formData.append("created_by", safeData.created_by);
    if (pictureFile) {
      formData.append("picture", pictureFile);
    }
    
    return requestWithFormData(`/api/destinations/${id}`, formData, {
      method: "PUT",
      requiresAuth: true
    });
  } else {
    // Regular JSON request
    return request(`/api/destinations/${id}`, {
      method: "PUT",
      data: safeData,
      requiresAuth: true
    });
  }
};

/**
 * Delete a destination
 */
export const deleteDestination = (id) =>
  request(`/api/destinations/${id}`, {
    method: "DELETE",
    requiresAuth: true
  });