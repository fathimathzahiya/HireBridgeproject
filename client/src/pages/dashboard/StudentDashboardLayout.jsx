import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ProfilePopup from "../../components/ProfilePopup/ProfilePopup";
import ConfirmLogout from "../../components/ConfirmLogout/ConfirmLogout";
import { studentAPI, notificationAPI } from "../../utils/studentDashboardAPI";
import "./StudentDashboard.css";

function StudentDashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentData, setStudentData] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const menuItems = [
    { label: "Dashboard Overview", path: "/student-dashboard" },
    { label: "Jobs", path: "/student-dashboard/jobs" },
    { label: "Applied Jobs", path: "/student-dashboard/applied-jobs" },
    { label: "Selected Jobs", path: "/student-dashboard/selected-jobs" },
    { label: "Shortlisted Jobs", path: "/student-dashboard/shortlisted-jobs" },
    { label: "Rejected Jobs", path: "/student-dashboard/rejected-jobs" },
    { label: "Upcoming Interviews", path: "/student-dashboard/upcoming-interviews" },
  ];

  const fetchNotifications = async () => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (studentId) {
        const data = await notificationAPI.getStudentNotifications(studentId);
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchStudentData();
    fetchNotifications();

    // Poll notifications every 15 seconds
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (studentId) {
        await notificationAPI.markAllAsRead(studentId);
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleDeleteNotif = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationAPI.deleteNotification(id);
      fetchNotifications();
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        console.error("Student ID not found");
        setLoading(false);
        return;
      }

      const data = await studentAPI.getStudent(studentId);
      setStudentData(data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Show confirmation modal instead of logging out immediately
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear localStorage
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentEmail");
    localStorage.removeItem("hirebridge_token");
    localStorage.removeItem("hirebridge_user");
    
    // Close confirmation modal
    setShowLogoutConfirm(false);
    
    // Navigate to login page
    navigate("/studentlogin");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const isMenuActive = (path) => {
    return location.pathname === path;
  };

  const handleProfileImageClick = () => {
    setShowProfilePopup(true);
  };

  const handleSaveProfile = (updatedData) => {
    setStudentData(updatedData);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="logo">HireBridge</h1>

        <p className="menu-title">MAIN MENU</p>

        <ul className="menu">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={isMenuActive(item.path) ? "active" : ""}
              onClick={() => handleMenuClick(item.path)}
              style={{ cursor: "pointer" }}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <div className="bottom-menu">
          <p onClick={handleLogout} style={{ cursor: "pointer", color: "#d32f2f", fontWeight: "bold" }}>
            🚪 Logout
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <div className="topbar">
          <div className="topbar-left">
            {/* Minimal left side */}
          </div>

          <div className="top-right">
            <div className="notification-bell-container" style={{ position: "relative", marginRight: "20px" }}>
              <span 
                className="notification-bell-icon" 
                onClick={() => setShowNotifDropdown(!showNotifDropdown)} 
                style={{ cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", position: "relative" }}
                title="View Notifications"
              >
                🔔
                {notifications.some(n => !n.isRead) && (
                  <span className="notification-badge" style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#ef4444",
                    borderRadius: "50%",
                    border: "1px solid white"
                  }}></span>
                )}
              </span>

              {showNotifDropdown && (
                <div className="notification-dropdown" style={{
                  position: "absolute",
                  top: "35px",
                  right: "0",
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  width: "320px",
                  maxHeight: "400px",
                  overflowY: "auto",
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <div className="notification-dropdown-header" style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #edf2f7",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#f7fafc",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px"
                  }}>
                    <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "bold", color: "#2d3748" }}>Notifications</h4>
                    {notifications.some(n => !n.isRead) && (
                      <button 
                        onClick={handleMarkAllAsRead} 
                        style={{
                          background: "none",
                          border: "none",
                          color: "#3182ce",
                          fontSize: "11px",
                          cursor: "pointer",
                          padding: 0,
                          fontWeight: "600"
                        }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="notification-dropdown-body" style={{ padding: "8px 0" }}>
                    {notifications.length === 0 ? (
                      <div className="notification-item-empty" style={{
                        padding: "16px",
                        textAlign: "center",
                        color: "#718096",
                        fontSize: "13px"
                      }}>
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif._id} 
                          className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
                          onClick={(e) => handleMarkAsRead(e, notif._id)}
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #edf2f7",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            cursor: "pointer",
                            backgroundColor: notif.isRead ? "transparent" : "#f7fafc",
                            transition: "background-color 0.2s"
                          }}
                        >
                          <div className="notification-item-content" style={{ flex: 1, paddingRight: "10px" }}>
                            <p className="notification-message" style={{
                              margin: "0 0 4px 0",
                              fontSize: "13px",
                              color: notif.isRead ? "#4a5568" : "#1a202c",
                              fontWeight: notif.isRead ? "normal" : "500",
                              lineHeight: "1.4"
                            }}>{notif.message}</p>
                            <span className="notification-time" style={{
                              fontSize: "10px",
                              color: "#a0aec0"
                            }}>
                              {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <button 
                            className="btn-delete-notification" 
                            onClick={(e) => handleDeleteNotif(e, notif._id)}
                            title="Delete notification"
                            style={{
                              background: "none",
                              border: "none",
                              color: "#a0aec0",
                              cursor: "pointer",
                              fontSize: "16px",
                              lineHeight: "1",
                              padding: "0 4px"
                            }}
                            onMouseOver={(e) => e.target.style.color = "#ef4444"}
                            onMouseOut={(e) => e.target.style.color = "#a0aec0"}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="profile-section">
              <span className="student-name">
                {!loading && studentData ? studentData.username : "Student"}
              </span>
              <img
                src={
                  studentData?.profileImage
                    ? studentData.profileImage.startsWith("http")
                      ? studentData.profileImage
                      : `http://localhost:5000${studentData.profileImage}`
                    : "https://i.pravatar.cc/40"
                }
                alt="profile"
                className="profile-image"
                onClick={handleProfileImageClick}
                style={{ cursor: "pointer" }}
                title="Click to view profile"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {children}
      </div>

      {/* Profile Popup */}
      {showProfilePopup && (
        <ProfilePopup
          studentData={studentData}
          onClose={() => setShowProfilePopup(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <ConfirmLogout
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </div>
  );
}

export default StudentDashboardLayout;
