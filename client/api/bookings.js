import { request } from "./request";

export const createBooking = async (bookingData) => { 
  try {
    const result = await request("/api/bookings/create", {
      method: "POST",
      data: bookingData, 
    });

    if (result.status >= 400) {
      throw new Error(result.message || `HTTP error! status: ${result.status}`);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const getBookings = () =>
  request("/api/bookings", { method: "GET" });

export const getUserBookings = (userId) => {
  return request(`/api/bookings/user/${userId}`, {
    method: "GET"
  });
};

export const updateBookingStatus = (id, status) =>
  request(`/api/bookings/${id}/status`, {
    method: "PATCH",
    data: { status },
  });