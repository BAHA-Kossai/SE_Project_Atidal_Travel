import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import userIcon from "../../assets/user.svg";
import Layout from "../../components/layout/Layout.jsx";
import { useAuthHandlers } from "../../../hooks/useAuthHandlers.js";
const FillInformation = () => {
  //initialize thehook for sign up api req
  const { handleSignUp } = useAuthHandlers();

  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    }

    if (!formData.phone) {
      newErrors.phone = "phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const signupData = location.state?.signupData || {};
      const completeData = { ...signupData, ...formData };

      try {
        const res = await handleSignUp(completeData);

        // Signup successful → go to home or login
        setSuccessMessage("Please check your email to confirm your account!");
        setErrorMessage("");
      } catch (err) {
        setErrorMessage(err.message || "Signup failed");
        setSuccessMessage("");
      }
    }
  };

  return (
    <Layout>
      <style>
        {`
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type="number"] {
        -moz-appearance: textfield;
      }
    `}
      </style>
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[864px] bg-white border border-[#e2e5e9] rounded-3xl overflow-hidden">
          <div className="px-8 py-16 lg:px-20 lg:py-16">
            <div className="max-w-[716px] mx-auto">
              <form onSubmit={handleSubmit} className="space-y-12">
                <h1 className="text-4xl lg:text-[64px] font-normal text-[#212529] tracking-[-1.28px]">
                  Fill your information
                </h1>
                {successMessage && (
                  <p className="text-green-500 mb-4">{successMessage}</p>
                )}
                {errorMessage && (
                  <p className="text-red-500 mb-4">{errorMessage}</p>
                )}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="space-y-2">
                      <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5">
                          <img
                            src={userIcon}
                            alt=""
                            className="w-full h-full"
                          />
                        </div>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="First name"
                          className={`w-full bg-white border ${
                            errors.first_name
                              ? "border-red-500"
                              : "border-[#c6ccd2]"
                          } rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                        />
                      </div>
                      {errors.first_name && (
                        <p className="text-sm text-red-500">
                          {errors.first_name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5">
                          <img
                            src={userIcon}
                            alt=""
                            className="w-full h-full"
                          />
                        </div>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Last name"
                          className={`w-full bg-white border ${
                            errors.last_name
                              ? "border-red-500"
                              : "border-[#c6ccd2]"
                          } rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                        />
                      </div>
                      {errors.last_name && (
                        <p className="text-sm text-red-500">
                          {errors.last_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5">
                          <img
                            src={userIcon}
                            alt=""
                            className="w-full h-full"
                          />
                        </div>

                        <input
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          min="1"
                          max="120"
                          className={`w-full bg-white border ${
                            errors.date_of_birth
                              ? "border-red-500"
                              : "border-[#c6ccd2]"
                          } rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                        />
                        {!formData.date_of_birth && (
                          <span className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            birth date
                          </span>
                        )}
                      </div>
                      {errors.age && (
                        <p className="text-sm text-red-500">
                          {errors.date_of_birth}
                        </p>
                      )}
                    </div>
                    {/*phone*/}
                    <div className="space-y-2">
                      <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5">
                          <img
                            src={userIcon}
                            alt=""
                            className="w-full h-full"
                          />
                        </div>
                        <input
                          type="number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="phone number"
                          className={`w-full bg-white border ${
                            errors.phone ? "border-red-500" : "border-[#c6ccd2]"
                          } rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-500">
                          {errors.first_name}
                        </p>
                      )}
                    </div>
                  </div>

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
