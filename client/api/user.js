import { request } from "./request.js";


// Update user profile
export const updateUserProfile = (accessToken, data) =>
  request("/api/user/update-profile", {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
    data,
  });

// Delete logged-in user
export const deleteUserProfile = (accessToken) =>
  request("/api/user/delete-profile", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });