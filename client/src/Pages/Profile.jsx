import React, { useState, useEffect } from "react";
import { Search, ArrowUpDown, Filter, Star, CheckCircle, XCircle } from "lucide-react";
import Layout from "../components/layout/Layout";
import Table from "../components/Table.jsx"; 
import { useAuthHandlers } from "../../hooks/useAuthHandlers.js";
import { useUserHandlers } from "../../hooks/useUserHandlers.js";
import { useUserBookings } from "../../hooks/useUserBookings.js";
import { useRating } from "../../hooks/useRating.js";

export default function Profile() {
  const { handleSignOut } = useAuthHandlers();
  const { handleDeleteUser } = useUserHandlers();
  
  // Initialize rating hook
  const { loading: ratingLoading, error: ratingError, success: ratingSuccess, submitRating } = useRating();
  
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const userData = localStorage.getItem("user");
  
  const storedProfile = userData ? JSON.parse(userData) : null;
  
  const userId = storedProfile?.database?.id || storedProfile?.user_id || storedProfile?.id || storedProfile?.supabase_id;

  const { bookings: userBookings, loading: bookingsLoading, error: bookingsError } = useUserBookings(userId);

  const getProfileData = () => {
    if (!storedProfile) {
      return {
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        date_of_birth: "",
      };
    }

    if (storedProfile.supabase && storedProfile.database) {
      return {
        email: storedProfile.supabase.email,
        first_name: storedProfile.supabase.first_name,
        last_name: storedProfile.supabase.last_name,
        phone: storedProfile.database.phone,
        date_of_birth: storedProfile.supabase.date_of_birth,
        user_id: storedProfile.database.id,
        supabase_id: storedProfile.database.supabase_id
      };
    } else if (storedProfile.email) {
      return {
        email: storedProfile.email,
        first_name: storedProfile.first_name,
        last_name: storedProfile.last_name,
        phone: storedProfile.phone,
        date_of_birth: storedProfile.date_of_birth,
        user_id: storedProfile.user_id || storedProfile.id
      };
    } else {
      return storedProfile;
    }
  };

  const [profileData, setProfileData] = useState(getProfileData());

  const [searchQuery, setSearchQuery] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackList, setFeedbackList] = useState([]);
  
  // Add state for API feedback message
  const [apiFeedbackMessage, setApiFeedbackMessage] = useState({
    show: false,
    type: '', // 'success' or 'error'
    message: ''
  });

  const hasUserData = profileData && (profileData.email || profileData.first_name);

  const transformBookingsData = (bookings) => {
    
    if (!bookings || !Array.isArray(bookings)) {
      return [];
    }
    
    return bookings.map((booking) => {
      const tripInfo = booking.TripInfo || {};
      
      return {
        id: booking.booking_id,
        booking_id: booking.booking_id,
        destination_city: tripInfo.destination_city || 'Not specified',
        destination_country: tripInfo.destination_country || 'Not specified',
        trip_date: tripInfo.trip_date || booking.trip_date || 'Not specified',
        booking_status: booking.booking_status || 'pending',
        type: booking.type || 'normal',
        rawBooking: booking
      };
    });
  };

  const filteredBookings = transformBookingsData(userBookings).filter((booking) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      booking.booking_id.toString().includes(searchLower) ||
      booking.destination_city.toLowerCase().includes(searchLower) ||
      booking.destination_country.toLowerCase().includes(searchLower) ||
      booking.trip_date.toLowerCase().includes(searchLower) ||
      booking.booking_status.toLowerCase().includes(searchLower) ||
      booking.type.toLowerCase().includes(searchLower)
    );
  });

  // Mock bookings data with test rows
  const [userBookings, setUserBookings] = useState([
    {
      booking_id: 1001,
      destination_city: "Paris",
      destination_country: "France",
      trip_date: "2026-02-15",
      booking_status: "confirmed",
      type: "normal"
    },
    {
      booking_id: 1002,
      destination_city: "Tokyo",
      destination_country: "Japan",
      trip_date: "2026-03-20",
      booking_status: "pending",
      type: "premium"
    },
    {
      booking_id: 1003,
      destination_city: "New York",
      destination_country: "USA",
      trip_date: "2026-01-10",
      booking_status: "completed",
      type: "normal"
    },
    {
      booking_id: 1004,
      destination_city: "Barcelona",
      destination_country: "Spain",
      trip_date: "2026-04-05",
      booking_status: "cancelled",
      type: "premium"
    },
    {
      booking_id: 1005,
      destination_city: "Dubai",
      destination_country: "UAE",
      trip_date: "2026-05-12",
      booking_status: "confirmed",
      type: "normal"
    }
  ]);

  const [editing, setEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sortBy, setSortBy] = useState("booking_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackName, setFeedbackName] = useState("");
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editingBookingData, setEditingBookingData] = useState({});

  const toggleEdit = () => setEditing(!editing);

  const handleSaveProfile = () => {
    setEditing(false);
    // Profile saved without alert popup
  };

  const handleSignOut = () => {
    alert("Signing out...");
  };

  // UPDATED: Handle feedback submission with backend API
  const handleSubmitFeedback = async () => {
    // Clear any previous feedback messages
    setApiFeedbackMessage({ show: false, type: '', message: '' });

    // Validation (no username needed)
    if (rating === 0) {
      setApiFeedbackMessage({
        show: true,
        type: 'error',
        message: 'Please select a rating'
      });
      return;
    }

    if (!feedback.trim()) {
      setApiFeedbackMessage({
        show: true,
        type: 'error',
        message: 'Please enter your feedback'
      });
      return;
    }

    try {
      // Get user_id from profile (like booking API)
      const userId = profileData.user_id;
      
      if (!userId) {
        throw new Error('User ID not found. Please make sure you are logged in.');
      }

      // Prepare rating data for backend (like booking API pattern)
      const ratingData = {
        user_id: userId,
        comment: feedback.trim(),
        rating: rating,
        // created_at will be added by the hook
      };

      console.log('📤 Submitting rating data:', ratingData);

      // Call the API using your hook
      const result = await submitRating(ratingData);
      
      console.log('✅ Rating submitted successfully:', result);

      // Success - show success message
      setApiFeedbackMessage({
        show: true,
        type: 'success',
        message: 'Thank you for your feedback! It has been submitted for approval.'
      });
      
      // Reset form
      setRating(0);
      setHoverRating(0);
      setFeedback("");
      
      // Also update local feedback list for display
      const newFeedback = {
        name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'You',
        rating: rating,
        feedback: feedback.trim(),
        timestamp: new Date().toISOString(),
        approved: false, // Pending approval from admin
      };
      
      setFeedbackList((prev) => [newFeedback, ...prev]);
      
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
      setApiFeedbackMessage({
        show: true,
        type: 'error',
        message: error.message || 'Failed to submit feedback. Please try again.'
      });
    }
  };

  // Auto-hide feedback message after 5 seconds
  useEffect(() => {
    if (apiFeedbackMessage.show) {
      const timer = setTimeout(() => {
        setApiFeedbackMessage({ show: false, type: '', message: '' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [apiFeedbackMessage.show]);

  const getUserInitials = () => {
    if (profileData.first_name && profileData.last_name) {
      return `${profileData.first_name[0]}${profileData.last_name[0]}`.toUpperCase();
    }
    return profileData.email ? profileData.email[0].toUpperCase() : 'U';
  };

  // Edit booking functionality
  const handleBookingEdit = (booking) => {
    setEditingBookingId(booking.booking_id);
    setEditingBookingData({
      destination_city: booking.destination_city,
      destination_country: booking.destination_country,
      trip_date: booking.trip_date,
      booking_status: booking.booking_status
    });
  };

  const handleSaveBookingEdit = (bookingId) => {
    setUserBookings(userBookings.map(booking => 
      booking.booking_id === bookingId 
        ? { ...booking, ...editingBookingData }
        : booking
    ));
    setEditingBookingId(null);
    setEditingBookingData({});
    // Booking saved without alert popup
  };

  const handleCancelBookingEdit = () => {
    setEditingBookingId(null);
    setEditingBookingData({});
  };

  // Delete booking functionality
  const handleBookingDelete = (booking) => {
    if (window.confirm(`Delete booking #${booking.booking_id}?\n${booking.destination_city}, ${booking.destination_country}`)) {
      setUserBookings(userBookings.filter(b => b.booking_id !== booking.booking_id));
      alert("Booking deleted successfully!");
    }
  };

  const handleSubmitFeedback = () => {
    if (!feedbackName.trim()) return alert("Please enter your name");
    if (rating === 0) return alert("Please select a rating");
    if (!feedback.trim()) return alert("Please enter your feedback");

    setFeedbackName("");
    setRating(0);
    setHoverRating(0);
    setFeedback("");
    alert("Thank you! Your feedback has been submitted.");
  };

  return (
    <Layout>
      <div style={{ minHeight: "100vh", backgroundColor: "#F1F9FE" }}>
        <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Profile Section */}
          <div style={{ backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "2rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "4rem", height: "4rem", backgroundColor: "#117BB8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.5rem", fontWeight: "600" }}>
                  {getUserInitials()}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#212529", margin: 0 }}>
                    {profileData.first_name} {profileData.last_name}
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "#495057", margin: 0 }}>{profileData.email}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button style={{ backgroundColor: "#117BB8", color: "white", padding: "0.625rem 1.5rem", border: "none", borderRadius: "0.5rem", cursor: "pointer" }} onClick={toggleEdit}>
                  {editing ? "Cancel" : "Edit Info"}
                </button>
                {editing && <button style={{ backgroundColor: "#28a745", color: "white", padding: "0.625rem 1.5rem", border: "none", borderRadius: "0.5rem", cursor: "pointer" }} onClick={handleSaveProfile}>Save</button>}
                <button style={{ backgroundColor: "#117BB8", color: "white", padding: "0.625rem 1.5rem", border: "none", borderRadius: "0.5rem", cursor: "pointer" }} onClick={handleSignOut}>Sign out</button>
              </div>
            </div>

            {/* Feedback Section - UPDATED WITH API INTEGRATION */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#212529", margin: "0 0 1.5rem 0" }}>
                Share Your Feedback
              </h2>

              {/* API Feedback Messages */}
              {apiFeedbackMessage.show && (
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1.5rem",
                    backgroundColor: apiFeedbackMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                    border: `1px solid ${apiFeedbackMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
                    color: apiFeedbackMessage.type === 'success' ? '#065f46' : '#991b1b',
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  {apiFeedbackMessage.type === 'success' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                  <span>{apiFeedbackMessage.message}</span>
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#495057",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Rating *
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => !ratingLoading && setHoverRating(star)}
                        onMouseLeave={() => !ratingLoading && setHoverRating(0)}
                        onClick={() => !ratingLoading && setRating(star)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: "0",
                          cursor: ratingLoading ? "not-allowed" : "pointer",
                          opacity: ratingLoading ? 0.6 : 1,
                        }}
                        disabled={ratingLoading}
                      >
                        <Star
                          size={28}
                          style={{
                            fill:
                              star <= (hoverRating || rating)
                                ? "#fbbf24"
                                : "none",
                            color:
                              star <= (hoverRating || rating)
                                ? "#fbbf24"
                                : "#d1d5db",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: "absolute", right: "0.5rem", backgroundColor: "transparent", border: "none", cursor: "pointer", color: "#495057", padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    ) : (
                      <input
                        type={field === "date_of_birth" ? "date" : "text"}
                        value={profileData[field] || ""}
                        onChange={(e) => setProfileData({ ...profileData, [field]: e.target.value })}
                        style={{ padding: "0.625rem 1rem", borderRadius: "0.5rem", border: "1px solid #dee2e6", fontSize: "1rem" }}
                      />
                    )
                  ) : (
                    field === "password" ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", position: "relative" }}>
                        <div style={{ padding: "0.625rem 1rem", borderRadius: "0.5rem", backgroundColor: "#f8f9fa", fontSize: "1rem", color: "#212529", flex: 1 }}>
                          {showPassword ? profileData.password || "Not set" : "••••••••"}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: "absolute", right: "0.5rem", backgroundColor: "transparent", border: "none", cursor: "pointer", color: "#495057", padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    ) : (
                      <div style={{ padding: "0.625rem 1rem", borderRadius: "0.5rem", backgroundColor: "#f8f9fa", fontSize: "1rem", color: "#212529" }}>
                        {profileData[field] || "Not provided"}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#495057",
                    marginBottom: "0.5rem",
                  }}
                >
                  Your feedback *
                </label>
                <textarea
                  placeholder="Share with us your feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  onFocus={() => setFocusedField("feedbackText")}
                  onBlur={() => setFocusedField(null)}
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: `1px solid ${
                      focusedField === "feedbackText" ? "#212529" : "#dee2e6"
                    }`,
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    color: "#212529",
                    fontFamily: "inherit",
                    resize: "none",
                    transition: "border-color 0.2s",
                    opacity: ratingLoading ? 0.6 : 1,
                  }}
                  disabled={ratingLoading}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem" }}>
                {ratingLoading && (
                  <div style={{ display: "flex", alignItems: "center", color: "#117BB8" }}>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                    <span>Submitting...</span>
                  </div>
                )}
                <button
                  onClick={handleSubmitFeedback}
                  disabled={ratingLoading}
                  style={{
                    backgroundColor: ratingLoading ? "#94a3b8" : "#117BB8",
                    color: "white",
                    padding: "0.625rem 2rem",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: ratingLoading ? "not-allowed" : "pointer",
                    transition: "background-color 0.2s",
                    opacity: ratingLoading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!ratingLoading) {
                      e.currentTarget.style.backgroundColor = "#0d5a8a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!ratingLoading) {
                      e.currentTarget.style.backgroundColor = "#117BB8";
                    }
                  }}
                >
                  {ratingLoading ? "Submitting..." : "Submit feedback"}
                </button>
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowFilterPopup(!showFilterPopup)}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: filterStatus ? "#117BB8" : "transparent", color: filterStatus ? "white" : "#495057", padding: "0.5rem 1rem", border: filterStatus ? "none" : "1px solid #dee2e6", borderRadius: "0.5rem", cursor: "pointer" }}
                  >
                    <Filter size={18} /> Filter {filterStatus && `(${filterStatus})`}
                  </button>
                  
                  {/* Filter Popup */}
                  {showFilterPopup && (
                    <div style={{ position: "absolute", top: "100%", right: 0, backgroundColor: "white", border: "1px solid #dee2e6", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "200px", marginTop: "0.5rem" }}>
                      <div style={{ padding: "1rem" }}>
                        <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", fontWeight: "600", color: "#212529" }}>Filter by Status</p>
                        {["", "pending", "confirmed", "completed", "cancelled"].map((status) => (
                          <label key={status} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", cursor: "pointer" }}>
                            <input
                              type="radio"
                              name="filter"
                              value={status}
                              checked={filterStatus === status}
                              onChange={() => {
                                setFilterStatus(status);
                                setShowFilterPopup(false);
                              }}
                              style={{ cursor: "pointer" }}
                            />
                            <span style={{ fontSize: "0.875rem" }}>{status ? status.charAt(0).toUpperCase() + status.slice(1) : "All"}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            {userBookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#6c757d" }}>
                <p>No bookings found.</p>
                <p>Start by creating your first booking!</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #dee2e6" }}>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "#495057", cursor: "pointer" }} onClick={() => setSortBy("booking_id")}>
                        Booking ID {sortBy === "booking_id" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "#495057", cursor: "pointer" }} onClick={() => setSortBy("destination_city")}>
                        Destination {sortBy === "destination_city" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "#495057", cursor: "pointer" }} onClick={() => setSortBy("trip_date")}>
                        Trip Date {sortBy === "trip_date" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "#495057", cursor: "pointer" }} onClick={() => setSortBy("booking_status")}>
                        Status {sortBy === "booking_status" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "#495057", cursor: "pointer" }} onClick={() => setSortBy("type")}>
                        Type {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "#495057" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedBookings().map((booking) => (
                      <tr key={booking.booking_id} style={{ borderBottom: "1px solid #f1f3f5", transition: "background-color 0.2s", backgroundColor: editingBookingId === booking.booking_id ? "#f0f7ff" : "transparent" }} onMouseEnter={(e) => editingBookingId !== booking.booking_id && (e.currentTarget.style.backgroundColor = "#f8f9fa")} onMouseLeave={(e) => editingBookingId !== booking.booking_id && (e.currentTarget.style.backgroundColor = "transparent")}>
                        <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#117BB8", fontWeight: "500" }}>#{booking.booking_id}</td>
                        {editingBookingId === booking.booking_id ? (
                          <>
                            <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                              <input
                                type="text"
                                value={editingBookingData.destination_city}
                                onChange={(e) => setEditingBookingData({ ...editingBookingData, destination_city: e.target.value })}
                                style={{ width: "100%", padding: "0.5rem", marginBottom: "0.25rem", border: "1px solid #dee2e6", borderRadius: "0.375rem" }}
                              />
                              <input
                                type="text"
                                value={editingBookingData.destination_country}
                                onChange={(e) => setEditingBookingData({ ...editingBookingData, destination_country: e.target.value })}
                                style={{ width: "100%", padding: "0.5rem", border: "1px solid #dee2e6", borderRadius: "0.375rem" }}
                              />
                            </td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                              <input
                                type="date"
                                value={editingBookingData.trip_date}
                                onChange={(e) => setEditingBookingData({ ...editingBookingData, trip_date: e.target.value })}
                                style={{ width: "100%", padding: "0.5rem", border: "1px solid #dee2e6", borderRadius: "0.375rem" }}
                              />
                            </td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                              <select
                                value={editingBookingData.booking_status}
                                onChange={(e) => setEditingBookingData({ ...editingBookingData, booking_status: e.target.value })}
                                style={{ width: "100%", padding: "0.5rem", border: "1px solid #dee2e6", borderRadius: "0.375rem" }}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#212529", textTransform: "capitalize" }}>{booking.type}</td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                              <button onClick={() => handleSaveBookingEdit(booking.booking_id)} style={{ backgroundColor: "#28a745", color: "white", padding: "0.375rem 0.75rem", border: "none", borderRadius: "0.375rem", marginRight: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}>Save</button>
                              <button onClick={handleCancelBookingEdit} style={{ backgroundColor: "#6c757d", color: "white", padding: "0.375rem 0.75rem", border: "none", borderRadius: "0.375rem", cursor: "pointer", fontSize: "0.875rem" }}>Cancel</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#212529" }}>
                              <div>{booking.destination_city}</div>
                              <div style={{ fontSize: "0.75rem", color: "#495057" }}>{booking.destination_country}</div>
                            </td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#495057" }}>{new Date(booking.trip_date).toLocaleDateString()}</td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                              <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "500", backgroundColor: booking.booking_status === "confirmed" ? "#dcfce7" : booking.booking_status === "pending" ? "#fef3c7" : booking.booking_status === "cancelled" ? "#fee2e2" : "#dbeafe", color: booking.booking_status === "confirmed" ? "#166534" : booking.booking_status === "pending" ? "#92400e" : booking.booking_status === "cancelled" ? "#991b1b" : "#1e40af" }}>
                                {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                              </span>
                            </td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#212529", textTransform: "capitalize" }}>{booking.type}</td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                              <button onClick={() => handleBookingEdit(booking)} style={{ backgroundColor: "#117BB8", color: "white", padding: "0.375rem 0.75rem", border: "none", borderRadius: "0.375rem", marginRight: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}>Edit</button>
                              <button onClick={() => handleBookingDelete(booking)} style={{ backgroundColor: "#dc3545", color: "white", padding: "0.375rem 0.75rem", border: "none", borderRadius: "0.375rem", cursor: "pointer", fontSize: "0.875rem" }}>Delete</button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Feedback Section */}
          <div style={{ backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>Feedback</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1rem" }}>
              <input placeholder="Your Name" value={feedbackName} onChange={(e) => setFeedbackName(e.target.value)} style={{ padding: "0.625rem 1rem", borderRadius: "0.5rem", border: "1px solid #dee2e6" }} />
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} size={28} style={{ fill: star <= (hoverRating || rating) ? "#fbbf24" : "none", color: star <= (hoverRating || rating) ? "#fbbf24" : "#d1d5db", cursor: "pointer" }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <textarea placeholder="Your feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #dee2e6", marginBottom: "1rem" }} />
            <button style={{ backgroundColor: "#117BB8", color: "white", padding: "0.625rem 2rem", border: "none", borderRadius: "0.5rem", cursor: "pointer" }} onClick={handleSubmitFeedback}>Submit Feedback</button>
          </div>

          </div>
        </main>
      </div>
    </Layout>
  );
}