import { useState, useCallback } from "react";
import { 
  getFeaturedDestinations, 
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  searchDestinations
} from "../api/destinations";

export function useDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");

  const fetchFeaturedDestinations = useCallback(async (limit = 3) => {
    try {
      setLoading(true);
      setError("");
      const res = await getFeaturedDestinations(limit);
      
      // Handle different response formats
      if (res.data) {
        setDestinations(Array.isArray(res.data) ? res.data : []);
      } else if (Array.isArray(res)) {
        setDestinations(res);
      } else {
        setDestinations([]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch destinations");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log('🔵 [useDestinations] Starting fetch all destinations...');
      
      const res = await getAllDestinations();
      
      console.log('🟢 [useDestinations] Result:', res);
      console.log('🟢 [useDestinations] Data:', res.data);
      
      if (res.data) {
        setDestinations(Array.isArray(res.data) ? res.data : []);
      } else if (Array.isArray(res)) {
        setDestinations(res);
      } else {
        setDestinations([]);
      }
    } catch (err) {
      console.error('🔴 [useDestinations] ERROR:', err);
      setError(err.message || "Failed to fetch destinations");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (destinationData, pictureFile = null) => {
    try {
      setLoading(true);
      setError("");
      const res = await createDestination(destinationData, pictureFile);
      await fetchAllDestinations(); // Refresh list
      return res;
    } catch (err) {
      setError(err.message || "Failed to create destination");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllDestinations]);

  const update = useCallback(async (id, destinationData, pictureFile = null) => {
    try {
      setLoading(true);
      setError("");
      const res = await updateDestination(id, destinationData, pictureFile);
      await fetchAllDestinations(); // Refresh list
      return res;
    } catch (err) {
      setError(err.message || "Failed to update destination");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllDestinations]);

  const remove = useCallback(async (id) => {
    try {
      setLoading(true);
      setError("");
      const res = await deleteDestination(id);
      await fetchAllDestinations(); // Refresh list
      return res;
    } catch (err) {
      setError(err.message || "Failed to delete destination");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllDestinations]);

  const search = useCallback(async (query) => {
    try {
      setLoading(true);
      setError("");
      const res = await searchDestinations(query);
      
      if (res.data) {
        setDestinations(Array.isArray(res.data) ? res.data : []);
      } else if (Array.isArray(res)) {
        setDestinations(res);
      } else {
        setDestinations([]);
      }
      return res;
    } catch (err) {
      setError(err.message || "Failed to search destinations");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    destinations,
    loading,
    error,
    fetchFeaturedDestinations,
    fetchAllDestinations,
    create,
    update,
    remove,
    search,
    refetch: fetchAllDestinations 
  };
}