import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ProfilePopup from "../../components/ProfilePopup/ProfilePopup";
import EditProfile from "../../components/ProfilePopup/EditProfile";
import ConfirmLogout from "../../components/ConfirmLogout/ConfirmLogout";
import "./StudentDashboard.css";

function StudentDashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentData, setStudentData] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { label: "Dashboard Overview", path: "/student-dashboard" },
    { label: "Jobs", path: "/student-dashboard/jobs" },
    { label: "Applied Jobs", path: "/student-dashboard/applied-jobs" },
    { label: "Shortlisted Jobs", path: "/student-dashboard/shortlisted-jobs" },
    { label: "Rejected Jobs", path: "/student-dashboard/rejected-jobs" },
    { label: "Upcoming Interviews", path: "/student-dashboard/upcoming-interviews" },
  ];

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        console.error("Student ID not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/student/getsinglestudent/${studentId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch student data");
      }

      const data = await response.json();
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

  const handleEditProfile = () => {
    setShowProfilePopup(false);
    setShowEditProfile(true);
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
          <p onClick={() => navigate("/settings")} style={{ cursor: "pointer" }}>
            ⚙ Settings
          </p>
          <p onClick={() => navigate("/help")} style={{ cursor: "pointer" }}>
            ❓ Help Center
          </p>
          <p onClick={handleLogout} style={{ cursor: "pointer", color: "#d32f2f", fontWeight: "bold" }}>
            🚪 Logout
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <div className="topbar">
          <div className="nav-links">
            <Link to="/student-dashboard">Dashboard</Link>
            <Link to="/student-dashboard/jobs">Jobs</Link>
            <Link to="/resources">Resources</Link>
          </div>

          <div className="top-right">
            <input
              type="text"
              placeholder="Search for opportunities..."
            />

            <span>🔔</span>
            <span>⚙</span>

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
          onEdit={handleEditProfile}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfile
          studentData={studentData}
          onClose={() => setShowEditProfile(false)}
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
