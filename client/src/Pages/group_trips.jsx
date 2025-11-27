import { useState } from 'react';
import Layout from '../components/layout/Layout.jsx';
import { Clock, Calendar, Home, Check } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import BookingForm from '../components/booking/BookingForm.jsx';
import Guided from '../assets/guided-trip.png';
import Timgad from '../assets/timgad.png';
import TravelHeroSection from '../components/home/Search.jsx';

// Package data
const packages = [
  {
    id: 1,
    image:Timgad,
    destination: 'Timgad',
    duration: '1 day',
    date: '13/09/2025',
    departure: 'Cour de la revolution, Annaba at 8:30 ',
    price: '2000Da',
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
     image:Timgad,
    destination: 'Timgad',
    duration: '1 day',
    date: '13/09/2025',
    departure: 'Cour de la revolution, Annaba at 8:30 ',
    price: '2000Da',
    includes: [
      'Round-trip flights',
      '4-star hotel accommodation',
      'Visa processing assistance',
      'Guided Ziyarah tours',
      'Daily meals included',
    ],
  },
   {
    id: 3,
    image:Timgad,
    destination: 'Timgad',
    duration: '1 day',
    date: '13/09/2025',
    departure: 'Cour de la revolution, Annaba at 8:30 ',
    price: '2000Da',
    includes: [
      'Round-trip flights',
      '4-star hotel accommodation',
      'Visa processing assistance',
      'Guided Ziyarah tours',
      'Daily meals included',
    ],
  },
];

function PackageCard({ packageData, onBookNow, fullWidth }) {

  return (
    
   <div
  className={`bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-full 
  transition-transform duration-300 hover:scale-105 ${
    fullWidth ? "lg:flex-row" : ""
  }`}
>


      {/* Image Section */}
      {packageData.image && (
       <img
  src={packageData.image}
  alt={packageData.type}
  className={`object-cover 
    ${fullWidth ? "w-1/2 h-full" : "w-full h-56"}
  `}
/>

      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-8 gap-6">
        {/* Package Title */}
        <div>
          <h3 className="text-gray-800 mb-4">{packageData.destination} Trip </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5 text-[#117BB8] flex-shrink-0" />
              <p className="text-sm">{packageData.duration}</p>
            </div>
            
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-5 h-5 text-[#117BB8] flex-shrink-0" />
              <p className="text-sm">{packageData.date}</p>
            </div>
            
            <div className="flex items-center gap-3 text-gray-600">
              <Home className="w-5 h-5 text-[#117BB8] flex-shrink-0" />
              <p className="text-sm">{packageData.departure}</p>
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

export default function GroupTrip() {
      const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

 const handleBookNow = (packageData) => {
   navigate('/bookings', {
  state: {
    packageData,
    isGroupTrip: true
  }
});

  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedPackage(null);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <TravelHeroSection
  image={Guided}
  title="Group Trips"
  subtitle="Enjoy traveling with a group!"/>

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