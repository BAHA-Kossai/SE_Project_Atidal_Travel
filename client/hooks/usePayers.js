import { useState, useCallback, useEffect, useMemo } from "react";
import { 
  getAllPayers,
  getPayerById,
  createPayer,
  updatePayer,
  deletePayer,
  getPayersByBookingId
} from "../api/payers";

/**
 * Hook to fetch all payers (for admin)
 */
export function usePayers(filters = {}) {
  const [payers, setPayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize filters to prevent infinite loops
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  const fetchPayers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔵 [usePayers] Starting fetch... filters=', memoizedFilters);
      
      const result = await getAllPayers(memoizedFilters);
      console.log('🟢 [usePayers] Result:', result);
      console.log('🟢 [usePayers] Data array:', result.data);
      
      setPayers(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error('🔴 [usePayers] ERROR:', err);
      setError(err.message || 'Failed to fetch payers');
      setPayers([]);
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

  useEffect(() => {
    fetchPayers();
  }, [fetchPayers]);

  const create = useCallback(async (payerData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createPayer(payerData);
      await fetchPayers();
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to create payer';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPayers]);

  const update = useCallback(async (payerId, payerData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updatePayer(payerId, payerData);
      await fetchPayers();
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to update payer';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPayers]);

  const remove = useCallback(async (payerId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await deletePayer(payerId);
      await fetchPayers();
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete payer';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPayers]);

  return {
    payers,
    loading,
    error,
    refetch: fetchPayers,
    create,
    update,
    remove
  };
}

/**
 * Hook to fetch payers by booking ID
 */
export function usePayersByBookingId(bookingId) {
  const [payers, setPayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayers = useCallback(async () => {
    if (!bookingId) {
      setPayers([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getPayersByBookingId(bookingId);
      setPayers(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch payers');
      setPayers([]);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchPayers();
  }, [fetchPayers]);

  return {
    payers,
    loading,
    error,
    refetch: fetchPayers
  };
}
