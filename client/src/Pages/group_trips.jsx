import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout.jsx';
import { Clock, Calendar, Home, Check, Users, MapPin } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useGuidedTrips } from '../../hooks/useGuidedTrips.js';
import Guided from '../assets/guided-trip.png';

function PackageCard({ packageData, onBookNow, fullWidth }) {
  // Map database fields to component props
  const tripInfo = packageData.TripInfo || {};
  
  const getDuration = () => {
    if (tripInfo.duration) return `${tripInfo.duration} days`;
    if (tripInfo.trip_date && tripInfo.returning_date) {
      const start = new Date(tripInfo.trip_date);
      const end = new Date(tripInfo.returning_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    }
    return 'Duration not specified';
  };

  const getDates = () => {
    if (tripInfo.trip_date && tripInfo.returning_date) {
      const startDate = new Date(tripInfo.trip_date).toLocaleDateString();
      const endDate = new Date(tripInfo.returning_date).toLocaleDateString();
      return `${startDate} to ${endDate}`;
    }
    return 'Dates not specified';
  };

  const getDepartureInfo = () => {
    if (tripInfo.departure_time) {
      return `Departure at ${tripInfo.departure_time}`;
    }
    return 'Departure information not specified';
  };

  const getDestination = () => {
    if (tripInfo.destination_country && tripInfo.destination_city) {
      return `${tripInfo.destination_city}, ${tripInfo.destination_country}`;
    }
    if (tripInfo.destination_country) {
      return tripInfo.destination_country;
    }
    if (tripInfo.destination_city) {
      return tripInfo.destination_city;
    }
    return 'Destination not specified';
  };

  const getHotelInfo = () => {
    if (tripInfo.no_hotel_needed) {
      return 'No hotel accommodation';
    }
    if (tripInfo.hotel_stars) {
      return `${tripInfo.hotel_stars} star hotel`;
    }
    return 'Hotel accommodation included';
  };

  const getPrice = () => {
    if (tripInfo.price) {
      return `${tripInfo.price} DA`;
    }
    return 'Contact for price';
  };

  const getAvailableSeats = () => {
    if (packageData.available_seats !== undefined && packageData.available_seats !== null) {
      return `${packageData.available_seats} seats available`;
    }
    return null;
  };

  const getIncludes = () => {
    const includes = [];
    
    // From TripInfo table
    if (!tripInfo.no_hotel_needed) includes.push('Hotel accommodation');
    if (tripInfo.destination_country) includes.push(`Travel to ${tripInfo.destination_country}`);
    
    // From Guided_trips table
    if (packageData.needs_visa_assistance) includes.push('Visa assistance');
    if (packageData.trip_agenda) includes.push('Guided itinerary');
    if (packageData.description) includes.push('Professional guide');
    
    // Group trip specific items
    includes.push('Group activities', 'Social experience');
    
    // Add transportation if times are specified
    if (tripInfo.departure_time) {
      includes.push('Transportation');
    }
    
    return includes.length > 0 ? includes : ['Complete group travel experience'];
  };

  const getTripType = () => {
    return 'Guided Group Trip';
  };

  return (
    <div
      className={`bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-full 
      transition-transform duration-300 hover:scale-105 ${
        fullWidth ? "lg:flex-row" : ""
      }`}
    >
      {/* Content */}
      <div className="flex flex-col flex-1 p-8 gap-6">
        {/* Package Header */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{getTripType()}</h3>
          <p className="text-gray-600 text-sm mb-4">{getDestination()}</p>
          {packageData.description && (
            <p className="text-gray-500 text-xs mb-4">{packageData.description}</p>
          )}
        </div>

        {/* Trip Details */}
        <div className="space-y-3">
          {/* Duration */}
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="w-5 h-5 text-[#117BB8] flex-shrink-0" />
            <p className="text-sm">{getDuration()}</p>
          </div>
          
          {/* Dates */}
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="w-5 h-5 text-[#117BB8] flex-shrink-0" />
            <p className="text-sm">{getDates()}</p>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="w-5 h-5 text-[#117BB8] flex-shrink-0" />
            <p className="text-sm">{getDestination()}</p>
          </div>
          
          {/* Departure */}
          <div className="flex items-center gap-3 text-gray-600">
            <Home className="w-5 h-5 text-[#117BB8] flex-shrink-0" />
            <p className="text-sm">{getDepartureInfo()}</p>
          </div>

          {/* Hotel */}
          <div className="flex items-center gap-3 text-gray-600 ml-8">
            <p className="text-xs text-gray-500">{getHotelInfo()}</p>
          </div>

          {/* Available Seats */}
          {getAvailableSeats() && (
            <div className="flex items-center gap-3 text-gray-600">
              <Users className="w-5 h-5 text-[#117BB8] flex-shrink-0" />
              <p className="text-sm">{getAvailableSeats()}</p>
            </div>
          )}
        </div>

        {/* Includes */}
        <div className="flex-1">
          <h4 className="text-gray-800 font-semibold mb-4">Package includes:</h4>
          <div className="space-y-2">
            {getIncludes().map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#117BB8] flex-shrink-0 mt-0.5" />
                <p className="text-gray-600 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trip Agenda (if available) */}
        {packageData.trip_agenda && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-gray-800 font-semibold mb-2">Trip Highlights:</h4>
            <p className="text-gray-600 text-sm">{packageData.trip_agenda}</p>
          </div>
        )}

        {/* Footer with Price and Button */}
        <div className="border-t border-gray-200 pt-6 mt-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[#117BB8] font-bold text-xl">{getPrice()}</p>
              {packageData.available_seats !== undefined && packageData.available_seats < 10 && (
                <p className="text-orange-500 text-xs mt-1">Limited spots available!</p>
              )}
            </div>
            <button 
              onClick={() => onBookNow(packageData)}
              className="bg-[#117BB8] hover:bg-[#0f6da4] text-white px-8 py-3 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg font-semibold"
            >
              Book now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GroupTrip() {
  const navigate = useNavigate();
  const { trips, loading, error, fetchGuidedTrips } = useGuidedTrips();

  // Fetch guided trips when component mounts
  useEffect(() => {
    console.log('🔄 Fetching guided trips...');
    fetchGuidedTrips();
  }, [fetchGuidedTrips]);

  const handleBookNow = (packageData) => {
    navigate('/bookings', {
      state: {
        packageData,
        isGroupTrip: true
      }
    });
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        {/* Hero Section Loading */}
        <div className="relative h-[600px] sm:h-[700px] overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-8">
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        </div>

        {/* Packages Section Loading */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 justify-center">
            {[1, 2, 3].map((item) => (
              <div key={item} className="lg:col-span-2 animate-pulse">
                <div className="bg-gray-200 rounded-3xl h-96"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        {/* Hero Section */}
        <div className="relative h-[600px] sm:h-[700px] overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-8">
          <div className="absolute inset-0">
            <img 
              src={Guided}
              alt="Group travel" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
          </div>

          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl mb-4 text-white font-bold">
                  Group Trips
                </h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                  <p className="text-red-700 font-medium">Error loading group trips</p>
                  <p className="text-red-600 text-sm mt-2">{error}</p>
                  <button 
                    onClick={fetchGuidedTrips}
                    className="mt-4 bg-[#117BB8] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0f6da4] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[600px] sm:h-[700px] overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-8">
        <div className="absolute inset-0">
          <img 
            src={Guided}
            alt="Group travel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <p className="text-sm sm:text-base mb-4 text-white/90">
                Enjoy your travel journey
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl mb-4 text-white font-bold">
                Group Trips
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl mb-8 text-white/95">
                Enjoy traveling with a group!
              </p>
              <button className="bg-[#117BB8] hover:bg-[#0f6da4] text-white px-10 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Explore our packages
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {trips.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No group trips available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 justify-center">
            {trips.map((trip, index) => {
              const isOdd = trips.length % 2 !== 0;
              const isLast = index === trips.length - 1;

              return (
                <div
                  key={trip.trip_id || index}
                  className={`
                    ${isOdd && isLast 
                      ? "lg:col-span-3 mx-auto w-full" 
                      : "lg:col-span-2"
                    }
                  `}
                >
                  <PackageCard
                    packageData={trip}
                    onBookNow={handleBookNow}
                    fullWidth={isOdd && isLast}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}