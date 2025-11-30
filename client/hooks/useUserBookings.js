import { useState, useEffect } from 'react';
import { getUserBookings } from '../api/bookings';

export function useUserBookings(userId) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserBookings = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUserBookings(id);

      if (result.status === 'error') {
        throw new Error(result.message || 'Failed to fetch user bookings');
      }

      let bookingsData = [];
      
      if (result && result.status === 'success' && result.data) {
        if (Array.isArray(result.data)) {
          bookingsData = result.data;
        } else if (result.data.bookings && Array.isArray(result.data.bookings)) {
          bookingsData = result.data.bookings;
        } else if (result.data.results && Array.isArray(result.data.results)) {
          bookingsData = result.data.results;
        } else if (result.data.items && Array.isArray(result.data.items)) {
          bookingsData = result.data.items;
        } else if (result.data.records && Array.isArray(result.data.records)) {
          bookingsData = result.data.records;
        } else {
          bookingsData = [result.data]; 
        }
      }
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch user bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUserBookings(userId);
    } else {
      setLoading(false);
    }
  }, [userId]);

  const refetch = () => {
    if (userId) {
      fetchUserBookings(userId);
    }
  };

  return {
    bookings,
    loading,
    error,
    refetch
  };
}