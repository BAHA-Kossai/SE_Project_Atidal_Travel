import { useState, useCallback, useEffect, useMemo } from "react";
import { 
  getAllTravelers,
  getTravelerById,
  createTraveler,
  updateTraveler,
  deleteTraveler,
  getTravelersByBookingId
} from "../api/travelers";

/**
 * Hook to fetch all travelers (for admin)
 */
export function useTravelers(filters = {}) {
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize filters to prevent infinite loops
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  const fetchTravelers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔵 [useTravelers] Starting fetch... filters=', memoizedFilters);
      
      const result = await getAllTravelers(memoizedFilters);
      console.log('🟢 [useTravelers] Result:', result);
      console.log('🟢 [useTravelers] Data array:', result.data);
      
      setTravelers(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error('🔴 [useTravelers] ERROR:', err);
      setError(err.message || 'Failed to fetch travelers');
      setTravelers([]);
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

  useEffect(() => {
    fetchTravelers();
  }, [fetchTravelers]);

  const create = useCallback(async (travelerData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createTraveler(travelerData);
      await fetchTravelers();
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to create traveler';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTravelers]);

  const update = useCallback(async (travelerId, travelerData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateTraveler(travelerId, travelerData);
      await fetchTravelers();
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to update traveler';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTravelers]);

  const remove = useCallback(async (travelerId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await deleteTraveler(travelerId);
      await fetchTravelers();
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete traveler';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTravelers]);

  return {
    travelers,
    loading,
    error,
    refetch: fetchTravelers,
    create,
    update,
    remove
  };
}

/**
 * Hook to fetch travelers by booking ID
 */
export function useTravelersByBookingId(bookingId) {
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTravelers = useCallback(async () => {
    if (!bookingId) {
      setTravelers([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getTravelersByBookingId(bookingId);
      setTravelers(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch travelers');
      setTravelers([]);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchTravelers();
  }, [fetchTravelers]);

  return {
    travelers,
    loading,
    error,
    refetch: fetchTravelers
  };
}
