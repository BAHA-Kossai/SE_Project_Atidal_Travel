import { request } from "./request";

/**
 * Sign in user
 */
export const signIn = (data) =>
  request("/api/auth/signin", { 
    method: "POST", 
    data,
    requiresAuth: false
  });

/**
 * Sign up new user
 */
export const signUp = (data) =>
  request("/api/auth/signup", { 
    method: "POST", 
    data,
    requiresAuth: false
  });

/**
 * Sign out user
 */
export const signOut = () => 
  request("/api/auth/signout", { 
    method: "POST",
    requiresAuth: false
  });

/**
 * Get user profile (alternative endpoint)
 */
export const fetchUserProfile = () =>
  request("/api/user/me", {
    method: "GET",
    requiresAuth: true
  });

/**
 * Send forgot password email
 */
export const sendForgotPasswordEmail = (email) =>
  request("/api/auth/forgot-password", { 
    method: "POST", 
    data: { email },
    requiresAuth: false
  });

/**
 * Reset password with token
 */
export const resetPassword = ({ token, newPassword }) =>
  request("/api/auth/reset-password", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data: { newPassword: newPassword },
    requiresAuth: false
  });