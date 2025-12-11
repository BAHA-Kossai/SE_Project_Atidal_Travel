import { useState, useEffect } from 'react';
import { getUserBookings } from '../api/bookings';

export function useUserBookings(userId) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserBookings = async (id) => {
    console.log('🔄 Fetching bookings for user ID:', id);
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('📤 Calling getUserBookings API...');
      const result = await getUserBookings(id);
      console.log('📥 API response:', result);

      if (result.status === 'error') {
        throw new Error(result.message || 'Failed to fetch user bookings');
      }

      let bookingsData = [];
      
      if (result && result.data) {
        console.log('📊 Raw data received:', result.data);
        
        if (Array.isArray(result.data)) {
          bookingsData = result.data;
          console.log('✅ Data is direct array:', bookingsData.length, 'bookings');
        } else if (result.data.bookings && Array.isArray(result.data.bookings)) {
          bookingsData = result.data.bookings;
          console.log('✅ Data has bookings array:', bookingsData.length, 'bookings');
        } else if (result.data.results && Array.isArray(result.data.results)) {
          bookingsData = result.data.results;
        } else if (result.data.items && Array.isArray(result.data.items)) {
          bookingsData = result.data.items;
        } else if (result.data.records && Array.isArray(result.data.records)) {
          bookingsData = result.data.records;
        } else {
          console.log('⚠️ Unexpected data structure, trying to extract...');
          bookingsData = [result.data]; 
        }
      } else {
        console.log('⚠️ No data in response');
      }
      
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      console.log('✅ Final bookings data set:', bookings);
      
    } catch (err) {
      console.error('❌ Error fetching user bookings:', err);
      setError(err.message || 'Failed to fetch user bookings');
      setBookings([]);
    } finally {
      setLoading(false);
      console.log('🏁 Loading complete');
    }
  };

  useEffect(() => {
    if (userId) {
      console.log('🚀 useEffect triggered with userId:', userId);
      fetchUserBookings(userId);
    } else {
      console.log('⚠️ No userId provided');
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