import React from 'react';

// --- InfoSection Component (Reusable) ---
// Handles the layout for Umrah/Hadj and Group Trips sections
const InfoSection = ({ title, description, buttonText, imageSrc, imageAlt, reverseLayout }) => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className={`max-w-7xl mx-auto flex items-center gap-12 ${reverseLayout ? 'flex-row-reverse' : 'flex-row'} flex-wrap lg:flex-nowrap`}>
        {/* Text Content */}
        <div className="flex-1 min-w-[300px]">
          <h2 className="text-4xl font-black text-[#003d7a] mb-4 leading-tight">{title}</h2>
          <p className="text-gray-600 text-base leading-relaxed mb-6">{description}</p>
          <button 
            onClick={() => console.log(`${buttonText} clicked`)}
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {buttonText}
          </button>
        </div>
        
        {/* Image */}
        <div className="flex-1 min-w-[300px]">
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <img 
              src={imageSrc} 
              alt={imageAlt} 
              className="w-full h-[350px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- UmrahHadjPacks Component (Uses InfoSection) ---
export const UmrahHadjPacks = () => {
  return (
    <InfoSection
      title="Umrah / hadj packs"
      description="Ensure safety, comfort and good price to get the best spiritual experience"
      buttonText="Explore Now"
      imageSrc="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&h=400&fit=crop"
      imageAlt="Pilgrims at the Kaaba"
      reverseLayout={false} // Text on left, Image on right
    />
  );
};

// --- GroupTrips Component (Uses InfoSection) ---
export const GroupTrips = () => {
  return (
    <InfoSection
      title="Group Trips"
      description="Ensure safety, comfort and good price to get the best experience in your life with our amazing team. You will enjoy your time"
      buttonText="Explore Now"
      imageSrc="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop"
      imageAlt="Group of people on a hiking trip"
      reverseLayout={true} // Image on left, Text on right
    />
  );
};

// Export InfoSection as default
export default InfoSection;