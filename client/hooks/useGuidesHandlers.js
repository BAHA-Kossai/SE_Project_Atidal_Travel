import { useState } from "react";
import { 
  getAllGuides, 
  getGuideById, 
  createGuide, 
  updateGuide, 
  deleteGuide 
} from "../api/guide.js";

export function useGuideHandlers() {
  const [message, setMessage] = useState("");
  const [guides, setGuides] = useState([]);

  // Fetch all guides (public, no token needed)
  const handleFetchGuides = async () => {
    try {
      setGuides([]);
      const res = await getAllGuides();
       
      if (res.status !== "success") {
        setMessage(res.message || "Failed to fetch guides");
        throw new Error(res.message || "Failed to fetch guides");
      }

      setGuides(res.data);
      setMessage(res.message || "Guides fetched successfully");
      return res.data;
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  // Fetch a single guide by ID (public)
  const handleFetchGuideById = async (guideId) => {
    try {
      const res = await getGuideById(guideId);

      if (res.status !== "success") {
        setMessage(res.message || "Failed to fetch guide");
        throw new Error(res.message || "Failed to fetch guide");
      }

      setMessage(res.message || "Guide fetched successfully");
      return res.data;
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  // Create a new guide (requires token)
  const handleCreateGuide = async (guideData) => {
    try {
      const res = await createGuide(guideData);

      if (res.status !== "success") {
        setMessage(res.message || "Failed to create guide");
        throw new Error(res.message || "Failed to create guide");
      }

      setGuides((prev) => [...prev, res.data]);
      setMessage(res.message || "Guide created successfully");
      return res.data;
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  // Update an existing guide by ID (requires token)
  const handleUpdateGuide = async (guideId, updateData) => {
    try {
      const res = await updateGuide(guideId, updateData);

      if (res.status !== "success") {
        setMessage(res.message || "Failed to update guide");
        throw new Error(res.message || "Failed to update guide");
      }

      setGuides((prev) =>
        prev.map((g) => (g.guide_id === guideId ? { ...g, ...res.data } : g))
      );

      setMessage(res.message || "Guide updated successfully");
      return res.data;
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  // Delete a guide by ID (requires token)
  const handleDeleteGuide = async (guideId) => {
    try {
      const res = await deleteGuide(guideId);

      if (res.status !== "success") {
        throw new Error(res.message || "Failed to delete guide");
      }

      setGuides((prev) => prev.filter((g) => g.guide_id !== guideId));
      setMessage(res.message || "Guide deleted successfully");
      return res;
    } catch (err) {
      setMessage(err.message);
      throw err;
    }
  };

  return {
    guides,
    message,
    handleFetchGuides,
    handleFetchGuideById,
    handleCreateGuide,
    handleUpdateGuide,
    handleDeleteGuide,
  };
}
