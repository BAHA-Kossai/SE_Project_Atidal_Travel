import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import { useDestinations } from '../../hooks/useDestinations.js'; // Import your hook

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

const DestinationsPage = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [persons, setPersons] = useState('');
  const [displayCount, setDisplayCount] = useState(6);
  
  // Use the destinations hook
  const { destinations, loading, error, fetchAllDestinations } = useDestinations();

  // Fetch all destinations when component mounts
  useEffect(() => {
    fetchAllDestinations();
  }, [fetchAllDestinations]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (date) params.append('date', date);
    if (persons) params.append('persons', persons);
    navigate(`/bookings?${params.toString()}`);
  };

  const handleShowMore = () => {
    setDisplayCount(displayCount + 6);
  };

  // Use fetched destinations instead of static data
  const visibleDestinations = destinations.slice(0, displayCount);

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="w-full">
          {/* Search Bar Section */}
          <div className="bg-[#BFE7FF] px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                {/* Loading placeholders for search inputs */}
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex-1 flex items-center gap-3 bg-white rounded-lg px-4 py-3 lg:py-4">
                    <div className="animate-pulse flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
                <div className="animate-pulse bg-gray-200 px-8 py-3 lg:py-4 rounded-lg w-32"></div>
              </div>
            </div>
          </div>

          {/* Main Content Loading */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-48 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="w-full">
          {/* Search Bar Section */}
          <div className="bg-[#BFE7FF] px-4 sm:px-6 lg:px-8 py-6">
            {/* ... same search bar as original ... */}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
                Explore our popular destinations
              </h1>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-700 font-medium">Error loading destinations</p>
                <p className="text-red-600 text-sm mt-2">{error}</p>
                <button 
                  onClick={fetchAllDestinations}
                  className="mt-4 bg-[#117BB8] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0f6da4] transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full">
        {/* Search Bar Section */}
        <div className="bg-[#BFE7FF] px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
              {/* Destination Dropdown */}
              <div className="flex-1 flex items-center gap-3 bg-white rounded-lg px-4 py-3 lg:py-4">
                <div className="flex items-center gap-2 text-gray-600 flex-1">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2C6.67 2 4 4.67 4 8C4 12.5 10 18 10 18S16 12.5 16 8C16 4.67 13.33 2 10 2ZM10 11C8.9 11 8 10.1 8 9C8 7.9 8.9 7 10 7C11.1 7 12 7.9 12 9C12 10.1 11.1 11 10 11Z" fill="#93999F"/>
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Destination" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none font-medium text-sm"
                  />
                </div>
                <ChevronDown size={20} className="text-gray-400" />
              </div>

              {/* Date Dropdown */}
              <div className="flex-1 flex items-center gap-3 bg-white rounded-lg px-4 py-3 lg:py-4">
                <div className="flex items-center gap-2 text-gray-600 flex-1">
                  <Calendar size={20} className="text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none font-medium text-sm"
                  />
                </div>
                <ChevronDown size={20} className="text-gray-400" />
              </div>

              {/* Persons Dropdown */}
              <div className="flex-1 flex items-center gap-3 bg-white rounded-lg px-4 py-3 lg:py-4">
                <div className="flex items-center gap-2 text-gray-600 flex-1">
                  <Users size={20} className="text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Persons" 
                    value={persons}
                    onChange={(e) => setPersons(e.target.value)}
                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none font-medium text-sm"
                  />
                </div>
                <ChevronDown size={20} className="text-gray-400" />
              </div>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="bg-[#117BB8] text-white px-8 py-3 lg:py-4 rounded-lg font-medium hover:bg-[#0f6da4] transition-colors whitespace-nowrap text-sm lg:text-base"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-12">
            Explore our popular destinations
          </h1>

          {/* Destination Cards Grid */}
          {destinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No destinations available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {visibleDestinations.map((destinationItem, index) => (
                  <DestinationCard 
                    key={destinationItem.destination_id || index}
                    name={destinationItem.destination_city}
                    location={destinationItem.destination_country}
                    imageSrc={destinationItem.destination_pic || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format&ix=${index}`}
                  />
                ))}
              </div>

              {/* Show More Link */}
              {displayCount < destinations.length && (
                <div className="flex justify-end">
                  <button 
                    onClick={handleShowMore}
                    className="flex items-center gap-3 text-[#117BB8] hover:text-[#0f6da4] transition-colors font-medium"
                  >
                    Show more
                    <ChevronDown size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DestinationsPage;