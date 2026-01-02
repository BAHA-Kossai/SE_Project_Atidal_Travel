import { useState, useCallback } from "react";
import { createRating, getApprovedRatings } from "../api/rating";

export function useRating() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submitRating = useCallback(async (ratingData) => {
    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const ratingWithTimestamp = {
        ...ratingData,
        created_at: new Date().toISOString(),
      };

      const result = await createRating(ratingWithTimestamp);
      
      if (result.status === "success") {
        setSuccess(true);
        return result;
      } else {
        throw new Error(result.message || 'Failed to submit rating');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit rating');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApprovedRatings = useCallback(async (options = {}) => {
    try {
      setLoading(true);
      setError("");

      const result = await getApprovedRatings(options);
      
      if (result.status === "success") {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch ratings');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch ratings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError("");
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    success,
    submitRating,
    fetchApprovedRatings,
    clearError,
  };
}