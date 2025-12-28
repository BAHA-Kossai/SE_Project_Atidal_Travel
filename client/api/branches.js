import { request } from "./request";

/**
 * Get all active branches
 */
export const getActiveBranches = (limit = null) => {
  const params = limit ? `?limit=${limit}` : '';
  return request(`/api/branches/active${params}`, {
    method: "GET",
    requiresAuth: false
  });
};

/**
 * Get all branches with optional filters
 */
export const getAllBranches = ({ city, active, limit = 10, offset = 0 } = {}) => {
  const params = new URLSearchParams();
  if (city) params.append("city", city);
  if (active !== undefined) params.append("active", active);
  params.append("limit", limit);
  params.append("offset", offset);
  
  return request(`/api/branches?${params.toString()}`, {
    method: "GET",
    requiresAuth: false
  });
};

/**
 * Get branch by ID
 */
export const getBranchById = (id) =>
  request(`/api/branches/${id}`, { 
    method: "GET",
    requiresAuth: false
  });

/**
 * Create a new branch (requires SuperAdmin)
 */
export const createBranch = (branchData) =>
  request("/api/branches", {
    method: "POST",
    data: branchData,
    requiresAuth: true
  });

/**
 * Update an existing branch (requires SuperAdmin)
 */
export const updateBranch = (id, branchData) =>
  request(`/api/branches/${id}`, {
    method: "PUT",
    data: branchData,
    requiresAuth: true
  });

/**
 * Delete a branch (requires SuperAdmin)
 */
export const deleteBranch = (id) =>
  request(`/api/branches/${id}`, {
    method: "DELETE",
    requiresAuth: true
  });