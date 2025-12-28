import { request } from "./request.js";

/**
 * Get all admins (requires SuperAdmin)
 */
export const getAllAdmins = () =>
  request("/api/user/admins", {
    method: "GET",
    requiresAuth: true
  });

/**
 * Create a new admin (requires SuperAdmin)
 */
export const createAdmin = (adminData) =>
  request("/api/admin/add-admin", {
    method: "POST",
    data: adminData,
    requiresAuth: true
  });

/**
 * Delete an admin by ID (requires SuperAdmin)
 */
export const deleteAdmin = (adminId) =>
  request("/api/admin/delete", {
    method: "DELETE",
    data: { id: adminId },
    requiresAuth: true
  });

/**
 * Update an admin by ID (requires SuperAdmin)
 */
export const updateAdmin = (adminId, updateData) =>
  request("/api/admin/update", {
    method: "PUT",
    data: { id: adminId, ...updateData },
    requiresAuth: true
  });

