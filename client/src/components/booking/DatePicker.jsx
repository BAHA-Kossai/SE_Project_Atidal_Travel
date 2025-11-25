import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DatePicker({ value, onChange, placeholder, min, max, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const pickerRef = useRef(null);

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty slots for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const isDateDisabled = (day) => {
    if (!day) return false;
    
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (min && dateStr < min) return true;
    if (max && dateStr > max) return true;
    
    return false;
  };

  const handleDayClick = (day) => {
    if (!day || isDateDisabled(day)) return;
    
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    onChange(dateStr);
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() + direction);
    setViewDate(newDate);
  };

  const days = getDaysInMonth(viewDate);
  const monthYear = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="relative" ref={pickerRef}>
      <div className="relative">
        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          value={formatDate(value)}
          onClick={() => setIsOpen(!isOpen)}
          readOnly
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white border ${
            error ? 'border-red-500' : 'border-gray-200'
          } text-gray-700 placeholder-gray-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#117BB8] focus:border-transparent transition-all`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-gray-800">{monthYear}</span>
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-gray-500 text-xs py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const disabled = isDateDisabled(day);
              const isSelected = value && day && 
                value === `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  disabled={disabled || !day}
                  className={`
                    p-2 text-sm rounded-lg transition-all
                    ${!day ? 'invisible' : ''}
                    ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50'}
                    ${isSelected ? 'bg-[#117BB8] text-white hover:bg-[#0f6da4]' : 'text-gray-700'}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
