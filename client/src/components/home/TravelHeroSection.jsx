import React, { useState } from 'react';
import { Plane, ChevronDown } from 'lucide-react';
import DefaultImage from '../../assets/sky-image.png';
import { useNavigate } from 'react-router-dom';

const TravelHeroSection = ({
  image = DefaultImage,
  title = "Get the best sejour",
  subtitle = "Enjoy your travel journey",
}) => {

const Navigate= useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Dynamic Background image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">

        {/* Progress Indicators */}
        <div className="flex flex-col items-start mb-12 space-y-0">
          <div className="flex items-center space-x-4 relative">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-900 font-bold text-lg shadow-lg z-10">
              1
            </div>
            <span className="text-white text-sm font-medium drop-shadow-lg">
              Enjoy your travel journey
            </span>
          </div>

          <div className="ml-6 w-0.5 h-12 bg-white/40" />

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full border-2 border-white/60 flex items-center justify-center text-white font-bold text-lg z-10">
              2
            </div>
          </div>

          <div className="ml-6 w-0.5 h-12 bg-white/40" />

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full border-2 border-white/60 flex items-center justify-center text-white font-bold text-lg z-10">
              3
            </div>
          </div>
        </div>

        {/* Hero Text (dynamic) */}
       <div className="max-w-4xl mb-20 ">
  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
    {title}
  </h1>
  <p className="text-lg sm:text-xl text-white/100 font-medium drop-shadow-lg">
    {subtitle}
  </p>


          <button className="bg-[#117BB8] hover:bg-[#0d5a8a] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 mt-9"
          onClick={Navigate('/booking')}>
            Book A Trip Now
          </button>
        </div>

      </div>

    </div>
  );
};

export default TravelHeroSection;