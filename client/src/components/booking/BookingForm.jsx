// BookingForm.jsx
import { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import {
  MapPin, Hotel, User, Phone, Mail, MapPinned,
  Users, Plane, Package, Calendar as CalendarIcon, Map
} from 'lucide-react';
import DatePicker from './DatePicker.jsx';
import TimePicker from './TimePicker.jsx';

export default function BookingForm() {
  const location = useLocation();
  const { packageData, isUmrah, isGroupTrip, groupTripData } = location.state || {};

  // Booking type flags
  const isUmrahBooking = isUmrah === true;
  const isGroupTripBooking = isGroupTrip === true;
  const isSpecialBooking = isUmrahBooking || isGroupTripBooking;

  // Step state: if it's a special booking, we start on step 2 (payer info)
  const [currentStep, setCurrentStep] = useState(isSpecialBooking ? 2 : 1);

  // Step 1 - destination / trip (NORMAL trips use these inputs; Umrah/Group use package/group data)
  const [destinationCountry, setDestinationCountry] = useState(
    isUmrahBooking ? 'Saudi Arabia' : isGroupTripBooking ? (groupTripData?.destination || '') : ''
  );
  const [destinationCity, setDestinationCity] = useState(
    isUmrahBooking ? 'Mecca' : isGroupTripBooking ? (groupTripData?.city || '') : ''
  );

  // Keep hotel/visa fields (you selected Option 1)
  const [hotelStars, setHotelStars] = useState('');
  const [noHotelNeeded, setNoHotelNeeded] = useState(false);
  const [needsVisaAssistance, setNeedsVisaAssistance] = useState(false);

  // New trip fields for NORMAL trips (Option B -> only normal trips use these)
  const [tripDate, setTripDate] = useState(''); // single start date
  const [durationDays, setDurationDays] = useState(''); // number input for number of days
  const [departureTime, setDepartureTime] = useState(''); // time picker (string like "12 AM")
  const [returnTime, setReturnTime] = useState(''); // time picker
  const [budgetDA, setBudgetDA] = useState(''); // numeric budget in Algerian Dinar

  // Step 2 - payer info (payer fields)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [dayOfMeet, setDayOfMeet] = useState('');
  const [timeOfMeet, setTimeOfMeet] = useState('');
  const [isTraveler, setIsTraveler] = useState(true);

  // Number of persons and travelers array
  const [numberOfPersons, setNumberOfPersons] = useState('');
  const [travelers, setTravelers] = useState([]);

  const [errors, setErrors] = useState({});

  // refs to avoid overwriting user typing when not intended
  const isInitialMount = useRef(true);
  const lastNumberOfPersons = useRef(numberOfPersons);
  const lastIsTraveler = useRef(isTraveler);

  const today = new Date().toISOString().split('T')[0];
  const oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    .toISOString()
    .split('T')[0];

  const wilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
    'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
    'Constantine', 'Médéa', 'Mostaganem', 'MSila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arreridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane'
  ];

  // Phone formatting handlers
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    setPhoneNumber(limited);
  };

  const handleTravelerPhoneNumberChange = (index, e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    updateTraveler(index, 'phoneNumber', limited);
  };

  // Update single traveler field
  const updateTraveler = (index, field, value) => {
    setTravelers(prev => {
      const next = [...prev];
      next[index] = { ...(next[index] || {}), [field]: value };
      return next;
    });
  };

  // Validation helpers
  const validateName = (name, fieldName) => {
    if (!name || !name.trim()) return `${fieldName} is required`;
    if (name.trim().length < 2) return `${fieldName} must be at least 2 characters`;
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) return `${fieldName} can only contain letters, spaces, hyphens and apostrophes`;
    return null;
  };

  const validatePhoneNumber = (phone) => {
    if (!phone || !phone.trim()) return 'Phone number is required';
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!/^0\d{9}$/.test(cleanPhone)) return 'Phone number must start with 0 and be exactly 10 digits';
    return null;
  };

  // Sync travelers array size and auto-fill payer -> traveler 0 when needed.
  useEffect(() => {
    // Skip on initial mount (we don't want to run logic until user interacts)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      lastNumberOfPersons.current = numberOfPersons;
      lastIsTraveler.current = isTraveler;
      return;
    }

    // Only proceed if numberOfPersons or isTraveler actually changed
    if (numberOfPersons !== lastNumberOfPersons.current || isTraveler !== lastIsTraveler.current) {
      lastNumberOfPersons.current = numberOfPersons;
      lastIsTraveler.current = isTraveler;

      if (numberOfPersons) {
        const numPersons = parseInt(numberOfPersons, 10) || 0;
        const newTravelers = [];
        for (let i = 0; i < numPersons; i++) {
          // If payer is a traveler, put payer into travelers[0]
          if (isTraveler && i === 0) {
            newTravelers.push({
              firstName: firstName || '',
              lastName: lastName || '',
              age: '', // intentionally left empty for payer (user can fill)
              identityNumber: '', // intentionally left empty
              phoneNumber: phoneNumber || '',
              passportNumber: '',
              gender: '',
              email: email || ''
            });
          } else {
            // preserve existing if available, otherwise empty template
            const existing = travelers[i];
            newTravelers.push({
              firstName: existing?.firstName || '',
              lastName: existing?.lastName || '',
              age: existing?.age || '',
              identityNumber: existing?.identityNumber || '',
              phoneNumber: existing?.phoneNumber || '',
              passportNumber: existing?.passportNumber || '',
              gender: existing?.gender || '',
              email: existing?.email || ''
            });
          }
        }
        setTravelers(newTravelers);
      } else {
        setTravelers([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfPersons, isTraveler]);

  // When payer fields change and payer is traveling, sync them to travelers[0]
  useEffect(() => {
    if (!isTraveler) return;
    // ensure there's at least one traveler slot
    setTravelers(prev => {
      if (prev.length === 0) {
        return [{
          firstName: firstName || '',
          lastName: lastName || '',
          age: '',
          identityNumber: '',
          phoneNumber: phoneNumber || '',
          passportNumber: '',
          gender: '',
          email: email || ''
        }];
      } else {
        // update first traveler with payer fields (firstName, lastName, phoneNumber) but DO NOT overwrite age/identity/passport/gender
        const next = [...prev];
        const first = next[0] || {};
        next[0] = {
          ...first,
          firstName: firstName || '',
          lastName: lastName || '',
          phoneNumber: phoneNumber || '',
          // keep existing age/identity/passport/gender as-is (user can fill)
          age: first.age || '',
          identityNumber: first.identityNumber || '',
          passportNumber: first.passportNumber || '',
          gender: first.gender || '',
          email: email || ''
        };
        return next;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, lastName, phoneNumber, isTraveler, email]);

  // Validation per-step
  const validateStep1 = () => {
    const newErrors = {};

    // For special bookings (umrah/group) we do not require normal trip fields.
    if (!isSpecialBooking) {
      if (!destinationCountry || !destinationCountry.trim()) newErrors.destinationCountry = 'Please enter destination country';
      // destinationCity is optional for normal trips (per your request) — do not require it

      // Trip date & duration & times & budget validation (normal trips only)
      if (!tripDate) newErrors.tripDate = 'Please select the trip start date';
      if (!durationDays) newErrors.durationDays = 'Please enter the trip duration in days';
      else {
        const num = parseInt(durationDays, 10);
        if (isNaN(num) || num < 1) newErrors.durationDays = 'Duration must be at least 1 day';
        else if (num > 365) newErrors.durationDays = 'Duration seems too long';
      }

      if (!departureTime) newErrors.departureTime = 'Please select a departure time';
      if (!returnTime) newErrors.returnTime = 'Please select a return time';

      if (!noHotelNeeded && !hotelStars) newErrors.hotelStars = 'Please select hotel stars or check "I don\'t need hotel"';
      if (budgetDA === '' || budgetDA === null) newErrors.budgetDA = 'Please enter your budget in DA';
      else {
        const b = Number(budgetDA);
        if (isNaN(b) || b < 0) newErrors.budgetDA = 'Budget must be a positive number';
      }

      // Optional date sanity: tripDate not in past
      if (tripDate && tripDate < today) newErrors.tripDate = 'Trip date cannot be in the past';
      if (tripDate && tripDate > oneYearFromNow) newErrors.tripDate = 'Trip date cannot be more than one year in the future';
    } else {
      // For Umrah/Group trips, we may still require hotel selection depending on your choices
      if (!noHotelNeeded && !hotelStars) newErrors.hotelStars = 'Please select hotel stars or check "I don\'t need hotel"';
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
      const ageNum = parseInt(age, 10);
      if (ageNum < 18) newErrors.age = 'Payer must be at least 18 years old';
      else if (ageNum > 120) newErrors.age = 'Please enter a valid age';
    }

    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;

    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

    if (!wilaya) newErrors.wilaya = 'Please select a wilaya';
    if (!dayOfMeet) newErrors.dayOfMeet = 'Day of meet is required';
    if (!timeOfMeet) newErrors.timeOfMeet = 'Time of meet is required';
    if (!numberOfPersons) newErrors.numberOfPersons = 'Number of persons is required';
    else if (parseInt(numberOfPersons, 10) < 1) newErrors.numberOfPersons = 'At least 1 person is required';

    // Validate travelers
    travelers.forEach((traveler, index) => {
      const travelerFirstNameError = validateName(traveler.firstName || '', 'First name');
      if (travelerFirstNameError) newErrors[`traveler${index}FirstName`] = travelerFirstNameError;

      const travelerLastNameError = validateName(traveler.lastName || '', 'Last name');
      if (travelerLastNameError) newErrors[`traveler${index}LastName`] = travelerLastNameError;

      // If payer is traveling and this is traveler 0 (payer), we DO NOT require age/identity/passport/gender (user can fill them)
      const isPayerSlot = isTraveler && index === 0;
      if (!isPayerSlot) {
        if (!traveler.age) {
          newErrors[`traveler${index}Age`] = 'Age is required';
        } else if (parseInt(traveler.age, 10) < 1 || parseInt(traveler.age, 10) > 120) {
          newErrors[`traveler${index}Age`] = 'Please enter a valid age';
        }

        if (!traveler.identityNumber) {
          newErrors[`traveler${index}Identity`] = 'Identity number is required';
        }
      }

      const travelerPhoneError = validatePhoneNumber(traveler.phoneNumber || '');
      if (travelerPhoneError) newErrors[`traveler${index}PhoneNumber`] = travelerPhoneError;

      if (!traveler.email || !traveler.email.trim()) {
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

  // Submit handler - composes payload and posts
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    try {
      // Build destination/trip payload depending on booking type
      let destinationPayload = {};
      let tripPayload = {};

      if (isUmrahBooking) {
        destinationPayload = {
          country: 'Saudi Arabia',
          city: packageData?.city || 'Mecca'
        };
        tripPayload = {
          packageType: packageData || null,
          dates: packageData?.dates || null
        };
      } else if (isGroupTripBooking) {
        destinationPayload = {
          country: groupTripData?.country || '',
          city: groupTripData?.city || groupTripData?.destination || ''
        };
        tripPayload = {
          groupInfo: groupTripData || null
        };
      } else {
        destinationPayload = {
          country: destinationCountry,
          city: destinationCity || null
        };
        tripPayload = {
          tripDate,
          durationDays: durationDays ? parseInt(durationDays, 10) : null,
          departureTime,
          returnTime,
          hotelStars: noHotelNeeded ? null : hotelStars,
          noHotelNeeded,
          needsVisaAssistance,
          budgetDA: budgetDA ? Number(budgetDA) : null
        };
      }

      const bookingData = {
        type: isUmrahBooking ? 'umrah' : isGroupTripBooking ? 'group' : 'normal',
        packageInfo: packageData || null,
        groupTripInfo: groupTripData || null,
        destination: destinationPayload,
        trip: tripPayload,
        payer: {
          firstName,
          lastName,
          age: parseInt(age, 10),
          phoneNumber,
          email,
          wilaya,
          dayOfMeet,
          timeOfMeet,
          isTraveler
        },
        travelers: travelers.map(t => ({
          firstName: t.firstName || null,
          lastName: t.lastName || null,
          age: t.age ? parseInt(t.age, 10) : null,
          identityNumber: t.identityNumber || null,
          phoneNumber: t.phoneNumber || null,
          passportNumber: t.passportNumber || null,
          gender: t.gender || null,
          email: t.email || null
        })),
        numberOfPersons: parseInt(numberOfPersons, 10) || 0,
        booking_status: 'pending'
      };

      // Example POST - adjust URL as needed
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const result = await response.json();

      if (result?.status === 'success' || response.ok) {
        alert('Booking submitted successfully!');
        // Optionally reset form or redirect
      } else {
        alert(`Failed to submit booking: ${result?.message || result?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Booking submission error', err);
      alert('Failed to submit booking. See console for details.');
    }
  };

  // Simple UI helpers
  const getBookingTitle = () => {
    if (isUmrahBooking) return 'Umrah Booking Form';
    if (isGroupTripBooking) return 'Group Trip Booking Form';
    return 'Destination Booking Form';
  };
  const getBookingSubtitle = () => {
    if (isUmrahBooking) return 'Complete your spiritual journey booking';
    if (isGroupTripBooking) return 'Join an amazing group adventure';
    return 'Plan your perfect getaway with us';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="text-gray-800 mb-3 text-3xl font-bold">{getBookingTitle()}</h1>
        <p className="text-gray-600 mb-8">{getBookingSubtitle()}</p>

        {isUmrahBooking && packageData && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2 bg-[#f1f9fe] rounded-xl px-4 py-3">
                <Plane className="w-5 h-5 text-[#495057]" />
                <p className="text-[#495057]">Umrah</p>
              </div>
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

        {isGroupTripBooking && groupTripData && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2 bg-[#f1f9fe] rounded-xl px-4 py-3">
                <Users className="w-5 h-5 text-[#495057]" />
                <p className="text-[#495057] font-semibold">Group Trip</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-center gap-2 bg-[#f1f9fe] rounded-xl px-4 py-3">
                  <Map className="w-5 h-5 text-[#495057]" />
                  <p className="text-[#495057]">{groupTripData.destination}</p>
                </div>
                <div className="flex items-center justify-center gap-2 bg-[#f1f9fe] rounded-xl px-4 py-3">
                  <CalendarIcon className="w-5 h-5 text-[#495057]" />
                  <p className="text-[#495057]">{groupTripData.date}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100">
        {/* Step 1 */}
        {currentStep === 1 && (
          <form onSubmit={handleNextStep} className="space-y-6">
            <div className="mb-8">
              <h2 className="text-[#117BB8] mb-2 text-2xl font-semibold">Trip Details</h2>
              <p className="text-gray-500">Tell us about your trip</p>
            </div>

            {/* Destination inputs: for normal trips we show text inputs; for Umrah/Group we display package/group info above and do not show these inputs */}
            {!isSpecialBooking && (
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-gray-700 mb-2 font-medium">Destination Country <span className="text-red-500">*</span></label>
                  <MapPin className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="text"
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    placeholder="e.g. France"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${errors.destinationCountry ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                  />
                  {errors.destinationCountry && <p className="text-red-500 text-sm mt-2">{errors.destinationCountry}</p>}
                </div>

                <div className="relative">
                  <label className="block text-gray-700 mb-2 font-medium">Destination City <span className="text-gray-400">(optional)</span></label>
                  <MapPin className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="text"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    placeholder="e.g. Paris (optional)"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}
                  />
                </div>
              </div>
            )}

            {/* Trip date / duration / times (normal trips only) */}
            {!isSpecialBooking && (
              <div className="grid sm:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-gray-700 mb-2">Trip Date (Start) <span className="text-red-500">*</span></label>
                  <DatePicker value={tripDate} onChange={setTripDate} placeholder="Select trip start date" min={today} max={oneYearFromNow} error={!!errors.tripDate} />
                  {errors.tripDate && <p className="text-red-500 text-sm mt-2">{errors.tripDate}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Duration (days) <span className="text-red-500">*</span></label>
                  <input type="number" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} min="1" max="365" placeholder="e.g. 7" className={`w-full pl-4 pr-4 py-4 rounded-xl bg-gray-50 border ${errors.durationDays ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] transition-all`} />
                  {errors.durationDays && <p className="text-red-500 text-sm mt-2">{errors.durationDays}</p>}
                </div>
              </div>
            )}

            {!isSpecialBooking && (
              <div className="grid sm:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-gray-700 mb-2">Departure Time <span className="text-red-500">*</span></label>
                  <TimePicker value={departureTime} onChange={setDepartureTime} placeholder="Select departure time" error={!!errors.departureTime} />
                  {errors.departureTime && <p className="text-red-500 text-sm mt-2">{errors.departureTime}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Return Time <span className="text-red-500">*</span></label>
                  <TimePicker value={returnTime} onChange={setReturnTime} placeholder="Select return time" error={!!errors.returnTime} />
                  {errors.returnTime && <p className="text-red-500 text-sm mt-2">{errors.returnTime}</p>}
                </div>
              </div>
            )}

            {/* Budget field for normal trips */}
            {!isSpecialBooking && (
              <div className="mt-4">
                <label className="block text-gray-700 mb-2">Budget (DA) <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-3">
                  <input type="number" value={budgetDA} onChange={(e) => setBudgetDA(e.target.value)} min="0" placeholder="e.g. 50000" className={`w-full pl-4 pr-4 py-4 rounded-xl bg-gray-50 border ${errors.budgetDA ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] transition-all`} />
                  <span className="text-gray-600">DA</span>
                </div>
                {errors.budgetDA && <p className="text-red-500 text-sm mt-2">{errors.budgetDA}</p>}
              </div>
            )}

            {/* Hotel & Visa options (kept per Option 1) */}
            <div className="grid sm:grid-cols-2 gap-6 mt-4">
              <div className="relative">
                <label className="block text-gray-700 mb-2 font-medium">Hotel Rating {!noHotelNeeded && <span className="text-red-500">*</span>}</label>
                <Hotel className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  value={hotelStars}
                  onChange={(e) => setHotelStars(e.target.value)}
                  disabled={noHotelNeeded}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${errors.hotelStars ? 'border-red-500' : 'border-gray-200'} text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <option value="">Select rating</option>
                  <option value="3">★★★ 3 Stars</option>
                  <option value="4">★★★★ 4 Stars</option>
                  <option value="5">★★★★★ 5 Stars</option>
                </select>
                {errors.hotelStars && !noHotelNeeded && <p className="text-red-500 text-sm mt-2">{errors.hotelStars}</p>}
              </div>

              <div className="flex flex-col gap-4">
                <label className="block text-gray-700 mb-2 font-medium">Additional Options</label>
                <label className="flex items-center bg-gray-50 px-5 py-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-[#117BB8] transition-all group">
                  <input type="checkbox" checked={noHotelNeeded} onChange={(e) => setNoHotelNeeded(e.target.checked)} className="mr-3 w-5 h-5 text-[#117BB8] rounded focus:ring-2 focus:ring-[#117BB8] cursor-pointer" />
                  <span className="text-gray-700 group-hover:text-[#117BB8] transition-colors">I don't need a hotel</span>
                </label>

                <label className="flex items-center bg-gray-50 px-5 py-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-[#117BB8] transition-all group">
                  <input type="checkbox" checked={needsVisaAssistance} onChange={(e) => setNeedsVisaAssistance(e.target.checked)} className="mr-3 w-5 h-5 text-[#117BB8] rounded focus:ring-2 focus:ring-[#117BB8] cursor-pointer" />
                  <span className="text-gray-700 group-hover:text-[#117BB8] transition-colors">I need visa assistance</span>
                </label>
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" className="w-full bg-gradient-to-r from-[#117BB8] to-[#0f6da4] hover:from-[#0f6da4] hover:to-[#0d5f92] text-white py-5 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Continue to Payer Information →
              </button>
            </div>
          </form>
        )}

        {/* Step 2 - Payer & Travelers */}
        {currentStep === 2 && (
          <div>
            {!isUmrahBooking && (
              <div className="mb-8">
                <button onClick={() => setCurrentStep(1)} className="text-[#117BB8] hover:text-[#0f6da4] transition-colors flex items-center gap-2 mb-4">← Back to trip details</button>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-[#117BB8] mb-2">Payer Information</h2>
              <p className="text-gray-500">Provide details about the person making the booking</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payer Row 1 */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="relative">
                  <label className="block text-gray-700 mb-2">First Name <span className="text-red-500">*</span></label>
                  <User className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${errors.firstName ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`} />
                  {errors.firstName && <p className="text-red-500 text-sm mt-2">{errors.firstName}</p>}
                </div>

                <div className="relative">
                  <label className="block text-gray-700 mb-2">Last Name <span className="text-red-500">*</span></label>
                  <User className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${errors.lastName ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`} />
                  {errors.lastName && <p className="text-red-500 text-sm mt-2">{errors.lastName}</p>}
                </div>

                <div className="relative">
                  <label className="block text-gray-700 mb-2">Age <span className="text-red-500">*</span></label>
                  <User className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="18+" min="18" max="120" className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${errors.age ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`} />
                  {errors.age && <p className="text-red-500 text-sm mt-2">{errors.age}</p>}
                </div>
              </div>

              {/* Payer Row 2 */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="relative">
                  <label className="block text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <Phone className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} placeholder="0XXXXXXXXX" className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`} />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-2">{errors.phoneNumber}</p>}
                </div>

                <div className="relative">
                  <label className="block text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                  <Mail className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`} />
                  {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                </div>

                <div className="relative">
                  <label className="block text-gray-700 mb-2">Wilaya <span className="text-red-500">*</span></label>
                  <MapPinned className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                  <select value={wilaya} onChange={(e) => setWilaya(e.target.value)} className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${errors.wilaya ? 'border-red-500' : 'border-gray-200'} text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}>
                    <option value="">Select wilaya</option>
                    {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  {errors.wilaya && <p className="text-red-500 text-sm mt-2">{errors.wilaya}</p>}
                </div>
              </div>

              {/* Meeting Details */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Meeting Day <span className="text-red-500">*</span></label>
                  <DatePicker value={dayOfMeet} onChange={setDayOfMeet} placeholder="Select meeting date" min={today} max={oneYearFromNow} error={!!errors.dayOfMeet} />
                  {errors.dayOfMeet && <p className="text-red-500 text-sm mt-2">{errors.dayOfMeet}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Meeting Time <span className="text-red-500">*</span></label>
                  <TimePicker value={timeOfMeet} onChange={setTimeOfMeet} placeholder="Select meeting time" error={!!errors.timeOfMeet} />
                  {errors.timeOfMeet && <p className="text-red-500 text-sm mt-2">{errors.timeOfMeet}</p>}
                </div>
              </div>

              {/* Traveler status toggle */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <label className="block text-gray-700 mb-4">Are you a traveler? <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsTraveler(true)} className={`flex-1 px-8 py-4 rounded-xl transition-all ${isTraveler ? 'bg-[#117BB8] text-white shadow-lg transform scale-105' : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#117BB8]'}`}>
                    Yes, I'm traveling
                  </button>
                  <button type="button" onClick={() => setIsTraveler(false)} className={`flex-1 px-8 py-4 rounded-xl transition-all ${!isTraveler ? 'bg-[#117BB8] text-white shadow-lg transform scale-105' : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#117BB8]'}`}>
                    No, I'm not traveling
                  </button>
                </div>
                <p className="text-sm mt-2 text-gray-600">If you are traveling, we'll prefill Traveler 1 with your name & phone. You can still edit passport/identity fields manually.</p>
              </div>

              {/* Number of persons */}
              <div className="relative">
                <label className="block text-gray-700 mb-2">Total Number of Persons <span className="text-red-500">*</span></label>
                <Users className="absolute left-4 bottom-5 text-gray-400 w-5 h-5 pointer-events-none" />
                <select value={numberOfPersons} onChange={(e) => setNumberOfPersons(e.target.value)} className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border ${errors.numberOfPersons ? 'border-red-500' : 'border-gray-200'} text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent focus:bg-white transition-all`}>
                  <option value="">Select number of persons</option>
                  {[...Array(20)].map((_, i) => <option key={i+1} value={i+1}>{i+1} {i+1 === 1 ? 'person' : 'persons'}</option>)}
                </select>
                {errors.numberOfPersons && <p className="text-red-500 text-sm mt-2">{errors.numberOfPersons}</p>}
                {numberOfPersons && <p className="text-gray-600 text-sm mt-2">{`You will fill ${travelers.length} traveler form${travelers.length !== 1 ? 's' : ''}`}</p>}
              </div>

              {/* Travelers forms (all travelers) */}
              {travelers.length > 0 && (
                <div className="space-y-6 mt-8">
                  <div className="border-t-2 border-gray-200 pt-6">
                    <h3 className="text-gray-800 mb-6 flex items-center gap-2"><Users className="w-6 h-6 text-[#117BB8]" /> Travelers Information</h3>
                  </div>

                  {travelers.map((traveler, idx) => {
                    const isPayerSlot = isTraveler && idx === 0;
                    return (
                      <div key={idx} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                        <h4 className="text-gray-700 mb-4">Traveler {idx + 1} {isPayerSlot && <span className="text-sm text-green-600 ml-2">(Payer)</span>}</h4>

                        <div className="space-y-4">
                          <div className="grid sm:grid-cols-3 gap-4">
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                              <input type="text" value={traveler.firstName} onChange={(e) => updateTraveler(idx, 'firstName', e.target.value)} placeholder="First name *" className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${errors[`traveler${idx}FirstName`] ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`} />
                              {errors[`traveler${idx}FirstName`] && <p className="text-red-500 text-xs mt-1">{errors[`traveler${idx}FirstName`]}</p>}
                            </div>

                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                              <input type="text" value={traveler.lastName} onChange={(e) => updateTraveler(idx, 'lastName', e.target.value)} placeholder="Last name *" className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${errors[`traveler${idx}LastName`] ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`} />
                              {errors[`traveler${idx}LastName`] && <p className="text-red-500 text-xs mt-1">{errors[`traveler${idx}LastName`]}</p>}
                            </div>

                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                              <input type="number" value={traveler.age} onChange={(e) => updateTraveler(idx, 'age', e.target.value)} placeholder="Age" min="1" max="120" className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${errors[`traveler${idx}Age`] ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`} />
                              {errors[`traveler${idx}Age`] && <p className="text-red-500 text-xs mt-1">{errors[`traveler${idx}Age`]}</p>}
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                              <input type="tel" value={traveler.phoneNumber} onChange={(e) => handleTravelerPhoneNumberChange(idx, e)} placeholder="Phone number *" className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${errors[`traveler${idx}PhoneNumber`] ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`} />
                              {errors[`traveler${idx}PhoneNumber`] && <p className="text-red-500 text-xs mt-1">{errors[`traveler${idx}PhoneNumber`]}</p>}
                            </div>

                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                              <input type="email" value={traveler.email} onChange={(e) => updateTraveler(idx, 'email', e.target.value)} placeholder="Email *" className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${errors[`traveler${idx}Email`] ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`} />
                              {errors[`traveler${idx}Email`] && <p className="text-red-500 text-xs mt-1">{errors[`traveler${idx}Email`]}</p>}
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-4">
                            <div className="relative">
                              <label className="block text-sm text-gray-600 mb-2">Identity Number {(!isTraveler || idx !== 0) && <span className="text-red-500">*</span>}</label>
                              <input type="text" value={traveler.identityNumber} onChange={(e) => updateTraveler(idx, 'identityNumber', e.target.value)} placeholder={isTraveler && idx === 0 ? 'Leave empty or fill later' : 'Identity number *'} className={`w-full pl-4 pr-4 py-3 rounded-xl bg-white border ${errors[`traveler${idx}Identity`] ? 'border-red-500' : 'border-gray-200'} text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`} />
                              {errors[`traveler${idx}Identity`] && <p className="text-red-500 text-xs mt-1">{errors[`traveler${idx}Identity`]}</p>}
                            </div>

                            <div className="relative">
                              <label className="block text-sm text-gray-600 mb-2">Passport Number</label>
                              <input type="text" value={traveler.passportNumber} onChange={(e) => updateTraveler(idx, 'passportNumber', e.target.value)} placeholder="Passport number" className="w-full pl-4 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all" />
                            </div>

                            <div className="relative">
                              <label className="block text-sm text-gray-600 mb-2">Gender</label>
                              <select value={traveler.gender} onChange={(e) => updateTraveler(idx, 'gender', e.target.value)} className="w-full pl-4 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all">
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-6 grid sm:grid-cols-2 gap-4">
                <button type="button" onClick={() => setCurrentStep(1)} className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl">← Back</button>
                <button type="submit" className="w-full bg-gradient-to-r from-[#117BB8] to-[#0f6da4] text-white py-4 rounded-xl">Submit Booking</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
