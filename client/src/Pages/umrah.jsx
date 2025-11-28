import { useState } from 'react';
import Layout from '../components/layout/Layout.jsx';
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, Home, Check } from 'lucide-react';
import BookingForm from '../components/booking/BookingForm.jsx';
import imgKaaba from '../assets/kaaba-image.jpeg';

// Package data
const packages = [
  {
    id: 1,
    type: 'Classic',
    duration: '14 days / 13 nights',
    dates: 'from 13/09/2025 to 29/09/2025',
    hotel: '4 stars hotels, 1km far from kaabah',
    price: '180000DA - 200000Da',
    includes: [
      'Round-trip flights',
      '4-star hotel accommodation',
      'Visa processing assistance',
      'Guided Ziyarah tours',
      'Daily meals included',
    ],
  },
  {
    id: 2,
    type: 'Premium',
    duration: '14 days / 13 nights',
    dates: 'from 13/09/2025 to 29/09/2025',
    hotel: '5 stars hotels, 500m far from kaabah',
    price: '250000DA - 300000Da',
    includes: [
      'Round-trip flights',
      '5-star hotel accommodation',
      'Visa processing assistance',
      'Guided Ziyarah tours',
      'All meals included',
      'Airport transfers',
      'Private Ziyarah tours',
    ],
  },
  {
    id: 3,
    type: 'Deluxe',
    duration: '14 days / 13 nights',
    dates: 'from 13/09/2025 to 29/09/2025',
    hotel: '5 stars hotels, 500m far from kaabah',
    price: '250000DA - 300000Da',
    includes: [
      'Round-trip flights',
      '5-star hotel accommodation',
      'Visa processing assistance',
      'Guided Ziyarah tours',
      'All meals included',
      'Airport transfers',
      'Private Ziyarah tours',
    ],
  },
];

function PackageCard({ packageData, onBookNow }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-105">
     
      {/* Content */}
      <div className="flex flex-col flex-1 p-8 gap-6">
        {/* Package Title */}
        <div>
          <h3 className="text-gray-800 mb-4">{packageData.type} package</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5 text-[#117BB8] flex-shrink-0" />
              <p className="text-sm">{packageData.duration}</p>
            </div>
            
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-5 h-5 text-[#117BB8] flex-shrink-0" />
              <p className="text-sm">{packageData.dates}</p>
            </div>
            
            <div className="flex items-center gap-3 text-gray-600">
              <Home className="w-5 h-5 text-[#117BB8] flex-shrink-0" />
              <p className="text-sm">{packageData.hotel}</p>
            </div>
          </div>
        </div>

        {/* Includes */}
        <div className="flex-1">
          <h4 className="text-gray-800 mb-4">Package includes:</h4>
          <div className="space-y-3">
            {packageData.includes.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#117BB8] flex-shrink-0 mt-0.5" />
                <p className="text-gray-600 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Price and Button */}
        <div className="border-t border-gray-200 pt-6 mt-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-[#117BB8]">{packageData.price}</p>
            <button 
              onClick={() => onBookNow(packageData)}
              className="bg-[#117BB8] hover:bg-[#0f6da4] text-white px-8 py-3 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Book now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UmrahPage() {
    const navigate = useNavigate();

  const handleBookNow = (packageData) => {
    navigate("/bookings", { state: { packageData, isUmrah: true } });};
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);


  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedPackage(null);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[600px] sm:h-[700px] overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-8">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={imgKaaba}
            alt="Kaaba view" 
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
        </div>

        {/* Text Content Overlay */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <p className="text-sm sm:text-base mb-4 text-white/90">
                Enjoy your travel journey
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl mb-4 text-white font-bold">
                Umrah packs
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl mb-8 text-white/95">
                Best spiritual experience
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 justify-center">



  {packages.map((pkg, index) => {
  const isOdd = packages.length % 2 !== 0;
  const isLast = index === packages.length - 1;

  return (
    <div
      key={pkg.id}
      className={`
        ${isOdd && isLast 
          ? "lg:col-span-3 mx-auto w-full" 
          : "lg:col-span-2"
        }
      `}
    >
      <PackageCard
        packageData={pkg}
        onBookNow={handleBookNow}
        fullWidth={isOdd && isLast}
      />
    </div>
  );
})}


</div>

      </div>



  

    </Layout>
  );
}