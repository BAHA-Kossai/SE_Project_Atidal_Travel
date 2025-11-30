import { useState, useCallback } from "react";
import { createBooking } from "../api/bookings";

export function useBookings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitBooking = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      setError("");

      console.log('Submitting booking data:', bookingData);

      // Send the data exactly as structured in the form
      const result = await createBooking(bookingData);
      console.log('Booking creation result:', result);
      return result;
    } catch (err) {
      console.error('Booking submission error:', err);
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