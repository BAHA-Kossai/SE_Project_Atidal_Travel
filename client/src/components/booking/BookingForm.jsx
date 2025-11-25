import { useState, useEffect } from 'react';
import { MapPin, Hotel, User, Phone, Mail, MapPinned, Users, CheckCircle2 } from 'lucide-react';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [destinationCountry, setDestinationCountry] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [hotelStars, setHotelStars] = useState('');
  const [noHotelNeeded, setNoHotelNeeded] = useState(false);
  const [needsVisaAssistance, setNeedsVisaAssistance] = useState(false);
  const [tripDate, setTripDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [returningTime, setReturningTime] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [price, setPrice] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  const [isTraveler, setIsTraveler] = useState(false);
  const [numberOfPersons, setNumberOfPersons] = useState('');
  const [travelers, setTravelers] = useState([]);

  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split('T')[0];
  const oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];

  useEffect(() => {
    if (tripDate) {
      setDurationDays('7');
    }
  }, [tripDate]);

  useEffect(() => {
    if (numberOfPersons) {
      const numPersons = parseInt(numberOfPersons);
      const numTravelers = isTraveler ? numPersons - 1 : numPersons;
      
      if (numTravelers > 0) {
        const newTravelers = [];
        for (let i = 0; i < numTravelers; i++) {
          newTravelers.push(travelers[i] || {
            first_name: '',
            last_name: '',
            age: '',
            identity_number: '',
            travler_contact: '',
            passport_number: '',
            gender: '',
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

  const validateName = (name, fieldName) => {
    if (!name.trim()) return `${fieldName} is required`;
    if (name.trim().length < 2) return `${fieldName} must be at least 2 characters`;
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) return `${fieldName} can only contain letters, spaces, hyphens and apostrophes`;
    return null;
  };

  const validatePhoneNumber = (phone) => {
    if (!phone.trim()) return 'Phone number is required';
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!/^0\d{9}$/.test(cleanPhone)) return 'Phone number must start with 0 and be exactly 10 digits';
    return null;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    setPhone(limited);
  };

  const handleTravelerContactChange = (index, e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    updateTraveler(index, 'travler_contact', limited);
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!destinationCountry) newErrors.destinationCountry = 'Please select a destination country';
    if (!tripDate) newErrors.tripDate = 'Please select a trip date';
    if (!departureTime) newErrors.departureTime = 'Please select departure time';
    if (!returningTime) newErrors.returningTime = 'Please select returning time';
    if (!price) newErrors.price = 'Please enter the price';

    if (tripDate && tripDate < today) {
      newErrors.tripDate = 'Trip date cannot be in the past';
    }
    
    if (tripDate && tripDate > oneYearFromNow) {
      newErrors.tripDate = 'Trip date cannot be more than one year in the future';
    }

    if (price && parseFloat(price) < 0) {
      newErrors.price = 'Price cannot be negative';
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

    const phoneError = validatePhoneNumber(phone);
    if (phoneError) newErrors.phone = phoneError;

    travelers.forEach((traveler, index) => {
      const travelerFirstNameError = validateName(traveler.first_name, 'First name');
      if (travelerFirstNameError) {
        newErrors[`traveler${index}FirstName`] = travelerFirstNameError;
      }

      const travelerLastNameError = validateName(traveler.last_name, 'Last name');
      if (travelerLastNameError) {
        newErrors[`traveler${index}LastName`] = travelerLastNameError;
      }

      if (!traveler.age) {
        newErrors[`traveler${index}Age`] = 'Age is required';
      } else if (parseInt(traveler.age) < 1 || parseInt(traveler.age) > 120) {
        newErrors[`traveler${index}Age`] = 'Please enter a valid age';
      }

      if (!traveler.identity_number) {
        newErrors[`traveler${index}Identity`] = 'Identity number is required';
      }

      const travelerContactError = validatePhoneNumber(traveler.travler_contact);
      if (travelerContactError) {
        newErrors[`traveler${index}Contact`] = travelerContactError;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep2()) {
      try {
        const bookingData = {
          type: 'normal', 
          destination_country: destinationCountry,
          destination_city: destinationCity,
          price: parseFloat(price),
          trip_date: tripDate,
          departure_time: departureTime,
          returning_time: returningTime,
          duration_days: parseInt(durationDays),
          hotel_stars: noHotelNeeded ? null : hotelStars,
          no_hotel_needed: noHotelNeeded,
          needs_visa_assistance: needsVisaAssistance,
          user_id: null, 
          branch_id: null, 
          guide_id: null, 
          booking_status: 'pending',
          
          payer_info: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            booking_notes: bookingNotes || null,
            is_traveler: isTraveler,
            ...(isTraveler && {
              age: '', 
              identity_number: '', 
              passport_number: '', 
              gender: '' 
            })
          },
          
          travelers_info: travelers.map(traveler => ({
            first_name: traveler.first_name,
            last_name: traveler.last_name,
            age: parseInt(traveler.age),
            identity_number: traveler.identity_number,
            travler_contact: traveler.travler_contact,
            passport_number: traveler.passport_number || null,
            gender: traveler.gender || null
          }))
        };

        const response = await fetch('http://localhost:3000/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        const result = await response.json();

        if (result.status === 'success') {
          alert('Booking created successfully!');
          console.log('Booking created:', result.data);
          // Reset form or redirect
          // resetForm();
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error('Error creating booking:', error);
        alert('Failed to create booking. Please try again.');
      }
    }
  };

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

  const availableCities = destinationCountry 
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

  const resetForm = () => {
    setCurrentStep(1);
    setDestinationCountry('');
    setDestinationCity('');
    setHotelStars('');
    setNoHotelNeeded(false);
    setNeedsVisaAssistance(false);
    setTripDate('');
    setDepartureTime('');
    setReturningTime('');
    setDurationDays('');
    setPrice('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setBookingNotes('');
    setIsTraveler(false);
    setNumberOfPersons('');
    setTravelers([]);
    setErrors({});
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-gray-800 mb-3">Destination Booking Form</h1>
        <p className="text-gray-600 mb-8">Plan your perfect getaway with us</p>
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentStep === 1 ? 'bg-[#117BB8] text-white shadow-lg' : 'bg-white text-[#117BB8] border-2 border-[#117BB8]'
            }`}>
              {currentStep > 1 ? <CheckCircle2 className="w-6 h-6" /> : '1'}
            </div>
            <span className="ml-2 text-gray-700 hidden sm:inline">Trip Details</span>
          </div>
          <div className="w-12 sm:w-24 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentStep === 2 ? 'bg-[#117BB8] text-white shadow-lg' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className="ml-2 text-gray-700 hidden sm:inline">Personal Info</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100">
        {/* Step 1: Trip Information */}
        {currentStep === 1 && (
          <form onSubmit={handleNextStep} className="space-y-6">
            <div className="mb-8">
              <h2 className="text-[#117BB8] mb-2">Trip Details</h2>
              <p className="text-gray-500">Tell us about your trip</p>
            </div>

            {/* Row 1: Country and City */}
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
                  Destination City
                </label>
                <MapPin className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  value={destinationCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${
                    errors.destinationCity ? 'border-red-500' : 'border-gray-200'
                  } text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                >
                  <option value="">Select city (optional)</option>
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

            {/* Row 2: Hotel and Options */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-700 mb-2">
                  Hotel Rating
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
                  <option value="">Select rating (optional)</option>
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

            {/* Row 3: Dates and Times */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Trip Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={tripDate}
                  onChange={setTripDate}
                  placeholder="Select trip date"
                  min={today}
                  max={oneYearFromNow}
                  error={!!errors.tripDate}
                />
                {errors.tripDate && (
                  <p className="text-red-500 text-sm mt-2">{errors.tripDate}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Departure Time <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    value={departureTime}
                    onChange={setDepartureTime}
                    placeholder="HH:MM"
                    error={!!errors.departureTime}
                  />
                  {errors.departureTime && (
                    <p className="text-red-500 text-sm mt-2">{errors.departureTime}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Returning Time <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    value={returningTime}
                    onChange={setReturningTime}
                    placeholder="HH:MM"
                    error={!!errors.returningTime}
                  />
                  {errors.returningTime && (
                    <p className="text-red-500 text-sm mt-2">{errors.returningTime}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Row 4: Duration and Price */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-gray-700 mb-2">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  placeholder="7"
                  min="1"
                  max="365"
                  className="w-full pl-4 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all"
                />
              </div>

              <div className="relative">
                <label className="block text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`w-full pl-4 pr-4 py-4 rounded-xl bg-gray-50 border ${
                    errors.price ? 'border-red-500' : 'border-gray-200'
                  } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-2">{errors.price}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#117BB8] to-[#0f6da4] hover:from-[#0f6da4] hover:to-[#0d5f92] text-white py-5 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Continue to Personal Information →
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payer and Traveler Information */}
        {currentStep === 2 && (
          <div>
            <div className="mb-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-[#117BB8] hover:text-[#0f6da4] transition-colors flex items-center gap-2 mb-4"
              >
                ← Back to trip details
              </button>
              <h2 className="text-[#117BB8] mb-2">Personal Information</h2>
              <p className="text-gray-500">Provide details about the payer and travelers</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payer Information */}
              <div className="border-b-2 border-gray-200 pb-6">
                <h3 className="text-gray-800 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-[#117BB8]" />
                  Payer Information
                </h3>

                <div className="grid sm:grid-cols-2 gap-6">
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
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                  <div className="relative">
                    <label className="block text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Phone className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="0XXXXXXXXX"
                      className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-gray-700 mb-2">
                      Booking Notes
                    </label>
                    <textarea
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Any additional notes (optional)"
                      rows="3"
                      className="w-full px-4 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Traveler Status */}
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

              {/* Number of Persons */}
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
                              value={traveler.first_name}
                              onChange={(e) => updateTraveler(index, 'first_name', e.target.value)}
                              placeholder="First name *"
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
                              value={traveler.last_name}
                              onChange={(e) => updateTraveler(index, 'last_name', e.target.value)}
                              placeholder="Last name *"
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
                              placeholder="Age *"
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

                        {/* Traveler Identity and Contact */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            <input
                              type="text"
                              value={traveler.identity_number}
                              onChange={(e) => updateTraveler(index, 'identity_number', e.target.value)}
                              placeholder="Identity number *"
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${
                                errors[`traveler${index}Identity`] ? 'border-red-500' : 'border-gray-200'
                              } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`}
                            />
                            {errors[`traveler${index}Identity`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`traveler${index}Identity`]}</p>
                            )}
                          </div>

                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            <input
                              type="tel"
                              value={traveler.travler_contact}
                              onChange={(e) => handleTravelerContactChange(index, e)}
                              placeholder="Contact number *"
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${
                                errors[`traveler${index}Contact`] ? 'border-red-500' : 'border-gray-200'
                              } text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`}
                            />
                            {errors[`traveler${index}Contact`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`traveler${index}Contact`]}</p>
                            )}
                          </div>
                        </div>

                        {/* Optional Traveler Fields */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            <input
                              type="text"
                              value={traveler.passport_number}
                              onChange={(e) => updateTraveler(index, 'passport_number', e.target.value)}
                              placeholder="Passport number (optional)"
                              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all"
                            />
                          </div>

                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            <select
                              value={traveler.gender}
                              onChange={(e) => updateTraveler(index, 'gender', e.target.value)}
                              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all"
                            >
                              <option value="">Gender (optional)</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-5 rounded-xl transition-all"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#117BB8] to-[#0f6da4] hover:from-[#0f6da4] hover:to-[#0d5f92] text-white py-5 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
}