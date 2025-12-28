import { request } from "./request";

/**
 * Create a new booking
 */
export const createBooking = (bookingData) => 
  request("/api/bookings/create", {
    method: "POST",
    data: bookingData,
    requiresAuth: false
  });

/**
 * Get all bookings (requires Admin/SuperAdmin)
 */
export const getAllBookings = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.user_id) params.append("user_id", filters.user_id);
  if (filters.status) params.append("status", filters.status);
  if (filters.branch_id) params.append("branch_id", filters.branch_id);
  if (filters.date_from) params.append("date_from", filters.date_from);
  if (filters.date_to) params.append("date_to", filters.date_to);
  if (filters.limit) params.append("limit", filters.limit);
  if (filters.offset) params.append("offset", filters.offset);
  
  const queryString = params.toString();
  return request(`/api/bookings${queryString ? `?${queryString}` : ''}`, {
    method: "GET",
    requiresAuth: true
  });
};

/**
 * Get bookings for a specific user
 */
export const getUserBookings = (userId) =>
  request(`/api/bookings/user/${userId}`, {
    method: "GET",
    requiresAuth: true
  });

/**
 * Assign a branch to a booking (requires SuperAdmin)
 */
export const assignBranchToBooking = (bookingId, branchId) =>
  request("/api/bookings/assign-branch", {
    method: "PATCH",
    data: { booking_id: bookingId, branch_id: branchId },
    requiresAuth: true
  });

/**
 * Update booking status (requires Admin or SuperAdmin)
 */
export const updateBookingStatus = (bookingId, status) =>
  request("/api/bookings/update-status", {
    method: "PATCH",
    data: { booking_id: bookingId, booking_status: status },
    requiresAuth: true
  });