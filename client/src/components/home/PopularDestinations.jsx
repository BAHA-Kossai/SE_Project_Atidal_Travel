import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useDestinations } from '../../../hooks/useDestinations'; 

// --- DestinationCard Component ---
const DestinationCard = ({ name, location, imageSrc }) => {
  return (
    <div className="flex-1 min-w-[280px] max-w-[340px] mx-2">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={name} 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PopularDestinations Component ---
const PopularDestinations = () => {
  const { destinations, loading, error, fetchFeaturedDestinations } = useDestinations();
  
  // Fetch featured destinations when component mounts
  useEffect(() => {
    fetchFeaturedDestinations(3);
  }, [fetchFeaturedDestinations]);

  // Debug logging
  useEffect(() => {
    console.log('Current API_BASE:', import.meta.env.VITE_API_BASE);
    console.log('Full URL would be:', `${import.meta.env.VITE_API_BASE}/api/destinations/featured?limit=3`);
    console.log('Destinations data:', destinations);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
  }, [destinations, loading, error]);

  if (loading) {
    return (
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Popular Destinations</h2>
          <p className="text-gray-500 mb-8">Explore the world with us</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex-1 min-w-[280px] max-w-[340px] mx-2">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Popular Destinations</h2>
          <p className="text-gray-500 mb-8">Explore the world with us</p>
          <div className="flex justify-center">
            <div className="text-red-500 bg-red-50 p-4 rounded-lg">
              Error loading destinations: {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Popular Destinations</h2>
        <p className="text-gray-500 mb-8">Explore the world with us</p>
        <div className="flex flex-wrap justify-center gap-4">
          {destinations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No destinations available</p>
            </div>
          ) : (
            destinations.map((destination, index) => (
              <DestinationCard 
                key={destination.destination_id || index}
                name={destination.destination_city}
                location={destination.destination_country}
                imageSrc={destination.destination_pic}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;