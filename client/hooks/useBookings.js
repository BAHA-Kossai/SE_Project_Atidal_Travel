import { useState, useCallback, useEffect, useMemo } from "react";
import { 
  createBooking, 
  getAllBookings,
  getUserBookings,
  assignBranchToBooking,
  updateBookingStatus
} from "../api/bookings";

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

  const assignBranch = useCallback(async (bookingId, branchId) => {
    try {
      setLoading(true);
      setError("");
      const result = await assignBranchToBooking(bookingId, branchId);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to assign branch');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (bookingId, status) => {
    try {
      setLoading(true);
      setError("");
      const result = await updateBookingStatus(bookingId, status);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update booking status');
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
    assignBranch,
    updateStatus,
    clearError
  };
}

/**
 * Hook to fetch user bookings
 */
export function useUserBookings(userId) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getUserBookings(userId);
      setBookings(result.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings
  };
}

/**
 * Hook to fetch all bookings (for admin)
 */
export function useAllBookings(filters = {}) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize filters to prevent infinite loops
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔵 [useAllBookings] Starting fetch... filters=', memoizedFilters);
      
      const result = await getAllBookings(memoizedFilters);
      console.log('🟢 [useAllBookings] Result:', result);
      console.log('🟢 [useAllBookings] Data array:', result.data);
      console.log('🟢 [useAllBookings] Is array?', Array.isArray(result.data));
      
      setBookings(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error('🔴 [useAllBookings] ERROR:', err);
      setError(err.message || 'Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings
  };
}