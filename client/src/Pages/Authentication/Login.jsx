import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import userIcon from "../../assets/user.svg";
import loginPath from "../../assets/plane.svg";
import "../../styles/admin_dashboard.css";
import Layout from "../../components/layout/Layout.jsx";
import { useAuthHandlers } from "../../../hooks/useAuthHandlers.js";
const Login = () => {
  const navigate = useNavigate(); // initialize the hook
  //for API request
  const { message, handleLogin } = useAuthHandlers();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // console.log('Login data:', formData);
      try {
        const res = await handleLogin({
          email: formData.email,
          password: formData.password,
        });
        
        //is successfull redirect to profile 
         navigate("../profile");
      } catch (err) {
        console.error("Login error:", err);
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div
          className="w-full max-w-[1312px] bg-white border border-[#e2e5e9] rounded-3xl relative"
          style={{ minHeight: "877px" }}
        >
          <div
            className="hidden lg:block absolute pointer-events-none"
            style={{ right: "15px", bottom: "180px" }}
          >
            <img
              src={loginPath}
              alt=""
              className="w-auto h-[601px] object-contain"
            />
          </div>

          <div className="relative z-10 px-4 py-12 sm:px-8 sm:py-16 lg:px-32 lg:py-24">
            <div className="max-w-[500px] w-full mx-auto lg:mx-0">
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-4xl lg:text-[64px] font-normal text-[#212529] tracking-[-1.28px] mb-4">
                  Welcome Back !
                </h1>
                <p className="text-lg lg:text-xl text-[#93999f] tracking-[-0.4px]">
                  log in to start tracking your trips
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="space-y-3">
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
                        className={`w-full bg-white border ${
                          errors.email ? "border-red-500" : "border-[#c6ccd2]"
                        } rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email}
                      </p>
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
                        className={`w-full bg-white border ${
                          errors.password
                            ? "border-red-500"
                            : "border-[#c6ccd2]"
                        } rounded-xl px-6 py-4 pl-14 text-base text-[#212529] placeholder:text-[#c6ccd2] tracking-[-0.32px] focus:outline-none focus:border-[#117bb8] transition-colors`}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  {/* Display message */}
                  {message && (
                    <p
                      className={`text-center text-sm mt-4 ${
                        message.toLowerCase().includes("success")
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="w-4 h-4 border-[1.5px] border-[#93999f] rounded accent-[#117bb8]"
                      />
                      <span className="text-lg lg:text-xl text-[#93999f] tracking-[-0.4px]">
                        Remember me
                      </span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-lg lg:text-xl text-[#93999f] tracking-[-0.4px] hover:text-[#117bb8] transition-colors"
                    >
                      Forgot password ?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#117bb8] hover:bg-[#13699f] text-white text-base font-medium tracking-[-0.32px] px-10 py-4 rounded-full transition-colors"
                >
                  Log in
                </button>

                {/* Sign up link */}
                <p className="text-center text-lg lg:text-xl text-[#93999f] tracking-[-0.4px]">
                  Don't have an account ?{" "}
                  <Link
                    to="/signup"
                    className="text-[#117bb8] underline hover:text-[#13699f] transition-colors"
                  >
                    Sign up
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

export default Login;
