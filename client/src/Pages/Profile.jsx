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

  const bookingColumns = [
    {
      title: "Booking ID",
      format: (item) => (
        <span className="text-blue-600 font-medium">#{item.booking_id}</span>
      )
    },
    {
      title: "Destination",
      format: (item) => (
        <div>
          <div className="font-medium">{item.destination_city}</div>
          <div className="text-sm text-gray-500">{item.destination_country}</div>
        </div>
      )
    },
    {
      title: "Trip Date",
      format: (item) => (
        <span>{new Date(item.trip_date).toLocaleDateString()}</span>
      )
    },
    {
      title: "Status",
      format: (item) => {
        const statusColors = {
          'confirmed': 'bg-green-100 text-green-800',
          'pending': 'bg-yellow-100 text-yellow-800',
          'cancelled': 'bg-red-100 text-red-800',
          'completed': 'bg-blue-100 text-blue-800'
        };
        
        const colorClass = statusColors[item.booking_status] || 'bg-gray-100 text-gray-800';
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {item.booking_status?.charAt(0).toUpperCase() + item.booking_status?.slice(1)}
          </span>
        );
      }
    },
    {
      title: "Type",
      format: (item) => (
        <span className="capitalize">{item.type}</span>
      )
    }
  ];

  const handleBookingSelect = (booking) => {
    
  };

  const handleBookingEdit = (booking) => {
  };

  const handleBookingDelete = (booking) => {
    if (window.confirm(`Are you sure you want to delete booking #${booking.booking_id}?`)) {
      console.log('Delete booking:', booking);
    }
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

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (confirmed) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found");

        await handleDeleteUser(accessToken);

        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        alert("Your account has been deleted successfully.");
        window.location.href = "/";
      } catch (err) {
        alert("Error: " + (err.message || "Failed to delete your account."));
      }
    }
  };

  if (bookingsLoading && userId) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <div className="ml-4 text-gray-600">
            <p>Loading bookings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!hasUserData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No User Data Found</h2>
            <p className="text-gray-600 mb-4">Please sign in to access your profile.</p>
            <button
              onClick={() => window.location.href = "/signin"}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Sign In
            </button>
            <div className="mt-4 p-4 bg-gray-100 rounded text-left">
              <p className="text-sm text-gray-700">Debug Info:</p>
              <p className="text-sm text-gray-700">User in localStorage: {userData ? "Yes" : "No"}</p>
              <p className="text-sm text-gray-700">Access Token: {accessToken ? "Exists" : "Missing"}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ minHeight: "100vh", backgroundColor: "#F1F9FE" }}>
        <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            
            {/* Profile Section */}
            <div style={{ backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", padding: "2rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "4rem", height: "4rem", backgroundColor: "#117BB8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.5rem", fontWeight: "600" }}>
                    {getUserInitials()}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#212529", margin: "0" }}>
                      {profileData.first_name || 'User'} {profileData.last_name || ''}
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "#495057", margin: "0" }}>
                      {profileData.email || 'No email'}
                    </p>
                  </div>
                </div>
                <button
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#117BB8", color: "white", padding: "0.625rem 1.5rem", border: "none", borderRadius: "0.5rem", fontSize: "1rem", fontWeight: "500", cursor: "pointer", transition: "background-color 0.2s" }}
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>

              {/* Profile Info Display (Read-only) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#495057", marginBottom: "0.5rem" }}>
                      First name
                    </label>
                    <div style={{
                      width: "100%",
                      padding: "0.625rem 1rem",
                      border: "1px solid #dee2e6",
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      color: "#212529",
                      backgroundColor: "#f8f9fa",
                    }}>
                      {profileData.first_name || 'Not provided'}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#495057", marginBottom: "0.5rem" }}>
                      Last name
                    </label>
                    <div style={{
                      width: "100%",
                      padding: "0.625rem 1rem",
                      border: "1px solid #dee2e6",
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      color: "#212529",
                      backgroundColor: "#f8f9fa",
                    }}>
                      {profileData.last_name || 'Not provided'}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#495057", marginBottom: "0.5rem" }}>
                      Phone number
                    </label>
                    <div style={{
                      width: "100%",
                      padding: "0.625rem 1rem",
                      border: "1px solid #dee2e6",
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      color: "#212529",
                      backgroundColor: "#f8f9fa",
                    }}>
                      {profileData.phone || 'Not provided'}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#495057", marginBottom: "0.5rem" }}>
                      Birth date
                    </label>
                    <div style={{
                      width: "100%",
                      padding: "0.625rem 1rem",
                      border: "1px solid #dee2e6",
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      color: "#212529",
                      backgroundColor: "#f8f9fa",
                    }}>
                      {profileData.date_of_birth || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings History Section */}
            <div style={{ backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#212529", margin: "0 0 1.5rem 0" }}>
                Booking History
              </h2>

              {/* Search and Filters */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1", maxWidth: "320px" }}>
                  <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#495057", pointerEvents: "none" }} size={20} />
                  <input
                    type="text"
                    placeholder="Search your bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setFocusedField("search")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: "100%",
                      padding: "0.5rem 1rem 0.5rem 2.5rem",
                      border: `1px solid ${focusedField === "search" ? "#212529" : "#dee2e6"}`,
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      color: "#212529",
                      transition: "border-color 0.2s",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "transparent", color: "#495057", padding: "0.5rem 1rem", border: "1px solid #dee2e6", borderRadius: "0.5rem", fontSize: "1rem", cursor: "pointer" }}>
                    <ArrowUpDown size={18} /> Sort
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "transparent", color: "#495057", padding: "0.5rem 1rem", border: "1px solid #dee2e6", borderRadius: "0.5rem", fontSize: "1rem", cursor: "pointer" }}>
                    <Filter size={18} /> Filter
                  </button>
                </div>
              </div>

              {/* Bookings Table */}
              {bookingsError ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#dc3545" }}>
                  Error loading bookings: {bookingsError}
                </div>
              ) : userBookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#6c757d" }}>
                  <p>No bookings found.</p>
                  <p>Start by creating your first booking!</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-4">
                  {/* Table Component */}
                  <Table
                    columns={bookingColumns}
                    data={filteredBookings}
                    onSelect={handleBookingSelect}
                    onEdit={handleBookingEdit}
                    onDelete={handleBookingDelete}
                  />
                </div>
              )}
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
                      </button>
                    ))}
                  </div>
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
              </div>
            </div>

            {/* Delete Account Section */}
            <div style={{ marginTop: "20px" }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "#dc3545",
                  color: "white",
                  padding: "0.625rem 1.5rem",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#b02a37")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#dc3545")
                }
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>

          </div>
        </main>
      </div>
    </Layout>
  );
}