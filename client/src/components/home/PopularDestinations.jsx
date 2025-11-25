import React from 'react';
import { MapPin } from 'lucide-react';

// --- DestinationCard Component ---
// Reusable component for each destination item
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
  const destinations = [
    { 
      name: 'Bali Beach', 
      location: 'Bali, Indonesia', 
      imageSrc: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop'
    },
    { 
      name: 'Kuala Lumpur', 
      location: 'Kuala Lumpur, Malaysia', 
      imageSrc: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop'
    },
    { 
      name: 'Istanbul', 
      location: 'Istanbul, Turkey', 
      imageSrc: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop'
    },
  ];

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Popular Destinations</h2>
        <p className="text-gray-500 mb-8">Explore the world with us</p>
        <div className="flex flex-wrap justify-center gap-4">
          {destinations.map((dest, index) => (
            <DestinationCard 
              key={index}
              name={dest.name}
              location={dest.location}
              imageSrc={dest.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;