import { useState } from "react";
import { getAllAdmins,createAdmin,deleteAdmin,updateAdmin } from "../api/admin.js";

export function useAdminHandlers() {
  const [message, setMessage] = useState("");
  const [admins, setAdmins] = useState([]);

  const handleFetchAdmins = async () => {
    try {
      setAdmins([]);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const res = await getAllAdmins(accessToken);

      if (res.status !== "success") {
        setMessage(res.message || "Failed to fetch admins");
        throw new Error(res.message || "Failed to fetch admins");
      }

      setAdmins(res.data); // store admins exactly as returned
      setMessage(res.message || "Admins fetched successfully");
      return res.data;
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

 // Create a new admin
  const handleCreateAdmin = async (adminData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");
  
      const res = await createAdmin(accessToken, adminData);
      
      if (res.status !== "success") {
        setMessage(res.message || "Failed to create admin");
        throw new Error(res.message || "Failed to create admin");
      }

      // Add the new admin to state
      setAdmins((prev) => [...prev, res.data]);
      setMessage(res.message || "Admin created successfully");
      return res.data;
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await deleteAdmin(accessToken, adminId);

      if (res.status !== "success") {
        throw new Error(res.message || "Failed to delete admin");
      }

      // Remove from local state
      setAdmins((prev) => prev.filter((a) => a.user_id !== adminId));

      return res;
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  const handleUpdateAdmin = async (adminId, updateData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("No access token found");

    const res = await updateAdmin(accessToken, adminId, updateData);

    if (res.status !== "success") {
      throw new Error(res.message || "Failed to update admin");
    }

    // Update the local state
    setAdmins((prev) =>
      prev.map((a) => (a.user_id === adminId ? { ...a, ...res.data } : a))
    );

    setMessage(res.message || "Admin updated successfully");
    return res.data;
  } catch (err) {
    setMessage(err.message);
    throw err;
  }
};
  return {
    admins,
    message,
    handleFetchAdmins,
    handleCreateAdmin,
    handleDeleteAdmin, 
    handleUpdateAdmin,
  };
}

