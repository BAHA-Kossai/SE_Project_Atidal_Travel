import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userIcon from '../../assets/user.svg';
import Layout from '../../components/layout/Layout';
import { useAuthHandlers } from '../../../hooks/useAuthHandlers.js';
import { useSearchParams } from 'react-router-dom';



const ResetPassword = () => {
// Extract token from URL hash
const hash = window.location.hash; // "#access_token=eyJhbGc...&expires_at=..."
const token = new URLSearchParams(hash.replace('#', '?')).get('access_token');

  //for api req
  const { handleResetPassword, message } = useAuthHandlers();
//------

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

   try {
    console.log(formData.password);
    console.log(token);
    await handleResetPassword(formData.password , token);
    
    // Show success message and navigate to login
    alert('Password reset successful! Please login with your new password.');
    navigate('/login');
  } catch (err) {
    console.error('Reset password error:', err);
    setErrors({ submit: err.message || 'Failed to reset password. Please try again.' });
    setLoading(false);
  }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[698px] bg-white border border-[#e2e5e9] rounded-3xl overflow-hidden">
        {/* Main content */}
        <div className="px-8 py-16 lg:px-20 lg:py-24">
          <div className="max-w-[520px] mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header */}
              <h1 className="text-4xl lg:text-[64px] font-normal text-[#212529] tracking-[-1.28px] mb-8">
                New Password
              </h1>

              <div className="space-y-6">
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
                      placeholder="Enter new password"
                      className={`w-full bg-white border ${
                        errors.password ? 'border-red-500' : 'border-[#c6ccd2]'
                      } rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                      disabled={loading}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
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
                      placeholder="Confirm the password"
                      className={`w-full bg-white border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-[#c6ccd2]'
                      } rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                      disabled={loading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                {errors.submit && (
                  <p className="text-sm text-red-500">{errors.submit}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#117bb8] hover:bg-[#13699f] text-white text-base font-medium tracking-[-0.32px] px-10 py-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit'}
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

export default ResetPassword;
