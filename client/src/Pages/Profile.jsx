import React, { useState } from "react";
import { Search, ArrowUpDown, Filter, Edit2, Star, Save } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuthHandlers } from "../../hooks/useAuthHandlers";
export default function Profile() {
  //init hook for sign out 
  const { handleSignOut } = useAuthHandlers();


  const [activeTab, setActiveTab] = useState("bookings");
  const [searchQuery, setSearchQuery] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const storedProfile = JSON.parse(localStorage.getItem("user")) || {
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
  };
  // console.log(storedProfile);
  const [profileData, setProfileData] = useState(storedProfile);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const rowsPerPage = 7;

  const allBookingsData = [
    {
      id: "#CR000123",
      userName: "hadi mohamed",
      destination: "Destination",
      date: "10-10-2025",
      persons: 3,
    },
    {
      id: "#CR000124",
      userName: "hadi mohamed",
      destination: "Destination",
      date: "10-10-2025",
      persons: 3,
    },
    {
      id: "#CR000125",
      userName: "hadi mohamed",
      destination: "Destination",
      date: "10-10-2025",
      persons: 1,
    },
    {
      id: "#CR000126",
      userName: "hadi mohamed",
      destination: "Destination",
      date: "10-10-2025",
      persons: 1,
    },
    {
      id: "#CR000127",
      userName: "hadi mohamed",
      destination: "Destination",
      date: "10-10-2025",
      persons: 1,
    },
    {
      id: "#CR000128",
      userName: "hadi mohamed",
      destination: "Destination",
      date: "10-10-2025",
      persons: 3,
    },
    {
      id: "#CR000129",
      userName: "hadi mohamed",
      destination: "Destination",
      date: "10-10-2025",
      persons: 4,
    },
    {
      id: "#CR000130",
      userName: "ahmed ali",
      destination: "Destination",
      date: "11-10-2025",
      persons: 2,
    },
    {
      id: "#CR000131",
      userName: "sara khan",
      destination: "Destination",
      date: "12-10-2025",
      persons: 5,
    },
    {
      id: "#CR000132",
      userName: "omar hassan",
      destination: "Destination",
      date: "13-10-2025",
      persons: 1,
    },
    {
      id: "#CR000133",
      userName: "fatima zahra",
      destination: "Destination",
      date: "14-10-2025",
      persons: 3,
    },
    {
      id: "#CR000134",
      userName: "youssef karim",
      destination: "Destination",
      date: "15-10-2025",
      persons: 4,
    },
    {
      id: "#CR000135",
      userName: "amina belkacem",
      destination: "Destination",
      date: "16-10-2025",
      persons: 2,
    },
    {
      id: "#CR000136",
      userName: "malik benali",
      destination: "Destination",
      date: "17-10-2025",
      persons: 6,
    },
    {
      id: "#CR000137",
      userName: "leila brahim",
      destination: "Destination",
      date: "18-10-2025",
      persons: 3,
    },
    {
      id: "#CR000138",
      userName: "karim meziane",
      destination: "Destination",
      date: "19-10-2025",
      persons: 1,
    },
    {
      id: "#CR000139",
      userName: "nadia cherif",
      destination: "Destination",
      date: "20-10-2025",
      persons: 4,
    },
    {
      id: "#CR000140",
      userName: "reda mansouri",
      destination: "Destination",
      date: "21-10-2025",
      persons: 2,
    },
    {
      id: "#CR000141",
      userName: "samira boudiaf",
      destination: "Destination",
      date: "22-10-2025",
      persons: 3,
    },
    {
      id: "#CR000142",
      userName: "tarek bouzid",
      destination: "Destination",
      date: "23-10-2025",
      persons: 5,
    },
  ];

  const filteredBookings = allBookingsData.filter((booking) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      booking.id.toLowerCase().includes(searchLower) ||
      booking.userName.toLowerCase().includes(searchLower) ||
      booking.destination.toLowerCase().includes(searchLower) ||
      booking.date.toLowerCase().includes(searchLower) ||
      booking.persons.toString().includes(searchLower)
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

  const handleEditToggle = () => {
    if (isEditMode) {
      console.log("Saving profile data:", profileData);
    }
    setIsEditMode(!isEditMode);
  };

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

    console.log("Feedback submitted:", newFeedback);
    console.log("All feedbacks:", [...feedbackList, newFeedback]);

    setFeedbackName("");
    setRating(0);
    setHoverRating(0);
    setFeedback("");

    alert("Thank you for your feedback!");
  };

  return (
    <Layout>
      <div style={{ minHeight: "100vh", backgroundColor: "#F1F9FE" }}>
        <main
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                padding: "2rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "4rem",
                      height: "4rem",
                      backgroundColor: "#117BB8",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.5rem",
                      fontWeight: "600",
                    }}
                  >
                    K
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h2
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "#212529",
                        margin: "0",
                      }}
                    >
                      User Name
                    </h2>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#495057",
                        margin: "0",
                      }}
                    >
                      khadija@gmail.com
                    </p>
                  </div>
                  
                </div>
                <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      backgroundColor: "#117BB8",
                      color: "white",
                      padding: "0.625rem 1.5rem",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onClick={()=>{handleSignOut();}}
                  >
                    Sign out
                  </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
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
                      First name
                    </label>
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) =>
                        handleProfileChange("firstName", e.target.value)
                      }
                      onFocus={() => setFocusedField("firstName")}
                      onBlur={() => setFocusedField(null)}
                      disabled={!isEditMode}
                      style={{
                        width: "100%",
                        padding: "0.625rem 1rem",
                        border: `1px solid ${
                          focusedField === "firstName" && isEditMode
                            ? "#212529"
                            : "#dee2e6"
                        }`,
                        borderRadius: "0.5rem",
                        fontSize: "1rem",
                        color: "#212529",
                        backgroundColor: !isEditMode ? "#f8f9fa" : "white",
                        cursor: !isEditMode ? "not-allowed" : "text",
                        opacity: !isEditMode ? "0.7" : "1",
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
                      Last name
                    </label>
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) =>
                        handleProfileChange("lastName", e.target.value)
                      }
                      onFocus={() => setFocusedField("lastName")}
                      onBlur={() => setFocusedField(null)}
                      disabled={!isEditMode}
                      style={{
                        width: "100%",
                        padding: "0.625rem 1rem",
                        border: `1px solid ${
                          focusedField === "lastName" && isEditMode
                            ? "#212529"
                            : "#dee2e6"
                        }`,
                        borderRadius: "0.5rem",
                        fontSize: "1rem",
                        color: "#212529",
                        backgroundColor: !isEditMode ? "#f8f9fa" : "white",
                        cursor: !isEditMode ? "not-allowed" : "text",
                        opacity: !isEditMode ? "0.7" : "1",
                        transition: "border-color 0.2s",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
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
                      Phone number
                    </label>
                    <input
                      type="number"
                      value={profileData.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      disabled={!isEditMode}
                      style={{
                        width: "100%",
                        padding: "0.625rem 1rem",
                        border: `1px solid ${
                          focusedField === "phone" && isEditMode
                            ? "#212529"
                            : "#dee2e6"
                        }`,
                        borderRadius: "0.5rem",
                        fontSize: "1rem",
                        color: "#212529",
                        backgroundColor: !isEditMode ? "#f8f9fa" : "white",
                        cursor: !isEditMode ? "not-allowed" : "text",
                        opacity: !isEditMode ? "0.7" : "1",
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
                      birth date
                    </label>
                    <input
                      type="date"
                      value={profileData.date_of_birth}
                      onChange={(e) =>
                        handleProfileChange("date_of_birth", e.target.value)
                      }
                      onFocus={() => setFocusedField("date_of_birth")}
                      onBlur={() => setFocusedField(null)}
                      disabled={!isEditMode}
                      style={{
                        width: "100%",
                        padding: "0.625rem 1rem",
                        border: `1px solid ${
                          focusedField === "date_of_birth" && isEditMode
                            ? "#212529"
                            : "#dee2e6"
                        }`,
                        borderRadius: "0.5rem",
                        fontSize: "1rem",
                        color: "#212529",
                        backgroundColor: !isEditMode ? "#f8f9fa" : "white",
                        cursor: !isEditMode ? "not-allowed" : "text",
                        opacity: !isEditMode ? "0.7" : "1",
                        transition: "border-color 0.2s",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "1.5rem",
                }}
              >
                <button
                  onClick={handleEditToggle}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "#117BB8",
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
                    (e.currentTarget.style.backgroundColor = "#0d5a8a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#117BB8")
                  }
                >
                  {isEditMode ? <Save size={18} /> : <Edit2 size={18} />}
                  {isEditMode ? "Save" : "Edit profile"}
                </button>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#212529",
                  margin: "0 0 1.5rem 0",
                }}
              >
                History
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{ position: "relative", flex: "1", maxWidth: "320px" }}
                >
                  <Search
                    style={{
                      position: "absolute",
                      left: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#495057",
                      pointerEvents: "none",
                    }}
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search for an order"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setFocusedField("search")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: "100%",
                      padding: "0.5rem 1rem 0.5rem 2.5rem",
                      border: `1px solid ${
                        focusedField === "search" ? "#212529" : "#dee2e6"
                      }`,
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      color: "#212529",
                      transition: "border-color 0.2s",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      backgroundColor: "transparent",
                      color: "#495057",
                      padding: "0.5rem 1rem",
                      border: "1px solid #dee2e6",
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    <ArrowUpDown size={18} />
                    Sort
                  </button>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      backgroundColor: "transparent",
                      color: "#495057",
                      padding: "0.5rem 1rem",
                      border: "1px solid #dee2e6",
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    <Filter size={18} />
                    Filter
                  </button>
                </div>
              </div>

              <div
                style={{
                  borderBottom: "1px solid #dee2e6",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ display: "flex", gap: "2rem" }}>
                  {["bookings"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        position: "relative",
                        paddingBottom: "0.75rem",
                        paddingLeft: "0.25rem",
                        paddingRight: "0.25rem",
                        background: "none",
                        border: "none",
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: activeTab === tab ? "#117BB8" : "#495057",
                        cursor: "pointer",
                        transition: "color 0.2s",
                      }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {activeTab === tab && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0",
                            left: "0",
                            right: "0",
                            height: "2px",
                            backgroundColor: "#117BB8",
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    tableLayout: "fixed",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "1px solid #dee2e6" }}>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0.75rem 1rem",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#495057",
                          width: "128px",
                        }}
                      >
                        Booking ID
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0.75rem 1rem",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#495057",
                          width: "192px",
                        }}
                      >
                        User name
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0.75rem 1rem",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#495057",
                          width: "160px",
                        }}
                      >
                        Destination
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0.75rem 1rem",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#495057",
                          width: "128px",
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0.75rem 1rem",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#495057",
                          width: "128px",
                        }}
                      >
                        number of persons
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBookings.map((booking, index) => (
                      <tr
                        key={index}
                        style={{ borderBottom: "1px solid #f1f3f5" }}
                      >
                        <td
                          style={{
                            padding: "1rem",
                            fontSize: "0.875rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "#117BB8",
                          }}
                        >
                          {booking.id}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            fontSize: "0.875rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "#212529",
                          }}
                        >
                          {booking.userName}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            fontSize: "0.875rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "#495057",
                          }}
                        >
                          {booking.destination}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            fontSize: "0.875rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "#495057",
                          }}
                        >
                          {booking.date}
                        </td>
                        <td
                          style={{
                            padding: "1rem",
                            fontSize: "0.875rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "#212529",
                          }}
                        >
                          {booking.persons}
                        </td>
                      </tr>
                    ))}
                    {emptyRows.map((_, index) => (
                      <tr
                        key={`empty-${index}`}
                        style={{ borderBottom: "1px solid #f1f3f5" }}
                      >
                        <td style={{ padding: "1rem", height: "3.5rem" }}>
                          &nbsp;
                        </td>
                        <td style={{ padding: "1rem" }}>&nbsp;</td>
                        <td style={{ padding: "1rem" }}>&nbsp;</td>
                        <td style={{ padding: "1rem" }}>&nbsp;</td>
                        <td style={{ padding: "1rem" }}>&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "1.5rem",
                }}
              >
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
                    <span
                      key={`ellipsis-${index}`}
                      style={{ padding: "0.25rem 0.75rem", color: "#495057" }}
                    >
                      .....
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      style={{
                        padding: "0.25rem 0.75rem",
                        backgroundColor:
                          currentPage === page ? "#117BB8" : "transparent",
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
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    opacity: currentPage === totalPages ? "0.5" : "1",
                  }}
                >
                  &gt;
                </button>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
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
          </div>
        </main>
      </div>
    </Layout>
  );
}
