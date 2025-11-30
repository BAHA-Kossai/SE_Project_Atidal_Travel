import React, { useState } from 'react';
import { Search, X, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const BranchesTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [branches, setBranches] = useState([
    {
      branchId: '#CR000123',
      city: 'Algiers',
      email: 'email@gmail.com',
      phone: '+213 541 234 456',
      adminId: '#CR000123',
      availability: 'available'
    },
    {
      branchId: '#CR000124',
      city: 'Oran',
      email: 'oran@gmail.com',
      phone: '+213 541 234 457',
      adminId: '#CR000124',
      availability: 'available'
    },
    {
      branchId: '#CR000125',
      city: 'Constantine',
      email: 'constantine@gmail.com',
      phone: '+213 541 234 458',
      adminId: '#CR000125',
      availability: 'not available'
    },
    {
      branchId: '#CR000126',
      city: 'Annaba',
      email: 'annaba@gmail.com',
      phone: '+213 541 234 459',
      adminId: '#CR000126',
      availability: 'available'
    },
    {
      branchId: '#CR000127',
      city: 'Tlemcen',
      email: 'tlemcen@gmail.com',
      phone: '+213 541 234 460',
      adminId: '#CR000127',
      availability: 'not available'
    },
    {
      branchId: '#CR000128',
      city: 'Batna',
      email: 'batna@gmail.com',
      phone: '+213 541 234 461',
      adminId: '#CR000128',
      availability: 'available'
    },
    {
      branchId: '#CR000129',
      city: 'Setif',
      email: 'setif@gmail.com',
      phone: '+213 541 234 462',
      adminId: '#CR000129',
      availability: 'available'
    },
    {
      branchId: '#CR000130',
      city: 'Bejaia',
      email: 'bejaia@gmail.com',
      phone: '+213 541 234 463',
      adminId: '#CR000130',
      availability: 'not available'
    },
    {
      branchId: '#CR000131',
      city: 'Blida',
      email: 'blida@gmail.com',
      phone: '+213 541 234 464',
      adminId: '#CR000131',
      availability: 'available'
    },
    {
      branchId: '#CR000132',
      city: 'Mostaganem',
      email: 'mostaganem@gmail.com',
      phone: '+213 541 234 465',
      adminId: '#CR000132',
      availability: 'available'
    }
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    admin: '',
    openingTime: '',
    closingTime: '',
    workingDays: '',
    status: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const rowsPerPage = 7;

  const filteredBranches = branches.filter(branch => {
    const query = searchQuery.toLowerCase();
    return (
      branch.branchId.toLowerCase().includes(query) ||
      branch.city.toLowerCase().includes(query) ||
      branch.email.toLowerCase().includes(query) ||
      branch.phone.toLowerCase().includes(query) ||
      branch.adminId.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredBranches.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentBranches = filteredBranches.slice(startIndex, endIndex);


  const handleDelete = (id) => {
    setBranches(branches.filter(branch => branch.id !== id));
    setSelectedRows(selectedRows.filter(selectedId => selectedId !== id));
  };

  const handleEdit = (id) => {
    console.log('Edit branch:', id);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === currentBranches.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentBranches.map(branch => branch.id));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(selectedId => selectedId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]+$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number format';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.admin.trim()) {
      errors.admin = 'Admin is required';
    }
    
    if (!formData.openingTime.trim()) {
      errors.openingTime = 'Opening time is required';
    }
    
    if (!formData.closingTime.trim()) {
      errors.closingTime = 'Closing time is required';
    }
    
    if (!formData.workingDays.trim()) {
      errors.workingDays = 'Working days is required';
    }
    
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    
    return errors;
  };

  const handleAddBranch = () => {
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const newId = Math.max(...branches.map(b => b.id), 0) + 1;
      const newBranchId = `#CR${String(newId + 100122).padStart(6, '0')}`;
      
      const newBranch = {
        id: newId,
        branchId: newBranchId,
        city: formData.city,
        email: formData.email,
        phone: formData.phone,
        adminId: newBranchId,
        availability: formData.status === 'available' ? 'available' : 'not available'
      };
      
      setBranches([...branches, newBranch]);
      setShowModal(false);
      resetForm();
      
      const newTotalPages = Math.ceil((branches.length + 1) / rowsPerPage);
      setCurrentPage(newTotalPages);
    }
  };


  const resetForm = () => {
    setFormData({
      firstName: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      admin: '',
      openingTime: '',
      closingTime: '',
      workingDays: '',
      status: ''
    });
    setFormErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for a branch"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                Sort
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
              <button className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                Filter
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <button className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                Export
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
              <button 
                onClick={() => setShowModal(true)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                New Branch
                <span className="text-xl leading-none">+</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === currentBranches.length && currentBranches.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">BranchID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">City</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Phone number</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">AdminID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Availability</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBranches.map((branch) => (
                <tr key={branch.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(branch.id)}
                      onChange={() => toggleSelectRow(branch.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600">{branch.branchId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{branch.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{branch.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{branch.phone}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{branch.adminId}</td>
                  <td className="px-6 py-4">
                    <button
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        branch.availability === 'available'
                          ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                          : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        branch.availability === 'available' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {branch.availability === 'available' ? 'Available' : 'Not Available'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(branch.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(branch.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">New Branch</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Add a new branch to the agency</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Branch Information</h3>
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-1.5">First name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="First Name"
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="annaba,annaba"
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Phone number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+213 444444"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-4 mt-6">branch Details</h3>
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-1.5">Admin</label>
                  <select
                    value={formData.admin}
                    onChange={(e) => setFormData({...formData, admin: e.target.value})}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                      formErrors.admin ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">status</option>
                    <option value="admin1">Admin 1</option>
                    <option value="admin2">Admin 2</option>
                    <option value="admin3">Admin 3</option>
                  </select>
                  {formErrors.admin && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.admin}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Opening time</label>
                    <input
                      type="text"
                      value={formData.openingTime}
                      onChange={(e) => setFormData({...formData, openingTime: e.target.value})}
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.openingTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Guide"
                    />
                    {formErrors.openingTime && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.openingTime}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Closing time</label>
                    <input
                      type="text"
                      value={formData.closingTime}
                      onChange={(e) => setFormData({...formData, closingTime: e.target.value})}
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.closingTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="11-1-2021"
                    />
                    {formErrors.closingTime && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.closingTime}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Working days</label>
                    <input
                      type="text"
                      value={formData.workingDays}
                      onChange={(e) => setFormData({...formData, workingDays: e.target.value})}
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.workingDays ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="sidi abdellah, algiers"
                    />
                    {formErrors.workingDays && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.workingDays}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                        formErrors.status ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">status</option>
                      <option value="available">Available</option>
                      <option value="not available">Not Available</option>
                    </select>
                    {formErrors.status && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.status}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-2.5 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBranch}
                    className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium text-sm"
                  >
                    Add Branch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchesTable;