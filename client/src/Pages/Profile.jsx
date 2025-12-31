import React, { useState } from "react";
import Swal from "sweetalert2";
import { Search, ArrowUpDown, Filter, Star, Eye, EyeOff } from "lucide-react";
import Layout from "../components/layout/Layout";
import Table from "../components/Table.jsx"; 
import { useAuthHandlers } from "../../hooks/useAuthHandlers.js";
import { useUserHandlers } from "../../hooks/useUserHandlers.js";
import { useUserBookings } from "../../hooks/useUserBookings.js";

export default function Profile() {
  const { handleSignOut } = useAuthHandlers();
  const { handleDeleteUser, handleUpdateUser } = useUserHandlers();

  const accessToken = localStorage.getItem("accessToken");
  const userData = localStorage.getItem("user");
  const storedProfile = userData ? JSON.parse(userData) : null;
  const userId = storedProfile?.database?.id || storedProfile?.user_id || storedProfile?.id || storedProfile?.supabase_id;

  const { bookings: userBookings, loading: bookingsLoading, error: bookingsError } = useUserBookings(userId);

  const getProfileData = () => {
    if (!storedProfile) return { email: "", first_name: "", last_name: "", phone: "", date_of_birth: "", password: "" };
    if (storedProfile.supabase && storedProfile.database) {
      return {
        email: storedProfile.supabase.email,
        first_name: storedProfile.supabase.first_name,
        last_name: storedProfile.supabase.last_name,
        phone: storedProfile.database.phone,
        date_of_birth: storedProfile.supabase.date_of_birth,
        password: "",
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
        password: "",
        user_id: storedProfile.user_id || storedProfile.id
      };
    } else return { ...storedProfile, password: "" };
  };

  const [profileData, setProfileData] = useState(getProfileData());
  const [editing, setEditing] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
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
  const [feedbackList, setFeedbackList] = useState([]);

  const toggleEdit = () => setEditing(!editing);

  const handleSaveProfile = async () => {
    try {
      const dataToUpdate = { ...profileData };
      if (dataToUpdate.password === "") delete dataToUpdate.password;
      const updated = await handleUpdateUser(dataToUpdate);
      setProfileData(updated);
      setEditing(false);
      Swal.fire("Success", "Profile updated successfully!", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to update profile", "error");
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await handleDeleteUser();
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        Swal.fire("Deleted!", "Your account has been deleted.", "success").then(() => {
          window.location.href = "/";
        });
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to delete your account.", "error");
      }
    }
  };

  const getUserInitials = () => {
    if (profileData.first_name && profileData.last_name) return `${profileData.first_name[0]}${profileData.last_name[0]}`.toUpperCase();
    return profileData.email ? profileData.email[0].toUpperCase() : "U";
  };

  const transformBookingsData = (bookings) => {
    if (!bookings || !Array.isArray(bookings)) return [];
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

  const filteredAndSortedBookings = () => {
    let filtered = transformBookingsData(userBookings).filter((booking) => {
      const matchesSearch = !searchQuery || (
        booking.booking_id.toString().includes(searchQuery.toLowerCase()) ||
        booking.destination_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.destination_country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.trip_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.booking_status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.type.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const matchesFilter = !filterStatus || booking.booking_status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editingBookingData, setEditingBookingData] = useState({});

  const handleBookingEdit = (booking) => {
    setEditingBookingId(booking.booking_id);
    setEditingBookingData({
      destination_city: booking.destination_city,
      destination_country: booking.destination_country,
      trip_date: booking.trip_date,
      booking_status: booking.booking_status
    });
  };

  const handleSaveBookingEdit = async (bookingId) => {
    try {
      // Make API call to update booking with editingBookingData
      // await updateBooking(bookingId, editingBookingData);
      Swal.fire("Success!", "Booking updated successfully.", "success");
      setEditingBookingId(null);
      setEditingBookingData({});
    } catch (err) {
      Swal.fire("Error", "Failed to update booking", "error");
    }
  };

  const handleCancelBookingEdit = () => {
    setEditingBookingId(null);
    setEditingBookingData({});
  };

  const handleBookingDelete = async (booking) => {
    const result = await Swal.fire({
      title: `Delete booking #${booking.booking_id}?`,
      text: `${booking.destination_city}, ${booking.destination_country}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        // Make API call to delete booking
        // await deleteBooking(bookingId);
        Swal.fire("Deleted!", "Booking deleted successfully.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete booking", "error");
      }
    }
  };

  const handleToggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSubmitFeedback = () => {
    if (!feedbackName.trim()) return Swal.fire("Error", "Please enter your name", "error");
    if (rating === 0) return Swal.fire("Error", "Please select a rating", "error");
    if (!feedback.trim()) return Swal.fire("Error", "Please enter your feedback", "error");

    const newFeedback = { name: feedbackName.trim(), rating, feedback: feedback.trim(), timestamp: new Date().toISOString() };
    setFeedbackList((prev) => [...prev, newFeedback]);
    setFeedbackName("");
    setRating(0);
    setHoverRating(0);
    setFeedback("");
    Swal.fire("Thank you!", "Your feedback has been submitted.", "success");
  };

  if (bookingsLoading && userId) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <div className="ml-4 text-gray-600"><p>Loading bookings...</p></div>
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
            <div style={{ backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "2rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "4rem", height: "4rem", backgroundColor: "#117BB8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.5rem", fontWeight: "600" }}>
                    {getUserInitials()}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#212529", margin: 0 }}>
                      {profileData.first_name || 'User'} {profileData.last_name || ''}
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "#495057", margin: 0 }}>{profileData.email || 'No email'}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button style={{ backgroundColor: "#117BB8", color: "white", padding: "0.625rem 1.5rem", border: "none", borderRadius: "0.5rem" }} onClick={toggleEdit}>
                    {editing ? "Cancel" : "Edit Info"}
                  </button>
                  {editing && <button style={{ backgroundColor: "#28a745", color: "white", padding: "0.625rem 1.5rem", border: "none", borderRadius: "0.5rem" }} onClick={handleSaveProfile}>Save</button>}
                  <button style={{ backgroundColor: "#117BB8", color: "white", padding: "0.625rem 1.5rem", border: "none", borderRadius: "0.5rem" }} onClick={handleSignOut}>Sign out</button>
                </div>
              </div>

              {/* Profile Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                {["first_name", "last_name", "phone", "date_of_birth"].map((field) => (
                  <div key={field} style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: "500", color: "#495057", marginBottom: "0.5rem" }}>
                      {field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                    </label>
                    {editing ? (
                      <input
                        type={field === "date_of_birth" ? "date" : "text"}
                        value={profileData[field] || ""}
                        onChange={(e) => setProfileData({ ...profileData, [field]: e.target.value })}
                        style={{ padding: "0.625rem 1rem", borderRadius: "0.5rem", border: "1px solid #dee2e6", fontSize: "1rem" }}
                      />
                    ) : (
                      <div style={{ padding: "0.625rem 1rem", borderRadius: "0.5rem", backgroundColor: "#f8f9fa", fontSize: "1rem", color: "#212529" }}>
                        {profileData[field] || "Not provided"}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Password Field */}
              {editing && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontSize: "0.875rem", fontWeight: "500", color: "#495057", marginBottom: "0.5rem" }}>
                      Password
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", position: "relative" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={profileData.password || ""}
                        onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                        placeholder="Leave empty to keep current password"
                        style={{ padding: "0.625rem 1rem", borderRadius: "0.5rem", border: "1px solid #dee2e6", fontSize: "1rem", flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ backgroundColor: "transparent", border: "none", cursor: "pointer", color: "#495057", padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bookings Section */}
            <div style={{ backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem" }}>Booking History</h2>

              {/* Search and Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1", maxWidth: "320px" }}>
                  <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#495057", pointerEvents: "none" }} size={20} />
                  <input
                    type="text"
                    placeholder="Search your bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.5rem", borderRadius: "0.5rem", border: "1px solid #dee2e6" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={handleToggleSortOrder}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#117BB8", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
                  >
                    <ArrowUpDown size={18} /> {sortOrder === "asc" ? "↑" : "↓"} Sort
                  </button>
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() => setShowFilterPopup(!showFilterPopup)}
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: filterStatus ? "#117BB8" : "transparent", color: filterStatus ? "white" : "#495057", padding: "0.5rem 1rem", border: filterStatus ? "none" : "1px solid #dee2e6", borderRadius: "0.5rem", cursor: "pointer" }}
                    >
                      <Filter size={18} /> Filter
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
              {bookingsError ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#dc3545" }}>Error loading bookings: {bookingsError}</div>
              ) : userBookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#6c757d" }}>
                  <p>No bookings found.</p>
                  <p>Start by creating your first booking!</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #dee2e6" }}>
                        <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "#495057" }}>Booking ID</th>
                        <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "#495057" }}>Destination</th>
                        <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "#495057" }}>Trip Date</th>
                        <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "#495057" }}>Status</th>
                        <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "#495057" }}>Type</th>
                        <th style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: "600", color: "#495057" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedBookings().map((booking) => (
                        <tr key={booking.id} style={{ borderBottom: "1px solid #f1f3f5", transition: "background-color 0.2s", backgroundColor: editingBookingId === booking.booking_id ? "#f0f7ff" : "transparent" }} onMouseEnter={(e) => editingBookingId !== booking.booking_id && (e.currentTarget.style.backgroundColor = "#f8f9fa")} onMouseLeave={(e) => editingBookingId !== booking.booking_id && (e.currentTarget.style.backgroundColor = "transparent")}>
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
                <div style={{ display: "flex", gap: "0.5rem" }}>
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
              <button style={{ backgroundColor: "#117BB8", color: "white", padding: "0.625rem 2rem", border: "none", borderRadius: "0.5rem" }} onClick={handleSubmitFeedback}>Submit Feedback</button>
            </div>

           

          </div>
        </main>
      </div>
    </Layout>
  );
}