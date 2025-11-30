import { useState } from "react";
import { updateUserProfile,deleteUserProfile } from "../api/user.js";

export function useUserHandlers() {
  const [message, setMessage] = useState("");

  const handleUpdateUser = async (updatedData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const res = await updateUserProfile(accessToken, updatedData);

      if (res.status !== 200 && res.status !== "success") {
        setMessage(res.message || "Failed to update profile");
        throw new Error(res.message || "Failed to update profile");
      }

      // Update local storage with new profile data
      localStorage.setItem("user", JSON.stringify(res.data));
      setMessage("Profile updated successfully");
      return res.data;
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };
  const handleDeleteUser = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const res = await deleteUserProfile(accessToken);

      if (res.status !== 200 && res.status !== "success") {
        setMessage(res.message || "Failed to delete profile");
        throw new Error(res.message || "Failed to delete profile");
      }

      // Clear local storage after deletion
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setMessage("Profile deleted successfully");
      return res;
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  return {
    message,
    handleUpdateUser,
    handleDeleteUser,
  };
}
