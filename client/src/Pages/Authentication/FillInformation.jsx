import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userIcon from '../../assets/user.svg';
import Layout from '../../components/layout/Layout.jsx';

const FillInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const signupData = location.state?.signupData || {};
      const completeData = { ...signupData, ...formData };
      
      console.log('Complete user data:', completeData);
      
      // Replace with API call
      // await registerUser(completeData);
      
      // Navigate to success page or login
      navigate('/home');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[864px] bg-white border border-[#e2e5e9] rounded-3xl overflow-hidden">

        <div className="px-8 py-16 lg:px-20 lg:py-16">
          <div className="max-w-[716px] mx-auto">
            <form onSubmit={handleSubmit} className="space-y-12">
              <h1 className="text-4xl lg:text-[64px] font-normal text-[#212529] tracking-[-1.28px]">
                Fill your information
              </h1>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5">
                        <img src={userIcon} alt="" className="w-full h-full" />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        className={`w-full bg-white border ${
                          errors.firstName ? 'border-red-500' : 'border-[#c6ccd2]'
                        } rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5">
                        <img src={userIcon} alt="" className="w-full h-full" />
                      </div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        className={`w-full bg-white border ${
                          errors.lastName ? 'border-red-500' : 'border-[#c6ccd2]'
                        } rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5">
                        <img src={userIcon} alt="" className="w-full h-full" />
                      </div>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Age"
                        min="1"
                        max="120"
                        className={`w-full bg-white border ${
                          errors.age ? 'border-red-500' : 'border-[#c6ccd2]'
                        } rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                      />
                    </div>
                    {errors.age && (
                      <p className="text-sm text-red-500">{errors.age}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5">
                        <img src={userIcon} alt="" className="w-full h-full" />
                      </div>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`w-full bg-white border ${
                          errors.gender ? 'border-red-500' : 'border-[#c6ccd2]'
                        } rounded-xl px-6 py-4 pl-14 text-base ${
                          formData.gender ? 'text-[#212529]' : 'text-[#c6ccd2]'
                        } tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors appearance-none cursor-pointer`}
                      >
                        <option value="" disabled>gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        
                      </select>
                      {/* Chevron down icon */}
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path d="M1 1L6 6L11 1" stroke="#dbe0e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    {errors.gender && (
                      <p className="text-sm text-red-500">{errors.gender}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#117bb8] hover:bg-[#13699f] text-white text-base font-medium tracking-[-0.32px] px-10 py-4 rounded-full transition-colors"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default FillInformation;
