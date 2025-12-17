import { X, Search, MapPin } from 'lucide-react'
import '../../styles/app_bar_side_bar_with_content.css'

export default function SearchBar({
  placeholder = "Search", 
  onChange, 
  onClear, 
  searchQuery,
  icon: IconComponent = MapPin,
  onSearch,
}) {

  return (
    <div className="w-full flex justify-center mb-10 mt-6">
      <div className="w-full max-w-4xl">
        {/* Outer baby-blue frame */}
        <div className="p-1 bg-[#BFE7FF] rounded-2xl shadow-md">
          {/* Inner card */}
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="flex items-center">
              {/* Input section */}
              <div className="flex-1 relative">
                <div className="flex items-center px-6 py-4 border-r border-gray-200">
                  <IconComponent className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={onChange}
                    className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={onSearch}
                className="
                  bg-[#117BB8] 
                  hover:bg-[#0d5a8a] 
                  text-white px-10 py-5 
                  transition-colors duration-300 
                  flex items-center justify-center 
                  space-x-2 
                  rounded-r-xl
                "
              >
                <span className="font-semibold">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
