import { useState, useCallback } from "react";
import { createBooking } from "../api/bookings";

export function useBookings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitBooking = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      setError("");

      const result = await createBooking(bookingData);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(""), []);

  return {
    loading,
    error,
    submitBooking,
    clearError
  };
}