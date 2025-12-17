import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import SearchBar from '../components/layout/Search.jsx';
import { useDestinations } from '../../hooks/useDestinations.js';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(6);

  const { destinations, loading, error, fetchAllDestinations } =
    useDestinations();

  useEffect(() => {
    fetchAllDestinations();
  }, [fetchAllDestinations]);

  /* 🔍 SAME SEARCH LOGIC AS BRANCHES */
  const filteredDestinations = destinations.filter((dest) =>
    dest.destination_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.destination_country
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const visibleDestinations = filteredDestinations.slice(0, displayCount);

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  /* ⏳ Loading */
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-[#117BB8]"></div>
        </div>
      </Layout>
    );
  }

  /* ❌ Error */
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <p className="text-red-600 text-xl mb-4">
            Error loading destinations
          </p>
          <button
            onClick={fetchAllDestinations}
            className="bg-[#117BB8] text-white px-6 py-2 rounded-lg hover:bg-[#0f6da4]"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full">
        {/* 🔍 Search Bar (same behavior as Branches) */}
        <SearchBar
          placeholder="Search by city or country..."
          value={searchQuery}
          searchQuery={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          onSearch={() => {}}
          variant="styled"
          icon={MapPin}
        />

  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
                Explore our popular destinations
              </h1>
              
        {/* Results count */}
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <p className="text-gray-600">
            {filteredDestinations.length}{' '}
            {filteredDestinations.length === 1
              ? 'destination'
              : 'destinations'}{' '}
            found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 pb-16">

          
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-16">
               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
                Explore our popular destinations
              </h1>
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No destinations found
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'No destinations available at the moment'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {visibleDestinations.map((dest, index) => (
                  <DestinationCard
                    key={dest.destination_id || index}
                    name={dest.destination_city}
                    location={dest.destination_country}
                    imageSrc={
                      dest.destination_pic ||
                      `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format&ix=${index}`
                    }
                  />
                ))}
              </div>

              {displayCount < filteredDestinations.length && (
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
