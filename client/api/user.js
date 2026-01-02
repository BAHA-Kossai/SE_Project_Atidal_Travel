import { request } from "./request.js";

/**
 * Get current user profile
 */
export const getUserProfile = () =>
  request("/api/user/me", {
    method: "GET",
    requiresAuth: true
  });

/**
 * Update user profile
 */
export const updateUserProfile = (data) =>
  request("/api/user/update-profile", {
    method: "PUT",
    data,
    requiresAuth: true
  });

/**
 * Delete logged-in user
 */
export const deleteUserProfile = () =>
  request("/api/user/delete-profile", {
    method: "DELETE",
    requiresAuth: true
  });

/**
 * Change user password
 */
export const changePassword = (currentPassword, newPassword) =>
  request("/api/user/change-password", {
    method: "PUT",
    data: { currentPassword, newPassword },
    requiresAuth: true
  });