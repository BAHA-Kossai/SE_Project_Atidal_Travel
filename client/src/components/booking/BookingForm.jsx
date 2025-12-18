import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBookings } from '../../../hooks/useBookings';
import { MapPin, Hotel, User, Phone, Mail, MapPinned, Users, Plane, Package, Calendar as CalendarIcon, Map } from 'lucide-react';

// Import frontend validation functions
import {
  validateFirstName,
  validateLastName,
  validatePhoneNumber,
  validateAge,
  validatePrice,
  validateDate,
  validateTime,
  validateIdentityNumber,
  validatePassportNumber,
  validateGender,
  validateDestinationCountry,
  validateDuration
} from '../../../utils/validation';

export default function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { packageData, isUmrah, isGroupTrip } = location.state || {};

  // Booking type flags
  const isUmrahBooking = isUmrah === true;
  const isGroupTripBooking = isGroupTrip === true;
  const isSpecialBooking = isUmrahBooking || isGroupTripBooking;

  // Step state: always start at step 1 for all trip types
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Booking Info State - Pre-fill from package data for special bookings
  const [bookingInfo, setBookingInfo] = useState({
    destination_country: isUmrahBooking ? 'Saudi Arabia' : isGroupTripBooking ? (packageData?.TripInfo?.destination_country || '') : '',
    destination_city: isUmrahBooking ? 'Mecca' : isGroupTripBooking ? (packageData?.TripInfo?.destination_city || '') : '',
    trip_date: isUmrahBooking ? (packageData?.TripInfo?.trip_date || '') : isGroupTripBooking ? (packageData?.TripInfo?.trip_date || '') : '',
    returning_date: isUmrahBooking ? (packageData?.TripInfo?.returning_date || '') : isGroupTripBooking ? (packageData?.TripInfo?.returning_date || '') : '',
    departure_time: isUmrahBooking ? (packageData?.TripInfo?.departure_time || '') : isGroupTripBooking ? (packageData?.TripInfo?.departure_time || '') : '',
    returning_time: isUmrahBooking ? (packageData?.TripInfo?.returning_time || '') : isGroupTripBooking ? (packageData?.TripInfo?.returning_time || '') : '',
    price: isUmrahBooking ? (packageData?.TripInfo?.price || '') : isGroupTripBooking ? (packageData?.TripInfo?.price || '') : '',
    duration_days: isUmrahBooking ? (packageData?.TripInfo?.duration || '') : isGroupTripBooking ? (packageData?.TripInfo?.duration || '') : '',
    hotel_stars: isUmrahBooking ? (packageData?.TripInfo?.hotel_stars || '') : isGroupTripBooking ? (packageData?.TripInfo?.hotel_stars || '') : '',
    no_hotel_needed: isUmrahBooking ? (packageData?.TripInfo?.no_hotel_needed || false) : isGroupTripBooking ? (packageData?.TripInfo?.no_hotel_needed || false) : false,
    needs_visa_assistance: isUmrahBooking ? (packageData?.needs_visa_assistance || false) : isGroupTripBooking ? (packageData?.needs_visa_assistance || false) : false
  });

  // Payer Info State
  const [payerInfo, setPayerInfo] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    is_traveler: true,
    age: '',
    identity_number: '',
    passport_number: '',
    gender: '',
    booking_notes: ''
  });

  // Travelers State
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [travelers, setTravelers] = useState([]);

  const { loading, error, submitBooking, clearError } = useBookings();

  // Helper function to clean identity numbers (remove non-numeric characters)
  const cleanIdentityNumber = (identityNumber) => {
    if (!identityNumber) return '';
    // Remove all non-numeric characters
    return identityNumber.toString().replace(/[^0-9]/g, '');
  };

  // Handler for identity number input changes
  const handleIdentityNumberChange = (value, isPayer = false, travelerIndex = null) => {
    // Clean the value - keep only numbers
    const cleanedValue = cleanIdentityNumber(value);
    
    if (isPayer) {
      updatePayerInfo('identity_number', cleanedValue);
    } else if (travelerIndex !== null) {
      updateTraveler(travelerIndex, 'identity_number', cleanedValue);
    }
  };

  // Initialize travelers based on number of persons and payer status
  useEffect(() => {
    const totalTravelers = payerInfo.is_traveler ? numberOfPersons - 1 : numberOfPersons;
    const newTravelers = [];
    
    for (let i = 0; i < totalTravelers; i++) {
      newTravelers.push({
        first_name: '',
        last_name: '',
        age: '',
        phone: '',
        identity_number: '',
        passport_number: '',
        gender: ''
      });
    }
    
    setTravelers(newTravelers);
  }, [numberOfPersons, payerInfo.is_traveler]);

  // Form validation compatible with backend
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      // For special bookings (umrah/group), skip validation since fields are pre-filled
      // For normal bookings, validate all trip details
      if (!isSpecialBooking) {
        if (!validateDestinationCountry(bookingInfo.destination_country)) {
          errors.destination_country = 'Destination country is required';
        }
        if (!validateDate(bookingInfo.trip_date)) {
          errors.trip_date = 'Valid trip date is required';
        }
        if (!validateDate(bookingInfo.returning_date)) {
          errors.returning_date = 'Valid return date is required';
        }
        if (!validateTime(bookingInfo.departure_time)) {
          errors.departure_time = 'Valid departure time is required';
        }
        if (!validateTime(bookingInfo.returning_time)) {
          errors.returning_time = 'Valid return time is required';
        }
        if (!validatePrice(bookingInfo.price)) {
          errors.price = 'Valid price is required';
        }
        if (!validateDuration(bookingInfo.duration_days)) {
          errors.duration_days = 'Valid duration is required';
        }
      }
      // For all trip types, hotel selection may be required
      if (!bookingInfo.no_hotel_needed && !bookingInfo.hotel_stars) {
        errors.hotel_stars = 'Please select hotel stars or check "I don\'t need hotel"';
      }
    }

    if (step === 2) {
      if (!validateFirstName(payerInfo.first_name)) {
        errors.first_name = 'Valid first name is required (min 2 characters, letters only)';
      }
      if (!validateLastName(payerInfo.last_name)) {
        errors.last_name = 'Valid last name is required (min 2 characters, letters only)';
      }
      if (!validatePhoneNumber(payerInfo.phone)) {
        errors.phone = 'Valid Algerian phone number is required (10 digits starting with 0)';
      }
      
      if (payerInfo.is_traveler) {
        if (!validateAge(payerInfo.age)) {
          errors.age = 'Valid age is required (1-120)';
        }
        if (!validateIdentityNumber(payerInfo.identity_number)) {
          errors.identity_number = 'Valid identity number is required (min 5 digits, numbers only)';
        }
        if (!validatePassportNumber(payerInfo.passport_number)) {
          errors.passport_number = 'Valid passport number is required (min 6 characters)';
        }
        if (!validateGender(payerInfo.gender)) {
          errors.gender = 'Gender is required';
        }
      }
    }

    if (step === 3) {
      travelers.forEach((traveler, index) => {
        if (!validateFirstName(traveler.first_name)) {
          errors[`traveler_${index}_first_name`] = `Traveler ${index + 1} valid first name is required (min 2 characters, letters only)`;
        }
        if (!validateLastName(traveler.last_name)) {
          errors[`traveler_${index}_last_name`] = `Traveler ${index + 1} valid last name is required (min 2 characters, letters only)`;
        }
        if (!validateAge(traveler.age)) {
          errors[`traveler_${index}_age`] = `Traveler ${index + 1} valid age is required (1-120)`;
        }
        if (!validatePhoneNumber(traveler.phone)) {
          errors[`traveler_${index}_phone`] = `Traveler ${index + 1} valid Algerian phone number is required (10 digits starting with 0)`;
        }
        if (!validateIdentityNumber(traveler.identity_number)) {
          errors[`traveler_${index}_identity_number`] = `Traveler ${index + 1} valid identity number is required (min 5 digits, numbers only)`;
        }
        if (!validatePassportNumber(traveler.passport_number)) {
          errors[`traveler_${index}_passport_number`] = `Traveler ${index + 1} valid passport number is required (min 6 characters)`;
        }
        if (!validateGender(traveler.gender)) {
          errors[`traveler_${index}_gender`] = `Traveler ${index + 1} gender is required`;
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateBookingInfo = (field, value) => {
    setBookingInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updatePayerInfo = (field, value) => {
    setPayerInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateTraveler = (index, field, value) => {
    setTravelers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    // Clear error when user starts typing
    const errorKey = `traveler_${index}_${field}`;
    if (formErrors[errorKey]) {
      setFormErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    const formatTime = (timeString) => {
      if (!timeString) return '';
      if (timeString.includes(':') && timeString.split(':').length === 3) {
        return timeString.substring(0, 5); 
      }
      return timeString; 
    };

    const bookingData = {
      type: isUmrahBooking ? 'umrah' : isGroupTripBooking ? 'guided_trip' : 'normal',
      
      price: Number(bookingInfo.price) || 0,
      
      trip_date: bookingInfo.trip_date,
      returning_date: bookingInfo.returning_date || bookingInfo.trip_date,
      
      departure_time: formatTime(bookingInfo.departure_time),
      returning_time: formatTime(bookingInfo.returning_time),
      
      destination_country: bookingInfo.destination_country,
      destination_city: bookingInfo.destination_city || '',
      
      no_hotel_needed: bookingInfo.no_hotel_needed,
      hotel_stars: bookingInfo.no_hotel_needed ? null : bookingInfo.hotel_stars,
      
      duration_days: Number(bookingInfo.duration_days) || 7,
      needs_visa_assistance: bookingInfo.needs_visa_assistance,
      booking_status: 'pending',
      
      user_id: JSON.parse(localStorage.getItem('user'))?.id || JSON.parse(localStorage.getItem('user'))?.user_id,
      
      branch_id: null,
      guide_id: null,

      ...(isUmrahBooking && packageData && {
        package_info: {
          package_id: packageData.id || packageData._id,
          package_type: packageData.type || 'standard',
          package_name: packageData.name || 'Umrah Package',
          ...(packageData.TripInfo && {
            duration: packageData.TripInfo.duration,
            included_services: packageData.TripInfo.included_services || []
          })
        }
      }),

      ...(isGroupTripBooking && packageData && {
        group_trip_info: {
          group_trip_id: packageData.id || packageData._id,
          trip_name: packageData.name || packageData.TripInfo?.destination_city || 'Group Trip',
          ...(packageData.TripInfo && {
            guide_included: packageData.TripInfo.guide_included || false,
            max_participants: packageData.TripInfo.max_participants,
            current_participants: packageData.TripInfo.current_participants
          })
        }
      }),

      payer_info: {
        first_name: payerInfo.first_name,
        last_name: payerInfo.last_name,
        phone: payerInfo.phone,
        is_traveler: payerInfo.is_traveler,
        confirmed_at: null,
        canceled_at: null,
        booking_notes: payerInfo.booking_notes || `Booking for ${numberOfPersons} persons`,
        ...(payerInfo.is_traveler && {
          age: Number(payerInfo.age) || null,
          identity_number: cleanIdentityNumber(payerInfo.identity_number) || '',
          passport_number: payerInfo.passport_number || '',
          gender: payerInfo.gender || ''
        })
      },

      travelers_info: travelers.map(traveler => ({
        first_name: traveler.first_name,
        last_name: traveler.last_name,
        age: Number(traveler.age) || null,
        identity_number: cleanIdentityNumber(traveler.identity_number) || '',
        travler_contact: traveler.phone,
        passport_number: traveler.passport_number,
        gender: traveler.gender
      }))
    };

    console.log('Submitting booking data:', bookingData);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || (!user.id && !user.user_id)) {
      setError('You must be logged in to create a booking');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    try {
      await submitBooking(bookingData);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/'); 
      }, 3000);
    } catch (err) {
      console.error('Booking submission failed:', err);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your booking has been created successfully. You will be redirected to the home page shortly.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Trip Details' },
    { number: 2, title: 'Payer Info' },
    { number: 3, title: 'Travelers' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isUmrahBooking ? 'Umrah Booking' : isGroupTripBooking ? 'Guided Trip Booking' : 'Create New Booking'}
          </h1>
          <p className="text-gray-600">
            {isUmrahBooking ? 'Complete your spiritual journey' : isGroupTripBooking ? 'Join an amazing guided adventure' : 'Fill in the details below to create your travel booking'}
          </p>
        </div>

        {/* Package/Group Trip Info Display */}
        {isUmrahBooking && packageData && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2 bg-blue-50 rounded-xl px-4 py-3">
                <Plane className="w-5 h-5 text-[#117BB8]" />
                <p className="text-[#117BB8] font-semibold">Umrah Package</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-center gap-2 bg-blue-50 rounded-xl px-4 py-3">
                  <Package className="w-5 h-5 text-[#495057]" />
                  <p className="text-[#495057]">{packageData.type || 'Premium'} Package</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isGroupTripBooking && packageData && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2 bg-blue-50 rounded-xl px-4 py-3">
                <Users className="w-5 h-5 text-[#117BB8]" />
                <p className="text-[#117BB8] font-semibold">Guided Trip</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-center gap-2 bg-blue-50 rounded-xl px-4 py-3">
                  <Map className="w-5 h-5 text-[#495057]" />
                  <p className="text-[#495057]">{packageData.TripInfo?.destination_city || packageData.TripInfo?.destination_country}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                } font-semibold`}>
                  {step.number}
                </div>
                <span className={`ml-3 font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-6 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
              <button onClick={clearError} className="text-red-500 hover:text-red-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Step 1: Booking Information - Always show, but read-only for special bookings */}
          {currentStep === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Details</h2>
              
              {isSpecialBooking && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">ℹ️ This trip information is pre-filled from your selected package. Please review the details below.</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination Country *</label>
                  <input
                    type="text"
                    value={bookingInfo.destination_country}
                    onChange={(e) => updateBookingInfo('destination_country', e.target.value)}
                    disabled={isSpecialBooking}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.destination_country ? 'border-red-500' : 'border-gray-300'
                    } ${isSpecialBooking ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                    placeholder="Enter destination country"
                    required
                  />
                  {formErrors.destination_country && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.destination_country}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination City</label>
                  <input
                    type="text"
                    value={bookingInfo.destination_city}
                    onChange={(e) => updateBookingInfo('destination_city', e.target.value)}
                    disabled={isSpecialBooking}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 ${isSpecialBooking ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                    placeholder="Enter destination city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trip Date *</label>
                  <input
                    type="date"
                    value={bookingInfo.trip_date}
                    onChange={(e) => updateBookingInfo('trip_date', e.target.value)}
                    disabled={isSpecialBooking}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.trip_date ? 'border-red-500' : 'border-gray-300'
                    } ${isSpecialBooking ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                    required
                  />
                  {formErrors.trip_date && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.trip_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return Date *</label>
                  <input
                    type="date"
                    value={bookingInfo.returning_date}
                    onChange={(e) => updateBookingInfo('returning_date', e.target.value)}
                    disabled={isSpecialBooking}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.returning_date ? 'border-red-500' : 'border-gray-300'
                    } ${isSpecialBooking ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                    required
                  />
                  {formErrors.returning_date && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.returning_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time *</label>
                  <input
                    type="time"
                    value={bookingInfo.departure_time}
                    onChange={(e) => updateBookingInfo('departure_time', e.target.value)}
                    disabled={isSpecialBooking}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.departure_time ? 'border-red-500' : 'border-gray-300'
                    } ${isSpecialBooking ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                    required
                  />
                  {formErrors.departure_time && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.departure_time}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return Time *</label>
                  <input
                    type="time"
                    value={bookingInfo.returning_time}
                    onChange={(e) => updateBookingInfo('returning_time', e.target.value)}
                    disabled={isSpecialBooking}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.returning_time ? 'border-red-500' : 'border-gray-300'
                    } ${isSpecialBooking ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                    required
                  />
                  {formErrors.returning_time && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.returning_time}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (Budget) *</label>
                  <input
                    type="number"
                    value={bookingInfo.price}
                    onChange={(e) => updateBookingInfo('price', e.target.value)}
                    disabled={isSpecialBooking}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.price ? 'border-red-500' : 'border-gray-300'
                    } ${isSpecialBooking ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days) *</label>
                  <input
                    type="number"
                    value={bookingInfo.duration_days}
                    onChange={(e) => updateBookingInfo('duration_days', e.target.value)}
                    disabled={isSpecialBooking}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.duration_days ? 'border-red-500' : 'border-gray-300'
                    } ${isSpecialBooking ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                    placeholder="7"
                    min="1"
                    required
                  />
                  {formErrors.duration_days && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.duration_days}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Rating</label>
                  <select
                    value={bookingInfo.hotel_stars}
                    onChange={(e) => updateBookingInfo('hotel_stars', e.target.value)}
                    disabled={bookingInfo.no_hotel_needed || isSpecialBooking}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${isSpecialBooking ? 'opacity-60' : ''}`}
                  >
                    <option value="">Select rating</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  <div className="flex flex-col space-y-3">
                    <label className={`flex items-center space-x-3 ${isSpecialBooking ? 'opacity-60 cursor-not-allowed' : ''}`}>
                      <input
                        type="checkbox"
                        checked={bookingInfo.no_hotel_needed}
                        onChange={(e) => updateBookingInfo('no_hotel_needed', e.target.checked)}
                        disabled={isSpecialBooking}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                      />
                      <span className="text-gray-700">No Hotel Needed</span>
                    </label>
                    
                    <label className={`flex items-center space-x-3 ${isSpecialBooking ? 'opacity-60 cursor-not-allowed' : ''}`}>
                      <input
                        type="checkbox"
                        checked={bookingInfo.needs_visa_assistance}
                        onChange={(e) => updateBookingInfo('needs_visa_assistance', e.target.checked)}
                        disabled={isSpecialBooking}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                      />
                      <span className="text-gray-700">Need Visa Assistance</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleNextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105"
                >
                  Continue to Payer Info
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payer Information */}
          {currentStep === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payer Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={payerInfo.first_name}
                    onChange={(e) => updatePayerInfo('first_name', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                    required
                  />
                  {formErrors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={payerInfo.last_name}
                    onChange={(e) => updatePayerInfo('last_name', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                    required
                  />
                  {formErrors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={payerInfo.phone}
                    onChange={(e) => updatePayerInfo('phone', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 0551234567"
                    required
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Booking Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Notes</label>
                <textarea
                  value={payerInfo.booking_notes}
                  onChange={(e) => updatePayerInfo('booking_notes', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Any special requests or preferences..."
                />
              </div>

              {/* Payer Traveler Details */}
              {payerInfo.is_traveler && (
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Traveler Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                      <input
                        type="number"
                        value={payerInfo.age}
                        onChange={(e) => updatePayerInfo('age', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.age ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter age"
                        min="1"
                        max="120"
                        required
                      />
                      {formErrors.age && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.age}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Identity Number *</label>
                      <input
                        type="text"
                        value={payerInfo.identity_number}
                        onChange={(e) => handleIdentityNumberChange(e.target.value, true)}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.identity_number ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter numbers only (min 5 digits)"
                        required
                      />
                      {formErrors.identity_number && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.identity_number}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number *</label>
                      <input
                        type="text"
                        value={payerInfo.passport_number}
                        onChange={(e) => updatePayerInfo('passport_number', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.passport_number ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Min 6 characters"
                        required
                      />
                      {formErrors.passport_number && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.passport_number}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                      <select
                        value={payerInfo.gender}
                        onChange={(e) => updatePayerInfo('gender', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.gender ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {formErrors.gender && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.gender}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Traveler Option */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <label className="block text-lg font-medium text-gray-900 mb-4">Are you traveling?</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => updatePayerInfo('is_traveler', true)}
                    className={`flex-1 py-4 rounded-xl border-2 transition duration-200 ${
                      payerInfo.is_traveler 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg transform scale-105' 
                        : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">Yes, I'm traveling</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => updatePayerInfo('is_traveler', false)}
                    className={`flex-1 py-4 rounded-xl border-2 transition duration-200 ${
                      !payerInfo.is_traveler 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg transform scale-105' 
                        : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="font-medium">No, I'm not traveling</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Number of Persons */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Number of Persons *</label>
                <select
                  value={numberOfPersons}
                  onChange={(e) => setNumberOfPersons(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'persons'}</option>
                  ))}
                </select>
                {payerInfo.is_traveler && (
                  <p className="mt-2 text-sm text-gray-600">
                    Including you as one traveler
                  </p>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePreviousStep}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-lg transition duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105"
                >
                  Continue to Travelers
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Travelers Information */}
          {currentStep === 3 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Travelers Information</h2>
              
              {travelers.map((traveler, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 mb-6 bg-white shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    Traveler {index + 1}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        value={traveler.first_name}
                        onChange={(e) => updateTraveler(index, 'first_name', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors[`traveler_${index}_first_name`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter first name"
                        required
                      />
                      {formErrors[`traveler_${index}_first_name`] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[`traveler_${index}_first_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={traveler.last_name}
                        onChange={(e) => updateTraveler(index, 'last_name', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors[`traveler_${index}_last_name`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter last name"
                        required
                      />
                      {formErrors[`traveler_${index}_last_name`] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[`traveler_${index}_last_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                      <input
                        type="number"
                        value={traveler.age}
                        onChange={(e) => updateTraveler(index, 'age', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors[`traveler_${index}_age`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter age"
                        min="1"
                        max="120"
                        required
                      />
                      {formErrors[`traveler_${index}_age`] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[`traveler_${index}_age`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        value={traveler.phone}
                        onChange={(e) => updateTraveler(index, 'phone', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors[`traveler_${index}_phone`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 0551234567"
                        required
                      />
                      {formErrors[`traveler_${index}_phone`] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[`traveler_${index}_phone`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Identity Number *</label>
                      <input
                        type="text"
                        value={traveler.identity_number}
                        onChange={(e) => handleIdentityNumberChange(e.target.value, false, index)}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors[`traveler_${index}_identity_number`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter numbers only (min 5 digits)"
                        required
                      />
                      {formErrors[`traveler_${index}_identity_number`] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[`traveler_${index}_identity_number`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number *</label>
                      <input
                        type="text"
                        value={traveler.passport_number}
                        onChange={(e) => updateTraveler(index, 'passport_number', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors[`traveler_${index}_passport_number`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Min 6 characters"
                        required
                      />
                      {formErrors[`traveler_${index}_passport_number`] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[`traveler_${index}_passport_number`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                      <select
                        value={traveler.gender}
                        onChange={(e) => updateTraveler(index, 'gender', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors[`traveler_${index}_gender`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {formErrors[`traveler_${index}_gender`] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[`traveler_${index}_gender`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {travelers.length === 0 && payerInfo.is_traveler && (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <p className="text-gray-600 text-lg">No additional travelers to add. You are the only traveler.</p>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePreviousStep}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-lg transition duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Booking...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Create Booking</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}