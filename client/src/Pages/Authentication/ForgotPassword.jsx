import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userIcon from '../../assets/user.svg';
import Layout from '../../components/layout/Layout.jsx';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    try {
      // Replace with your actual API call
      // await sendPasswordResetEmail(email);
      console.log('Password reset email sent to:', email);
      
      // Navigate to reset password page after successful email send
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1000);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to send reset email. Please try again.');
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
                Forgot password
              </h1>

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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your email"
                    className={`w-full bg-white border ${
                      error ? 'border-red-500' : 'border-[#c6ccd2]'
                    } rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                    disabled={loading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#117bb8] hover:bg-[#13699f] text-white text-base font-medium tracking-[-0.32px] px-10 py-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Next'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default ForgotPassword;
