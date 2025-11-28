import React, { useState } from 'react';
import { ChevronDown, MapPin, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import { DESTINATIONS } from '../data/constants.js';

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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (date) params.append('date', date);
    if (persons) params.append('persons', persons);
    navigate(`/booking?${params.toString()}`);
  };

  const handleShowMore = () => {
    setDisplayCount(displayCount + 6);
  };

  const visibleDestinations = DESTINATIONS.slice(0, displayCount);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {visibleDestinations.map((destination) => (
              <DestinationCard 
                key={destination.id}
                name={destination.title}
                location={destination.location}
                imageSrc={destination.image}
              />
            ))}
          </div>

          {/* Show More Link */}
          {displayCount < DESTINATIONS.length && (
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
        </div>
      </div>
    </Layout>
  );
};

export default DestinationsPage;
