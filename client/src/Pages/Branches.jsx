import React, { useState } from 'react'; 
import { ChevronDown, MapPin, Calendar, Users, Phone, Mail, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import { useBranches } from '../../hooks/useBranches';

const Branches = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { branches, loading, error, refetch } = useBranches();
  const navigate = useNavigate();

  const filteredBranches = branches.filter(branch =>
    branch.branch_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.branch_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.branch_address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatWorkingDays = (workingDays) => {
    if (!workingDays) return 'Monday - Friday';
    
    if (typeof workingDays === 'string') {
      try {
        const days = JSON.parse(workingDays);
        return Array.isArray(days) ? days.join(', ') : workingDays;
      } catch {
        return workingDays;
      }
    }
    
    return Array.isArray(workingDays) ? workingDays.join(', ') : 'Monday - Friday';
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    }
    
    return time;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error loading branches</div>
            <button 
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

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
                        placeholder="Search by branch name, city, or address..."
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

        {/* Results Count */}
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <p className="text-gray-600">
            {filteredBranches.length} {filteredBranches.length === 1 ? 'branch' : 'branches'} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Branches List */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          {filteredBranches.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No branches found</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search terms' : 'No active branches available at the moment'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredBranches.map((branch) => (
                <div
                  key={branch.branch_id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden flex border border-gray-100 hover:shadow-md transition-shadow duration-300"
                >
                  {/* Branch Image - Using placeholder since image isn't in schema */}
                  <div className="w-96 h-64 bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-blue-400 mx-auto mb-2" />
                      <p className="text-blue-600 font-semibold">{branch.branch_name}</p>
                    </div>
                  </div>

                  {/* Branch Info */}
                  <div className="flex-1 p-8">
                    <h2 className="text-3xl font-semibold mb-6" style={{ color: '#117BB8' }}>
                      {branch.branch_name}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 text-gray-600">
                          <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#117BB8' }} />
                          <div>
                            <p className="font-medium">{branch.branch_address}</p>
                            <p className="text-sm text-gray-500">{branch.branch_city}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#117BB8' }} />
                          <span>{branch.phone || 'Not available'}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-gray-600">
                          <Mail className="w-5 h-5 flex-shrink-0" style={{ color: '#117BB8' }} />
                          <span>{branch.email || 'Not available'}</span>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 text-gray-600">
                          <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#117BB8' }} />
                          <div>
                            <p className="font-medium">Working Hours</p>
                            <p className="text-sm">
                              {formatTime(branch.opening_time)} - {formatTime(branch.closing_time)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 text-gray-600">
                          <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#117BB8' }} />
                          <div>
                            <p className="font-medium">Working Days</p>
                            <p className="text-sm">{formatWorkingDays(branch.working_days)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Branches;