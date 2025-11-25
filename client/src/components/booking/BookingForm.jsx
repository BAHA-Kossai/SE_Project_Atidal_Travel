import { useState, useEffect } from 'react';
import { MapPin, Hotel, User, Phone, Mail, MapPinned, Users, CheckCircle2, Plane, Package, Calendar as CalendarIcon, X } from 'lucide-react';
import DatePicker from './DatePicker.jsx';
import TimePicker from './TimePicker.jsx';

export default function BookingForm({ packageData = null, onClose = null }) {
  // Determine if this is an Umrah booking
  const isUmrahBooking = packageData !== null;
  
  // Step 1 state
  const [currentStep, setCurrentStep] = useState(isUmrahBooking ? 2 : 1);
  const [destinationCountry, setDestinationCountry] = useState(isUmrahBooking ? 'Saudi Arabia' : '');
  const [destinationCity, setDestinationCity] = useState(isUmrahBooking ? 'Mecca' : '');
  const [hotelStars, setHotelStars] = useState('');
  const [noHotelNeeded, setNoHotelNeeded] = useState(false);
  const [needsVisaAssistance, setNeedsVisaAssistance] = useState(false);
  const [departureDay, setDepartureDay] = useState('');
  const [returnDay, setReturnDay] = useState('');

  // Step 2 state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [dayOfMeet, setDayOfMeet] = useState('');
  const [timeOfMeet, setTimeOfMeet] = useState('');
  const [isTraveler, setIsTraveler] = useState(true);
  const [numberOfPersons, setNumberOfPersons] = useState('');
  const [travelers, setTravelers] = useState([]);

  // Form errors
  const [errors, setErrors] = useState({});

  // Calculate date constraints
  const today = new Date().toISOString().split('T')[0];
  const oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];

  // Update travelers array when number of persons or isTraveler changes
  useEffect(() => {
    if (numberOfPersons) {
      const numPersons = parseInt(numberOfPersons);
      const numTravelers = isTraveler ? numPersons - 1 : numPersons;
      
      if (numTravelers > 0) {
        const newTravelers = [];
        for (let i = 0; i < numTravelers; i++) {
          newTravelers.push(travelers[i] || {
            firstName: '',
            lastName: '',
            age: '',
            phoneNumber: '',
            email: '',
          });
        }
        setTravelers(newTravelers);
      } else {
        setTravelers([]);
      }
    }
  }, [numberOfPersons, isTraveler]);

  const updateTraveler = (index, field, value) => {
    const newTravelers = [...travelers];
    newTravelers[index] = { ...newTravelers[index], [field]: value };
    setTravelers(newTravelers);
  };

  // Name validation helper
  const validateName = (name, fieldName) => {
    if (!name.trim()) return `${fieldName} is required`;
    if (name.trim().length < 2) return `${fieldName} must be at least 2 characters`;
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) return `${fieldName} can only contain letters, spaces, hyphens and apostrophes`;
    return null;
  };

  // Phone number validation helper
  const validatePhoneNumber = (phone) => {
    if (!phone.trim()) return 'Phone number is required';
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!/^0\d{9}$/.test(cleanPhone)) return 'Phone number must start with 0 and be exactly 10 digits';
    return null;
  };

  // Handle phone number input with formatting
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    setPhoneNumber(limited);
  };

  // Handle traveler phone number input with formatting
  const handleTravelerPhoneNumberChange = (index, e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    updateTraveler(index, 'phoneNumber', limited);
  };

  const validateStep1 = () => {
    const newErrors = {};

    // Only validate country/city if not Umrah booking
    if (!isUmrahBooking) {
      if (!destinationCountry) newErrors.destinationCountry = 'Please select a destination country';
      if (!destinationCity) newErrors.destinationCity = 'Please select a destination city';
    }
    
    if (!noHotelNeeded && !hotelStars) newErrors.hotelStars = 'Please select hotel stars or check "I don\'t need hotel"';
    if (!departureDay) newErrors.departureDay = 'Please select a departure date';
    if (!returnDay) newErrors.returnDay = 'Please select a return date';

    if (departureDay && departureDay < today) {
      newErrors.departureDay = 'Departure date cannot be in the past';
    }
    
    if (departureDay && departureDay > oneYearFromNow) {
      newErrors.departureDay = 'Departure date cannot be more than one year in the future';
    }

    if (departureDay && returnDay && new Date(returnDay) <= new Date(departureDay)) {
      newErrors.returnDay = 'Return date must be after departure date';
    }
    
    if (returnDay && returnDay > oneYearFromNow) {
      newErrors.returnDay = 'Return date cannot be more than one year in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    const firstNameError = validateName(firstName, 'First name');
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateName(lastName, 'Last name');
    if (lastNameError) newErrors.lastName = lastNameError;

    if (!age) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(age);
      if (ageNum < 18) {
        newErrors.age = 'Payer must be at least 18 years old';
      } else if (ageNum > 120) {
        newErrors.age = 'Please enter a valid age';
      }
    }

    const phoneNumberError = validatePhoneNumber(phoneNumber);
    if (phoneNumberError) newErrors.phoneNumber = phoneNumberError;

    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!wilaya) newErrors.wilaya = 'Please select a wilaya';
    if (!dayOfMeet) newErrors.dayOfMeet = 'Day of meet is required';
    if (!timeOfMeet) newErrors.timeOfMeet = 'Time of meet is required';
    if (!numberOfPersons) newErrors.numberOfPersons = 'Number of persons is required';
    else if (parseInt(numberOfPersons) < 1) newErrors.numberOfPersons = 'At least 1 person is required';

    travelers.forEach((traveler, index) => {
      const travelerFirstNameError = validateName(traveler.firstName, 'First name');
      if (travelerFirstNameError) {
        newErrors[`traveler${index}FirstName`] = travelerFirstNameError;
      }

      const travelerLastNameError = validateName(traveler.lastName, 'Last name');
      if (travelerLastNameError) {
        newErrors[`traveler${index}LastName`] = travelerLastNameError;
      }

      if (!traveler.age) {
        newErrors[`traveler${index}Age`] = 'Age is required';
      } else if (parseInt(traveler.age) < 1 || parseInt(traveler.age) > 120) {
        newErrors[`traveler${index}Age`] = 'Please enter a valid age';
      }

      const travelerPhoneNumberError = validatePhoneNumber(traveler.phoneNumber);
      if (travelerPhoneNumberError) {
        newErrors[`traveler${index}PhoneNumber`] = travelerPhoneNumberError;
      }

      if (!traveler.email.trim()) {
        newErrors[`traveler${index}Email`] = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(traveler.email)) {
        newErrors[`traveler${index}Email`] = 'Email is invalid';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      console.log({
        packageInfo: packageData,
        destination: {
          country: destinationCountry,
          city: destinationCity,
        },
        step1: {
          hotelStars,
          noHotelNeeded,
          needsVisaAssistance,
          departureDay,
          returnDay,
        },
        step2: {
          firstName,
          lastName,
          age,
          phoneNumber,
          email,
          wilaya,
          dayOfMeet,
          timeOfMeet,
          isTraveler,
          numberOfPersons,
          travelers,
        },
      });
      alert(isUmrahBooking ? 'Umrah booking submitted successfully!' : 'Form submitted successfully!');
      if (onClose) onClose();
    }
  };

  const wilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
    'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
    'Constantine', 'Médéa', 'Mostaganem', 'MSila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arreridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane'
  ];

  const destinations = {
    france: {
      name: 'France',
      cities: ['Paris', 'Lyon', 'Marseille', 'Nice', 'Toulouse', 'Bordeaux']
    },
    spain: {
      name: 'Spain',
      cities: ['Barcelona', 'Madrid', 'Valencia', 'Seville', 'Malaga', 'Bilbao']
    },
    italy: {
      name: 'Italy',
      cities: ['Rome', 'Milan', 'Venice', 'Florence', 'Naples', 'Turin']
    },
    greece: {
      name: 'Greece',
      cities: ['Athens', 'Thessaloniki', 'Santorini', 'Mykonos', 'Crete', 'Rhodes']
    },
    turkey: {
      name: 'Turkey',
      cities: ['Istanbul', 'Ankara', 'Antalya', 'Izmir', 'Bursa', 'Bodrum']
    },
    morocco: {
      name: 'Morocco',
      cities: ['Marrakech', 'Casablanca', 'Fez', 'Rabat', 'Tangier', 'Agadir']
    }
  };

  const availableCities = destinationCountry && !isUmrahBooking
    ? destinations[destinationCountry]?.cities || []
    : Object.values(destinations).flatMap(country => country.cities);

  const handleCountryChange = (country) => {
    setDestinationCountry(country);
    if (country && destinationCity) {
      const countryData = destinations[country];
      if (countryData && !countryData.cities.includes(destinationCity)) {
        setDestinationCity('');
      }
    }
  };

  const handleCityChange = (city) => {
    setDestinationCity(city);
    
    if (city) {
      for (const [countryKey, countryData] of Object.entries(destinations)) {
        if (countryData.cities.includes(city)) {
          setDestinationCountry(countryKey);
          break;
        }
      }
    }
  };

  // Wrapper component - conditionally renders modal or normal form
  const FormContent = () => (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-gray-800 mb-3">
          {isUmrahBooking ? 'Umrah Booking Form' : 'Destination Booking Form'}
        </h1>
        <p className="text-gray-600 mb-8">
          {isUmrahBooking ? 'Complete your spiritual journey booking' : 'Plan your perfect getaway with us'}
        </p>
        
        {/* Package Information Display - Only for Umrah */}
        {isUmrahBooking && packageData && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-8">
            <div className="flex flex-col gap-4">
              {/* Umrah Label */}
              <div className="flex items-center justify-center gap-2 bg-[#f1f9fe] rounded-xl px-4 py-3">
                <Plane className="w-5 h-5 text-[#495057]" />
                <p className="text-[#495057]">Umrah</p>
              </div>
              
              {/* Package Type and Dates */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-center gap-2 bg-[#f1f9fe] rounded-xl px-4 py-3">
                  <Package className="w-5 h-5 text-[#495057]" />
                  <p className="text-[#495057]">{packageData.type} Pack</p>
                </div>
                
                <div className="flex items-center justify-center gap-2 bg-[#f1f9fe] rounded-xl px-4 py-3">
                  <CalendarIcon className="w-5 h-5 text-[#495057]" />
                  <p className="text-[#495057]">{packageData.dates}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step Indicator - Only for regular booking */}
        {!isUmrahBooking && (
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentStep === 1 ? 'bg-[#117BB8] text-white shadow-lg' : 'bg-white text-[#117BB8] border-2 border-[#117BB8]'
              }`}>
                {currentStep > 1 ? <CheckCircle2 className="w-6 h-6" /> : '1'}
              </div>
              <span className="ml-2 text-gray-700 hidden sm:inline">Destination</span>
            </div>
            <div className="w-12 sm:w-24 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentStep === 2 ? 'bg-[#117BB8] text-white shadow-lg' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="ml-2 text-gray-700 hidden sm:inline">Information</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100">
        {/* Step 1: Destination Information */}
        {currentStep === 1 && (
          <form onSubmit={handleNextStep} className="space-y-6">
            <div className="mb-8">
              <h2 className="text-[#117BB8] mb-2">Destination Details</h2>
              <p className="text-gray-500">
                {isUmrahBooking ? 'Your journey to the holy city' : "Tell us where you'd like to go"}
              </p>
            </div>

            {/* Destination Display - Conditional based on Umrah or regular booking */}
            {isUmrahBooking ? (
              // Locked Destination Display for Umrah
              <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl p-6 border-2 border-[#117BB8]">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#117BB8]" />
                    <div>
                      <p className="text-sm text-gray-600">Destination Country</p>
                      <p className="text-gray-800">{destinationCountry}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#117BB8]" />
                    <div>
                      <p className="text-sm text-gray-600">Destination City</p>
                      <p className="text-gray-800">{destinationCity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Editable Country and City for regular bookings
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-gray-700 mb-2">
                    Destination Country <span className="text-red-500">*</span>
                  </label>
                  <MapPin className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <select
                    value={destinationCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${
                      errors.destinationCountry ? 'border-red-500' : 'border-gray-200'
                    } text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                  >
                    <option value="">Select country</option>
                    <option value="france">France</option>
                    <option value="spain">Spain</option>
                    <option value="italy">Italy</option>
                    <option value="greece">Greece</option>
                    <option value="turkey">Turkey</option>
                    <option value="morocco">Morocco</option>
                  </select>
                  {errors.destinationCountry && (
                    <p className="text-red-500 text-sm mt-2">{errors.destinationCountry}</p>
                  )}
                </div>
                
                <div className="relative">
                  <label className="block text-gray-700 mb-2">
                    Destination City <span className="text-red-500">*</span>
                  </label>
                  <MapPin className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <select
                    value={destinationCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${
                      errors.destinationCity ? 'border-red-500' : 'border-gray-200'
                    } text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                  >
                    <option value="">Select city</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.destinationCity && (
                    <p className="text-red-500 text-sm mt-2">{errors.destinationCity}</p>
                  )}
                </div>
              </div>
            )}

            {/* Row 2: Hotel and Options */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-700 mb-2">
                  Hotel Rating {!noHotelNeeded && <span className="text-red-500">*</span>}
                </label>
                <Hotel className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  value={hotelStars}
                  onChange={(e) => setHotelStars(e.target.value)}
                  disabled={noHotelNeeded}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${
                    errors.hotelStars ? 'border-red-500' : 'border-gray-200'
                  } text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <option value="">Select rating</option>
                  <option value="3">★★★ 3 Stars</option>
                  <option value="4">★★★★ 4 Stars</option>
                  <option value="5">★★★★★ 5 Stars</option>
                </select>
                {errors.hotelStars && !noHotelNeeded && (
                  <p className="text-red-500 text-sm mt-2">{errors.hotelStars}</p>
                )}
              </div>
              
              <div className="flex flex-col gap-4">
                <label className="block text-gray-700 mb-2">
                  Additional Options
                </label>
                <label className="flex items-center bg-gray-50 px-5 py-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-[#117BB8] transition-all group">
                  <input
                    type="checkbox"
                    checked={noHotelNeeded}
                    onChange={(e) => setNoHotelNeeded(e.target.checked)}
                    className="mr-3 w-5 h-5 text-[#117BB8] rounded focus:ring-2 focus:ring-[#117BB8] cursor-pointer"
                  />
                  <span className="text-gray-700 group-hover:text-[#117BB8] transition-colors">I don't need a hotel</span>
                </label>
                
                <label className="flex items-center bg-gray-50 px-5 py-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-[#117BB8] transition-all group">
                  <input
                    type="checkbox"
                    checked={needsVisaAssistance}
                    onChange={(e) => setNeedsVisaAssistance(e.target.checked)}
                    className="mr-3 w-5 h-5 text-[#117BB8] rounded focus:ring-2 focus:ring-[#117BB8] cursor-pointer"
                  />
                  <span className="text-gray-700 group-hover:text-[#117BB8] transition-colors">I need visa assistance</span>
                </label>
              </div>
            </div>

            {/* Row 3: Dates */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Departure Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={departureDay}
                  onChange={setDepartureDay}
                  placeholder="Select departure date"
                  min={today}
                  max={oneYearFromNow}
                  error={!!errors.departureDay}
                />
                {errors.departureDay && (
                  <p className="text-red-500 text-sm mt-2">{errors.departureDay}</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">
                  Return Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={returnDay}
                  onChange={setReturnDay}
                  placeholder="Select return date"
                  min={departureDay || today}
                  max={oneYearFromNow}
                  error={!!errors.returnDay}
                />
                {errors.returnDay && (
                  <p className="text-red-500 text-sm mt-2">{errors.returnDay}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#117BB8] to-[#0f6da4] hover:from-[#0f6da4] hover:to-[#0d5f92] text-white py-5 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Continue to Payer Information →
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payer Information */}
        {currentStep === 2 && (
          <div>
            {!isUmrahBooking && (
              <div className="mb-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-[#117BB8] hover:text-[#0f6da4] transition-colors flex items-center gap-2 mb-4"
                >
                  ← Back to destination details
                </button>
              </div>
            )}
            <div className="mb-8">
              <h2 className="text-[#117BB8] mb-2">Payer Information</h2>
              <p className="text-gray-500">Provide details about the person making the booking</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Personal Details */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="relative">
                  <label className="block text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <User className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-200'
                    } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-2">{errors.firstName}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <User className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-200'
                    } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-2">{errors.lastName}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <User className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="18+"
                    min="18"
                    max="120"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${
                      errors.age ? 'border-red-500' : 'border-gray-200'
                    } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-2">{errors.age}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Contact Details */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="relative">
                  <label className="block text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Phone className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="0XXXXXXXXX"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                    } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-2">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Mail className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-gray-700 mb-2">
                    Wilaya <span className="text-red-500">*</span>
                  </label>
                  <MapPinned className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <select
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${
                      errors.wilaya ? 'border-red-500' : 'border-gray-200'
                    } text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                  >
                    <option value="">Select wilaya</option>
                    {wilayas.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                  {errors.wilaya && (
                    <p className="text-red-500 text-sm mt-2">{errors.wilaya}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Meeting Details */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Meeting Day <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    value={dayOfMeet}
                    onChange={setDayOfMeet}
                    placeholder="Select meeting date"
                    min={today}
                    max={oneYearFromNow}
                    error={!!errors.dayOfMeet}
                  />
                  {errors.dayOfMeet && (
                    <p className="text-red-500 text-sm mt-2">{errors.dayOfMeet}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Meeting Time <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    value={timeOfMeet}
                    onChange={setTimeOfMeet}
                    placeholder="Select meeting time"
                    error={!!errors.timeOfMeet}
                  />
                  {errors.timeOfMeet && (
                    <p className="text-red-500 text-sm mt-2">{errors.timeOfMeet}</p>
                  )}
                </div>
              </div>

              {/* Row 4: Traveler Status */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <label className="block text-gray-700 mb-4">
                  Are you a traveler? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsTraveler(true)}
                    className={`flex-1 px-8 py-4 rounded-xl transition-all ${
                      isTraveler
                        ? 'bg-[#117BB8] text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#117BB8]'
                    }`}
                  >
                    Yes, I'm traveling
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTraveler(false)}
                    className={`flex-1 px-8 py-4 rounded-xl transition-all ${
                      !isTraveler
                        ? 'bg-[#117BB8] text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#117BB8]'
                    }`}
                  >
                    No, I'm not traveling
                  </button>
                </div>
              </div>

              {/* Row 5: Number of Persons */}
              <div className="relative">
                <label className="block text-gray-700 mb-2">
                  Total Number of Persons <span className="text-red-500">*</span>
                </label>
                <Users className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  value={numberOfPersons}
                  onChange={(e) => setNumberOfPersons(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${
                    errors.numberOfPersons ? 'border-red-500' : 'border-gray-200'
                  } text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                >
                  <option value="">Select number of persons</option>
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i + 1 === 1 ? 'person' : 'persons'}
                    </option>
                  ))}
                </select>
                {errors.numberOfPersons && (
                  <p className="text-red-500 text-sm mt-2">{errors.numberOfPersons}</p>
                )}
                {numberOfPersons && (
                  <p className="text-gray-600 text-sm mt-2">
                    {isTraveler 
                      ? `You need to fill ${travelers.length} additional traveler${travelers.length !== 1 ? 's' : ''} form${travelers.length !== 1 ? 's' : ''}`
                      : `You need to fill ${travelers.length} traveler${travelers.length !== 1 ? 's' : ''} form${travelers.length !== 1 ? 's' : ''}`
                    }
                  </p>
                )}
              </div>

              {/* Additional Travelers Forms */}
              {travelers.length > 0 && (
                <div className="space-y-6 mt-8">
                  <div className="border-t-2 border-gray-200 pt-6">
                    <h3 className="text-gray-800 mb-6 flex items-center gap-2">
                      <Users className="w-6 h-6 text-[#117BB8]" />
                      Additional Travelers Information
                    </h3>
                  </div>
                  
                  {travelers.map((traveler, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-gray-700 mb-4">Traveler {index + 1}</h4>
                      
                      <div className="space-y-4">
                        {/* Traveler Names and Age */}
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            <input
                              type="text"
                              value={traveler.firstName}
                              onChange={(e) => updateTraveler(index, 'firstName', e.target.value)}
                              placeholder="First name"
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${
                                errors[`traveler${index}FirstName`] ? 'border-red-500' : 'border-gray-200'
                              } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`}
                            />
                            {errors[`traveler${index}FirstName`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`traveler${index}FirstName`]}</p>
                            )}
                          </div>

                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            <input
                              type="text"
                              value={traveler.lastName}
                              onChange={(e) => updateTraveler(index, 'lastName', e.target.value)}
                              placeholder="Last name"
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${
                                errors[`traveler${index}LastName`] ? 'border-red-500' : 'border-gray-200'
                              } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`}
                            />
                            {errors[`traveler${index}LastName`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`traveler${index}LastName`]}</p>
                            )}
                          </div>

                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            <input
                              type="number"
                              value={traveler.age}
                              onChange={(e) => updateTraveler(index, 'age', e.target.value)}
                              placeholder="Age"
                              min="1"
                              max="120"
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${
                                errors[`traveler${index}Age`] ? 'border-red-500' : 'border-gray-200'
                              } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`}
                            />
                            {errors[`traveler${index}Age`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`traveler${index}Age`]}</p>
                            )}
                          </div>
                        </div>

                        {/* Traveler Contact */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            <input
                              type="tel"
                              value={traveler.phoneNumber}
                              onChange={(e) => handleTravelerPhoneNumberChange(index, e)}
                              placeholder="Phone number"
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${
                                errors[`traveler${index}PhoneNumber`] ? 'border-red-500' : 'border-gray-200'
                              } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`}
                            />
                            {errors[`traveler${index}PhoneNumber`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`traveler${index}PhoneNumber`]}</p>
                            )}
                          </div>

                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            <input
                              type="email"
                              value={traveler.email}
                              onChange={(e) => updateTraveler(index, 'email', e.target.value)}
                              placeholder="Email"
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${
                                errors[`traveler${index}Email`] ? 'border-red-500' : 'border-gray-200'
                              } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`}
                            />
                            {errors[`traveler${index}Email`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`traveler${index}Email`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-8 flex gap-4">
                {!isUmrahBooking && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-5 rounded-xl transition-all"
                  >
                    ← Back
                  </button>
                )}
                <button
                  type="submit"
                  className={`${isUmrahBooking ? 'w-full' : 'flex-1'} bg-gradient-to-r from-[#117BB8] to-[#0f6da4] hover:from-[#0f6da4] hover:to-[#0d5f92] text-white py-5 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                >
                  Submit Booking
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );

  // Return modal wrapper for Umrah, regular content for standard form
  if (isUmrahBooking) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <FormContent />
          </div>
        </div>
      </div>
    );
  }

  return <FormContent />;
}