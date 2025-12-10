import { request } from "./request.js";

// Fetch all guides (public)
export const getAllGuides = () =>
  request("/api/guide/", {
    method: "GET",
  });

// Fetch a single guide by ID (public)
export const getGuideById = (guideId) =>
  request(`/api/guide/${guideId}`, {
    method: "GET",
  });

// Create a new guide (requires token)
export const createGuide = (accessToken, guideData) =>
  request("/api/guide", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    data: guideData,
  });

// Update an existing guide by ID (requires token)
export const updateGuide = (accessToken, guideId, updateData) =>
  request(`/api/guide/${guideId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
    data: updateData,
  });

// Delete a guide by ID (requires token)
export const deleteGuide = (accessToken, guideId) =>
  request(`/api/guide/${guideId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
