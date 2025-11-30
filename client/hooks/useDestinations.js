import { useState, useEffect, useCallback } from "react";
import { getFeaturedDestinations, getAllDestinations } from "../api/destinations";

export function useDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState("");

  const fetchFeaturedDestinations = useCallback(async (limit = 3) => {
    try {
      setLoading(true);
      setError("");
      const res = await getFeaturedDestinations(limit);
      
      if (res && res.status === "success") {
        setDestinations(res.data);
      } else {
        console.error('Unexpected API response:', res);
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || "Failed to fetch destinations");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllDestinations();
      
      if (res && res.status === "success") {
        setDestinations(res.data);
      } else {
        console.error('Unexpected API response:', res);
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || "Failed to fetch destinations");
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
    refetch: fetchFeaturedDestinations 
  };
}