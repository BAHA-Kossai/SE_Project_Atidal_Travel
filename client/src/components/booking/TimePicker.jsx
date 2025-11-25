import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function TimePicker({ value, onChange, placeholder, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  const [period, setPeriod] = useState('AM');
  const pickerRef = useRef(null);

  // Initialize state from value
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      const hourNum = parseInt(h);
      const isPM = hourNum >= 12;
      
      setHours(String(hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum).padStart(2, '0'));
      setMinutes(m);
      setPeriod(isPM ? 'PM' : 'AM');
    }
  }, [value]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [h, m] = timeString.split(':');
    const hourNum = parseInt(h);
    const isPM = hourNum >= 12;
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${m} ${isPM ? 'PM' : 'AM'}`;
  };

  const handleSetTime = () => {
    let hour24 = parseInt(hours);
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    const timeString = `${String(hour24).padStart(2, '0')}:${minutes}`;
    onChange(timeString);
    setIsOpen(false);
  };

  const incrementHours = () => {
    const newHours = parseInt(hours) % 12 + 1;
    setHours(String(newHours).padStart(2, '0'));
  };

  const decrementHours = () => {
    const newHours = parseInt(hours) - 1;
    setHours(String(newHours === 0 ? 12 : newHours).padStart(2, '0'));
  };

  const incrementMinutes = () => {
    const newMinutes = (parseInt(minutes) + 1) % 60;
    setMinutes(String(newMinutes).padStart(2, '0'));
  };

  const decrementMinutes = () => {
    const newMinutes = parseInt(minutes) - 1;
    setMinutes(String(newMinutes < 0 ? 59 : newMinutes).padStart(2, '0'));
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div className="relative">
        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          value={formatTime(value)}
          onClick={() => setIsOpen(!isOpen)}
          readOnly
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white border ${
            error ? 'border-red-500' : 'border-gray-200'
          } text-gray-700 placeholder-gray-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-72">
          <div className="flex justify-center items-center gap-4">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={incrementHours}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <div className="bg-blue-50 rounded-xl px-6 py-4 my-2 min-w-[80px] text-center">
                <span className="text-gray-800 text-2xl">{hours}</span>
              </div>
              <button
                type="button"
                onClick={decrementHours}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <span className="text-gray-800 text-2xl mb-8">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={incrementMinutes}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <div className="bg-blue-50 rounded-xl px-6 py-4 my-2 min-w-[80px] text-center">
                <span className="text-gray-800 text-2xl">{minutes}</span>
              </div>
              <button
                type="button"
                onClick={decrementMinutes}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* AM/PM */}
            <div className="flex flex-col gap-2 ml-2">
              <button
                type="button"
                onClick={() => setPeriod('AM')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  period === 'AM'
                    ? 'bg-[#117BB8] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setPeriod('PM')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  period === 'PM'
                    ? 'bg-[#117BB8] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                PM
              </button>
            </div>
          </div>

          {/* Set Time Button */}
          <button
            type="button"
            onClick={handleSetTime}
            className="w-full mt-6 bg-[#117BB8] hover:bg-[#0f6da4] text-white py-3 rounded-xl transition-all"
          >
            Set Time
          </button>
        </div>
      )}
    </div>
  );
}
