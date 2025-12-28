import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userIcon from '../../assets/user.svg';
import signupPath from '../../assets/plane_2.svg';
import Layout from '../../components/layout/Layout.jsx';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // Track password requirements
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Update password requirements
    if (name === 'password') {
      setPasswordRequirements({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      // Check all requirements
      const { length, uppercase, lowercase, number, specialChar } = passwordRequirements;
      if (!length || !uppercase || !lowercase || !number || !specialChar) {
        newErrors.password = 'Password does not meet all requirements';
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/fill-information', { 
        state: { 
          signupData: {
            email: formData.email,
            password: formData.password
          }
        }
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[1312px] bg-white border border-[#e2e5e9] rounded-3xl overflow-hidden relative">
          {/* Decorative airplane path */}
          <div className="hidden lg:block absolute left-10 top-[120px] pointer-events-none">
            <img src={signupPath} alt="" className="w-[654px] h-[581px]" />
          </div>

          {/* Main content */}
          <div className="relative z-10 px-8 py-16 lg:px-32 lg:py-24 lg:ml-auto lg:max-w-[656px]">
            <div className="max-w-[500px] ml-auto">
              {/* Header */}
              <div className="mb-16">
                <h1 className="text-4xl lg:text-[64px] font-normal text-[#212529] tracking-[-1.28px] mb-4">
                  Get started
                </h1>
                <p className="text-lg lg:text-xl text-[#93999f] tracking-[-0.4px]">
                  Welcome to ------, let's get started
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="space-y-3">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-base text-[#495057] tracking-[-0.32px]">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5">
                        <img src={userIcon} alt="" className="w-full h-full" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-[#c6ccd2]'} rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-base text-[#495057] tracking-[-0.32px]">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5">
                        <img src={userIcon} alt="" className="w-full h-full" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter a valid password"
                        className={`w-full bg-white border ${errors.password ? 'border-red-500' : 'border-[#c6ccd2]'} rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                        required
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                    )}

                    {/* Password Requirements */}
                    <ul className="text-sm mt-2 space-y-1">
                      <li className={passwordRequirements.length ? 'text-green-600' : 'text-gray-400'}>
                        * At least 8 characters
                      </li>
                      <li className={passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-400'}>
                        * At least 1 uppercase letter
                      </li>
                      <li className={passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-400'}>
                        * At least 1 lowercase letter
                      </li>
                      <li className={passwordRequirements.number ? 'text-green-600' : 'text-gray-400'}>
                        * At least 1 number
                      </li>
                      <li className={passwordRequirements.specialChar ? 'text-green-600' : 'text-gray-400'}>
                        * At least 1 special character
                      </li>
                    </ul>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label className="block text-base text-[#495057] tracking-[-0.32px]">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5">
                        <img src={userIcon} alt="" className="w-full h-full" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Enter a Valid Password"
                        className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-[#c6ccd2]'} rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                        required
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
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

                {/* Login link */}
                <p className="text-center text-lg lg:text-xl text-[#93999f] tracking-[-0.4px]">
                  have an account already ?{' '}
                  <Link to="/login" className="text-[#117bb8] underline hover:text-[#13699f] transition-colors">
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
