// hooks/useBranches.js
import { useState, useEffect } from 'react';
import { getActiveBranches } from '../api/branches';

export function useBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBranches = async (limit = null) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getActiveBranches(limit);
      setBranches(result.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const refetch = (limit = null) => {
    fetchBranches(limit);
  };

  return {
    branches,
    loading,
    error,
    refetch
  };
}