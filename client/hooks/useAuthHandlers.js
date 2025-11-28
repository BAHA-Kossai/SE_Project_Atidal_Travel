import { useState } from "react";
import {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  signOut,
  fetchUserProfile,
} from "../api/auth";

export function useAuthHandlers() {
  const [message, setMessage] = useState("");

  const handleLogin = async (data) => {
    try {
      const res = await signIn(data);

      // Only access token if login is successful
      if (res.status !== 200) {
        setMessage(res.message || "Login failed");
        throw new Error(res.message || "Login failed");
      }

      // Safe to store tokens now
      localStorage.setItem("accessToken", res.data.token.access);
      localStorage.setItem("refreshToken", res.data.token.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      ///// ----------- note to access this later
      // const accessToken = localStorage.getItem("accessToken");
      // const refreshToken = localStorage.getItem("refreshToken");
      // const user = JSON.parse(localStorage.getItem("user"));

      setMessage("");
      return res;
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  const handleSignUp = async (data) => {
  try {
    const res = await signUp(data); // call your API
    // console.log(res);
    // Check HTTP status
    if (res.status != "success") {
      setMessage(res.message || "Signup failed");
      throw new Error(res.message || "Signup failed");
    }

    // Success: just show message or redirect — do NOT store tokens yet
    setMessage(""); // clear previous messages

  
    return res.data;

  } catch (err) {
    setMessage(err.message || "Signup failed");
    throw err;
  }
};
  const handleForgotPassword = async (data) => {
    try {
      const res = await forgotPassword(data);

      if (res.status !== 200) {
        setMessage(res.message || "Forgot password request failed");
        throw new Error(res.message || "Forgot password request failed");
      }

      setMessage("Password reset email sent");
      return res;
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  const handleResetPassword = async (data, token) => {
    try {
      const res = await resetPassword(data, token);

      if (res.status !== 200) {
        setMessage(res.message || "Password reset failed");
        throw new Error(res.message || "Password reset failed");
      }

      setMessage("Password reset successful");
      return res;
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };
  const handleSignOut = async () => {
    try {
      // Optional: send request to backend to invalidate tokens
      await signOut();

      // Clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Optional: you can also redirect the user to login page
      window.location.href = "/"; // replace with your login route
    } catch (err) {
      console.error("Sign out failed:", err.message);
    }
  };
  const handleFetchProfile = async (accessToken) => {
  try {
    const res = await fetchUserProfile(accessToken); // your API call
    console.log("API response:", res);

    // Check for success based on your response object
    if (res.status !== "success") {
      setMessage(res.message || "Failed to fetch profile");
      throw new Error(res.message || "Failed to fetch profile");
    }

    // Save profile for future use
    localStorage.setItem("user", JSON.stringify(res.data));
    setMessage("");
    return res.data; // return the actual user object
  } catch (err) {
    setMessage(err.message);
    throw err;
  }
};



  return {
    message,
    handleLogin,
    handleSignUp,
    handleForgotPassword,
    handleResetPassword,
    handleSignOut,
    handleFetchProfile,
  };
}
