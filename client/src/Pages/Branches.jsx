import React, { useState } from 'react'; 
import { ChevronDown, MapPin, Calendar, Users, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';

const Branches = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const branches = [
    {
      id: 1,
      name: 'Guelma branch',
      location: 'Guelma, centre ville',
      phone: '06.6666666666',
      email: 'Atidal.guelma@gmail.com',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Alger branch',
      location: 'Guelma, centre ville',
      phone: '06.6666666666',
      email: 'Atidal.guelma@gmail.com',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Annaba branch',
      location: 'Guelma, centre ville',
      phone: '06.6666666666',
      email: 'Atidal.guelma@gmail.com',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop'
    }
  ];

  return (
    <Layout>
      <div className="w-full">
       {/* Search Bar Section */}
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
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />

              <input
                type="text"
                placeholder="location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
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


        {/* Branches List */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="space-y-8">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden flex"
              >
                {/* Branch Image */}
                <div className="w-96 h-64">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Branch Info */}
                <div className="flex-1 p-8">
                  <h2 className="text-3xl font-semibold mb-6" style={{ color: '#117BB8' }}>
                    {branch.name}
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5" style={{ color: '#117BB8' }} />
                      <span>{branch.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-5 h-5" style={{ color: '#117BB8' }} />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-5 h-5" style={{ color: '#117BB8' }} />
                      <span>{branch.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Branches;
