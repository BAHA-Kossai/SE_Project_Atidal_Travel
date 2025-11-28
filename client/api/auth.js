import { request } from "./request";

export const signIn = (data) =>
  request("/api/auth/signin", { method: "POST", data });

export const signUp = (data) =>
  request("/api/auth/signup", { method: "POST", data });

export const forgotPassword = (data) =>
  request("/api/auth/forgot-password", { method: "POST", data });

export const resetPassword = (data, token) =>
  request("/api/auth/reset-password", {
    method: "POST",
    data,
    headers: { Authorization: `Bearer ${token}` },
  });

export const signOut = () => request("/api/auth/signout", { method: "POST" });

export const fetchUserProfile = (accessToken) =>
  request("/api/user/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
