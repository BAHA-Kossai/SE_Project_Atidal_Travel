import React, { useState } from "react";
import Swal from "sweetalert2";
import { Search, ArrowUpDown, Filter, Star } from "lucide-react";
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
    if (!storedProfile) return { email: "", first_name: "", last_name: "", phone: "", date_of_birth: "" };
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
    } else return storedProfile;
  };

  const [profileData, setProfileData] = useState(getProfileData());
  const [editing, setEditing] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);

  const toggleEdit = () => setEditing(!editing);

  const handleSaveProfile = async () => {
    try {
      const updated = await handleUpdateUser(profileData);
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
      format: (item) => <span className="text-blue-600 font-medium">#{item.booking_id}</span>
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
      format: (item) => <span>{new Date(item.trip_date).toLocaleDateString()}</span>
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
      format: (item) => <span className="capitalize">{item.type}</span>
    }
  ];

  const handleBookingEdit = (booking) => {
    Swal.fire("Edit booking", `Implement your edit logic for booking #${booking.booking_id}`, "info");
  };

  const handleBookingDelete = (booking) => {
    Swal.fire({
      title: `Delete booking #${booking.booking_id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Booking deleted successfully.", "success");
      }
    });
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
            </div>

            {/* Bookings Section */}
            <div style={{ backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem" }}>Booking History</h2>

              {/* Search */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
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
                  <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "transparent", color: "#495057", padding: "0.5rem 1rem", border: "1px solid #dee2e6", borderRadius: "0.5rem" }}><ArrowUpDown size={18} /> Sort</button>
                  <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "transparent", color: "#495057", padding: "0.5rem 1rem", border: "1px solid #dee2e6", borderRadius: "0.5rem" }}><Filter size={18} /> Filter</button>
                </div>
              </div>

              {bookingsError ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#dc3545" }}>Error loading bookings: {bookingsError}</div>
              ) : userBookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#6c757d" }}>
                  <p>No bookings found.</p>
                  <p>Start by creating your first booking!</p>
                </div>
              ) : (
                <Table columns={bookingColumns} data={filteredBookings} onEdit={handleBookingEdit} onDelete={handleBookingDelete} />
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

            {/* Delete Account */}
            <div style={{ marginTop: "20px" }}>
              <button style={{ backgroundColor: "#dc3545", color: "white", padding: "0.625rem 1.5rem", border: "none", borderRadius: "0.5rem" }} onClick={handleDeleteAccount}>Delete Account</button>
            </div>

          </div>
        </main>
      </div>
    </Layout>
  );
}
