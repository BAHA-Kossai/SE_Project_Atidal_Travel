// hooks/useBranches.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getActiveBranches, 
  getAllBranches, 
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch
} from '../api/branches';

export function useBranches(options = {}) {
  const { activeOnly = false, filters = {} } = options;
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize filters to prevent infinite loops
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔵 [useBranches] Starting fetch... activeOnly=', activeOnly, 'filters=', memoizedFilters);
      
      let result;
      if (activeOnly) {
        result = await getActiveBranches(memoizedFilters.limit);
        console.log('🟢 [useBranches] Active result:', result);
        setBranches(result.data || []);
      } else {
        result = await getAllBranches(memoizedFilters);
        console.log('🟢 [useBranches] All result:', result);
        console.log('🟢 [useBranches] Data array:', result.data);
        console.log('🟢 [useBranches] Is array?', Array.isArray(result.data));
        setBranches(result.data || []);
      }
    } catch (err) {
      console.error('🔴 [useBranches] ERROR:', err);
      setError(err.message || 'Failed to fetch branches');
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, [activeOnly, memoizedFilters]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const refetch = useCallback(() => {
    fetchBranches();
  }, [fetchBranches]);

  const create = useCallback(async (branchData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createBranch(branchData);
      await refetch(); // Refresh the list
      return result;
    } catch (err) {
      setError(err.message || 'Failed to create branch');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refetch]);

  const update = useCallback(async (id, branchData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateBranch(id, branchData);
      await refetch(); // Refresh the list
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update branch');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refetch]);

  const remove = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await deleteBranch(id);
      await refetch(); // Refresh the list
      return result;
    } catch (err) {
      setError(err.message || 'Failed to delete branch');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refetch]);

  return {
    branches,
    loading,
    error,
    refetch,
    create,
    update,
    remove
  };
}

/**
 * Hook to get a single branch by ID
 */
export function useBranch(id) {
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchBranch = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getBranchById(id);
        setBranch(result.data || null);
      } catch (err) {
        setError(err.message || 'Failed to fetch branch');
        setBranch(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [id]);

  return { branch, loading, error };
}