import { useState, useCallback } from "react";
import { getUmrahTrips, getGuidedTrips } from "../api/guidedTrips";

export function useGuidedTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUmrahTrips = useCallback(async (limit = null) => {
    try {
      setLoading(true);
      setError("");
      const res = await getUmrahTrips(limit);
      
      if (res && res.status === "success") {
        setTrips(res.data);
      } else {
        console.error('Unexpected API response:', res);
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || "Failed to fetch Umrah trips");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGuidedTrips = useCallback(async (limit = null) => {
    try {
      setLoading(true);
      setError("");
      const res = await getGuidedTrips(limit);
      
      if (res && res.status === "success") {
        setTrips(res.data);
      } else {
        console.error('Unexpected API response:', res);
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || "Failed to fetch guided trips");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    trips,
    loading,
    error,
    fetchUmrahTrips,
    fetchGuidedTrips
  };
}