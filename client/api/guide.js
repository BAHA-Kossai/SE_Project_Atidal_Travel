import { request } from "./request.js";

/**
 * Get all guides (public)
 */
export const getAllGuides = () =>
  request("/api/guide/", {
    method: "GET",
    requiresAuth: false
  });

/**
 * Get a single guide by ID (public)
 */
export const getGuideById = (guideId) =>
  request(`/api/guide/${guideId}`, {
    method: "GET",
    requiresAuth: false
  });

/**
 * Create a new guide (requires Admin/SuperAdmin)
 */
export const createGuide = (guideData) =>
  request("/api/guide", {
    method: "POST",
    data: guideData,
    requiresAuth: true
  });

/**
 * Update an existing guide by ID (requires Admin/SuperAdmin)
 */
export const updateGuide = (guideId, updateData) =>
  request(`/api/guide/${guideId}`, {
    method: "PUT",
    data: updateData,
    requiresAuth: true
  });

/**
 * Delete a guide by ID (requires Admin/SuperAdmin)
 */
export const deleteGuide = (guideId) =>
  request(`/api/guide/${guideId}`, {
    method: "DELETE",
    requiresAuth: true
  });
