import { request } from "./request.js";

// Fetch all admins
export const getAllAdmins = (accessToken) =>
  request("/api/user/admins", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // Create a new admin
export const createAdmin = (accessToken, adminData) =>
  request("/api/admin/add-admin", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`, // no need for Content-Type here; request adds it
    },
    data: adminData,
  });

  // Delete an admin by ID
export const deleteAdmin = (accessToken, adminId) =>
  request("/api/admin/delete", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: { id: adminId }, 
  });

  // Update an admin by ID
export const updateAdmin = (accessToken, adminId, updateData) =>
  request("/api/admin/update", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: { id: adminId, ...updateData },
  });

