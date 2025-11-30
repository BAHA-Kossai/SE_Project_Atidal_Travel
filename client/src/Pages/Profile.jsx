import React, { useState, useEffect } from "react";
import { Search, ArrowUpDown, Filter, Star } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuthHandlers } from "../../hooks/useAuthHandlers.js";
import { useUserHandlers } from "../../hooks/useUserHandlers.js";
import { useUserBookings } from "../../hooks/useUserBookings.js";

export default function Profile() {
  const { handleSignOut } = useAuthHandlers();
  const { handleDeleteUser } = useUserHandlers();
  
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const userData = localStorage.getItem("user");
  
  // Get user data from localStorage
  const storedProfile = userData ? JSON.parse(userData) : null;
  
  // Extract user_id
  const userId = storedProfile?.database?.id || storedProfile?.user_id || storedProfile?.id || storedProfile?.supabase_id;


  // Use the user bookings hook
  const { bookings: userBookings, loading: bookingsLoading, error: bookingsError } = useUserBookings(userId);

  // Extract profile data based on your signup structure
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

    // Try multiple possible structures
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
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const rowsPerPage = 7;

  // Check if we have valid user data to display
  const hasUserData = profileData && (profileData.email || profileData.first_name);

  // Transform real bookings data for display
  // Transform real bookings data for display
  const transformBookingsData = (bookings) => {
    
    if (!bookings || !Array.isArray(bookings)) {
      return [];
    }
    
    return bookings.map((booking, index) => {
      
      return {
        id: `temp-${index}`,
        type: booking.type,
        destination: booking.destination_country || 
                    booking.destination_city || 
                    'Unknown Destination',
        date: booking.trip_date,
        persons:(booking.travelers_info ? booking.travelers_info.length + 1 : 1),
        status: booking.booking_status,
      };
    });
  };
  // Use real bookings data
  const allBookingsData = transformBookingsData(userBookings);

  const filteredBookings = allBookingsData.filter((booking) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      booking.displayId.toString().includes(searchLower) ||
      booking.type.toLowerCase().includes(searchLower) ||
      booking.destination.toLowerCase().includes(searchLower) ||
      booking.date.toLowerCase().includes(searchLower) ||
      booking.persons.toString().includes(searchLower) ||
      booking.status.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const emptyRowsCount = rowsPerPage - currentBookings.length;
  const emptyRows = Array(emptyRowsCount).fill(null);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSubmitFeedback = () => {
    if (!feedbackName.trim()) {
      alert("Please enter your name");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!feedback.trim()) {
      alert("Please enter your feedback");
      return;
    }

    const newFeedback = {
      name: feedbackName.trim(),
      rating: rating,
      feedback: feedback.trim(),
      timestamp: new Date().toISOString(),
    };

    setFeedbackList((prev) => [...prev, newFeedback]);
    setFeedbackName("");
    setRating(0);
    setHoverRating(0);
    setFeedback("");
    alert("Thank you for your feedback!");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (profileData.first_name && profileData.last_name) {
      return `${profileData.first_name[0]}${profileData.last_name[0]}`.toUpperCase();
    }
    return profileData.email ? profileData.email[0].toUpperCase() : 'U';
  };

  // Handle delete account with browser confirm
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

  // Loading state - only show if bookings are loading AND we have a userId
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

  // If no user data at all, show error
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
                <>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #dee2e6" }}>
                          <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "500", color: "#495057", width: "80px" }}>#</th>
                          <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "500", color: "#495057", width: "100px" }}>Type</th>
                          <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "500", color: "#495057", width: "200px" }}>Destination</th>
                          <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "500", color: "#495057", width: "120px" }}>Date</th>
                          <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "500", color: "#495057", width: "100px" }}>Travelers</th>
                          <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "500", color: "#495057", width: "120px" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBookings.map((booking, index) => (
                          <tr key={booking.id} style={{ borderBottom: "1px solid #f1f3f5" }}>
                            <td style={{ padding: "1rem", fontSize: "0.875rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#117BB8" }}>
                              {booking.displayId}
                            </td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#495057" }}>
                              {booking.type?.charAt(0).toUpperCase() + booking.type?.slice(1) || 'Normal'}
                            </td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#495057" }}>
                              {booking.destination}
                            </td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#495057" }}>
                              {booking.date}
                            </td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#212529" }}>
                              {booking.persons}
                            </td>
                            <td style={{ 
                              padding: "1rem", 
                              fontSize: "0.875rem", 
                              whiteSpace: "nowrap", 
                              overflow: "hidden", 
                              textOverflow: "ellipsis",
                              color: booking.status === 'confirmed' ? '#28a745' : 
                                    booking.status === 'pending' ? '#ffc107' : 
                                    booking.status === 'cancelled' ? '#dc3545' : '#6c757d'
                            }}>
                              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Pending'}
                            </td>
                          </tr>
                        ))}
                        {emptyRows.map((_, index) => (
                          <tr key={`empty-${index}`} style={{ borderBottom: "1px solid #f1f3f5" }}>
                            <td style={{ padding: "1rem", height: "3.5rem" }}>&nbsp;</td>
                            <td style={{ padding: "1rem" }}>&nbsp;</td>
                            <td style={{ padding: "1rem" }}>&nbsp;</td>
                            <td style={{ padding: "1rem" }}>&nbsp;</td>
                            <td style={{ padding: "1rem" }}>&nbsp;</td>
                            <td style={{ padding: "1rem" }}>&nbsp;</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{
                        padding: "0.25rem 0.75rem",
                        backgroundColor: "transparent",
                        color: "#495057",
                        border: "none",
                        borderRadius: "0.25rem",
                        fontSize: "1rem",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                        opacity: currentPage === 1 ? "0.5" : "1",
                      }}
                    >
                      &lt;
                    </button>

                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span key={`ellipsis-${index}`} style={{ padding: "0.25rem 0.75rem", color: "#495057" }}>
                          .....
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          style={{
                            padding: "0.25rem 0.75rem",
                            backgroundColor: currentPage === page ? "#117BB8" : "transparent",
                            color: currentPage === page ? "white" : "#212529",
                            border: "none",
                            borderRadius: "0.25rem",
                            fontSize: "1rem",
                            cursor: "pointer",
                          }}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: "0.25rem 0.75rem",
                        backgroundColor: "transparent",
                        color: "#495057",
                        border: "none",
                        borderRadius: "0.25rem",
                        fontSize: "1rem",
                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                        opacity: currentPage === totalPages ? "0.5" : "1",
                      }}
                    >
                      &gt;
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Feedback Section */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
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
                    User name
                  </label>
                  <input
                    type="text"
                    placeholder="User name"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    onFocus={() => setFocusedField("feedbackName")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: "100%",
                      padding: "0.625rem 1rem",
                      border: `1px solid ${
                        focusedField === "feedbackName" ? "#212529" : "#dee2e6"
                      }`,
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      color: "#212529",
                      transition: "border-color 0.2s",
                    }}
                  />
                </div>
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
                    Rating
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: "0",
                          cursor: "pointer",
                        }}
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
                  Your feedback
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
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={handleSubmitFeedback}
                  style={{
                    backgroundColor: "#117BB8",
                    color: "white",
                    padding: "0.625rem 2rem",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0d5a8a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#117BB8")
                  }
                >
                  Submit feedback
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