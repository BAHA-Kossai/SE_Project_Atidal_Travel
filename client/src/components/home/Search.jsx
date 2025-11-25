import React, { useState } from 'react';
import { Plane, Search, ChevronDown } from 'lucide-react';

const TravelHeroSection = () => {
  const [destination, setDestination] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearch = () => {
    console.log('Searching for:', destination);
    // Handle search logic here
  };

  const destinations = [
    'Paris, France',
    'Tokyo, Japan',
    'New York, USA',
    'Dubai, UAE',
    'London, UK',
    'Barcelona, Spain'
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sky background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&h=1080&fit=crop')",
        }}
      />
      
      {/* Blue gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-blue-600/30 to-blue-400/20" />

      {/* Airplane wing image - positioned on the right */}
      <div className="absolute right-0 top-0 bottom-0 w-3/5 overflow-hidden opacity-90">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=800&fit=crop"
          alt="Airplane wing"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        {/* Progress indicators */}
        <div className="flex flex-col items-start mb-12 space-y-0">
          {/* Step 1 */}
          <div className="flex items-center space-x-4 relative">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-900 font-bold text-lg shadow-lg z-10">
              1
            </div>
            <span className="text-white text-sm font-medium drop-shadow-lg">Enjoy your travel journey</span>
          </div>
          
          {/* Connecting line 1 */}
          <div className="ml-6 w-0.5 h-12 bg-white/40" />
          
          {/* Step 2 */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full border-2 border-white/60 flex items-center justify-center text-white font-bold text-lg z-10">
              2
            </div>
          </div>
          
          {/* Connecting line 2 */}
          <div className="ml-6 w-0.5 h-12 bg-white/40" />
          
          {/* Step 3 */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full border-2 border-white/60 flex items-center justify-center text-white font-bold text-lg z-10">
              3
            </div>
          </div>
        </div>

        {/* Hero text */}
        <div className="max-w-4xl mb-16">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-tight mb-8 drop-shadow-2xl">
            Get the
            <br />
            best sejour
          </h1>
          
          <button className="bg-[#117BB8] hover:bg-[#0d5a8a] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
            Book A Trip Now
          </button>
        </div>

        {/* Search bar with orange border */}
        <div className="max-w-4xl">
          <div className="p-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <div className="flex items-center px-6 py-4 border-r border-gray-200">
                    <Plane className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        onFocus={() => setIsDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                        className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                      />
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                          {destinations.map((dest, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setDestination(dest);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors"
                            >
                              {dest}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-400 ml-2" />
                  </div>
                </div>
                
                <button
                  onClick={handleSearch}
                  className="bg-[#117BB8] hover:bg-[#0d5a8a] text-white px-10 py-5 transition-colors duration-300 flex items-center justify-center space-x-2 rounded-r-xl"
                >
                  <span className="font-semibold">Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelHeroSection;