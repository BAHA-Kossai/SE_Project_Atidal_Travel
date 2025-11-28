import { request } from "./request";

export const signIn = (data) =>
  request("/api/auth/signin", { method: "POST", data });

export const signUp = (data) =>
  request("/api/auth/signup", { method: "POST", data });

export const signOut = () => request("/api/auth/signout", { method: "POST" });

export const fetchUserProfile = (accessToken) =>
  request("/api/user/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

// Forgot Password
export const sendForgotPasswordEmail = (email) =>
  request("/api/auth/forgot-password", { method: "POST", data: { email } });

// Reset Password
export const resetPassword = ({ token, newPassword }) =>
  request("/api/auth/reset-password", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data: { newPassword: newPassword },
  });