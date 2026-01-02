import { useState, useCallback, useEffect, useMemo } from "react";
import { 
  getAllGuidedTrips, 
  getGuidedTripById,
  getUmrahTrips, 
  getNormalGuidedTrips 
} from "../api/guidedTrips";

export function useGuidedTrips(filters = {}) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize filters to prevent infinite loops
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔵 [useGuidedTrips] Starting fetch... filters=', memoizedFilters);
      
      const res = await getAllGuidedTrips(memoizedFilters);
      
      console.log('🟢 [useGuidedTrips] Result:', res);
      console.log('🟢 [useGuidedTrips] Data:', res.data);
      
      // Handle different response formats
      if (res.data) {
        setTrips(Array.isArray(res.data) ? res.data : []);
      } else if (Array.isArray(res)) {
        setTrips(res);
      } else {
        setTrips([]);
      }
    } catch (err) {
      console.error('🔴 [useGuidedTrips] API Error:', err);
      setError(err.message || "Failed to fetch guided trips");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const fetchUmrahTrips = useCallback(async (limit = null) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUmrahTrips(limit);
      
      if (res.data) {
        setTrips(Array.isArray(res.data) ? res.data : []);
      } else if (Array.isArray(res)) {
        setTrips(res);
      } else {
        setTrips([]);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || "Failed to fetch Umrah trips");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNormalTrips = useCallback(async (limit = null) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getNormalGuidedTrips(limit);
      
      if (res.data) {
        setTrips(Array.isArray(res.data) ? res.data : []);
      } else if (Array.isArray(res)) {
        setTrips(res);
      } else {
        setTrips([]);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || "Failed to fetch guided trips");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    trips,
    loading,
    error,
    refetch: fetchTrips,
    fetchUmrahTrips,
    fetchNormalTrips
  };
}

/**
 * Hook to get a single guided trip by ID
 */
export function useGuidedTrip(id) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchTrip = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getGuidedTripById(id);
        setTrip(res.data || null);
      } catch (err) {
        setError(err.message || 'Failed to fetch guided trip');
        setTrip(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  return { trip, loading, error };
}