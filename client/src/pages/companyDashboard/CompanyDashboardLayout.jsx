import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import CompanyProfilePopup from "../../components/CompanyProfilePopup/CompanyProfilePopup";
import { toast } from "react-toastify";
import { 
  Bell,
  Trash2, 
  Check, 
  Clock, 
  Briefcase 
} from "lucide-react";
import "./CompanyDashboardLayout.css";

const CompanyDashboardLayout = ({ children }) => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("overview");
  const [companyName, setCompanyName] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [actualCompanyId, setActualCompanyId] = useState(companyId);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [lastNotifCount, setLastNotifCount] = useState(null);

  const menuItems = [
    { id: "overview", label: "Dashboard Overview", icon: "📊" },
    { id: "jobs", label: "Job Postings", icon: "💼" },
    { id: "applicants", label: "Applicants", icon: "👥" },
    { id: "interviews", label: "Interviews", icon: "📅" },
    { id: "profile", label: "Company Profile", icon: "🏢" },
  ];

  const fetchCompanyData = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/company/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCompanyData(data);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("hirebridge_token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/company/notifications", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);

        // Calculate current unread count
        const unreadCount = data.filter(n => !n.isRead).length;

        // Trigger Toast on new unread notification
        if (lastNotifCount !== null && unreadCount > lastNotifCount) {
          const newNotifs = data.filter(n => !n.isRead);
          if (newNotifs.length > 0) {
            toast.info(newNotifs[0].message || "New job application received!");
          }
        }
        setLastNotifCount(unreadCount);
      }
    } catch (error) {
      console.error("Error fetching company notifications:", error);
    }
  };

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("hirebridge_token");
      const response = await fetch(`http://localhost:5000/api/company/notifications/read/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchNotifications();
        toast.success("Alert marked as read.");
      }
    } catch (error) {
      console.error("Error marking notification read:", error);
    }
  };

  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("hirebridge_token");
      const response = await fetch(`http://localhost:5000/api/company/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchNotifications();
        toast.success("Alert log deleted.");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName") || "Company";
    const storedCompanyId = localStorage.getItem("companyId");
    
    setCompanyName(storedCompanyName);
    
    if (companyId) {
      setActualCompanyId(companyId);
      localStorage.setItem("companyId", companyId);
    } else if (storedCompanyId) {
      setActualCompanyId(storedCompanyId);
    }
    
    fetchCompanyData(companyId || storedCompanyId);
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  useEffect(() => {
    // 10-second polling interval
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastNotifCount]);

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    if (menuItems.some((item) => item.id === lastPart)) {
      setActiveMenu(lastPart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("companyId");
    localStorage.removeItem("companyName");
    localStorage.removeItem("companyEmail");
    localStorage.removeItem("hirebridge_token");
    localStorage.removeItem("hirebridge_user");
    navigate("/login");
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="company-dashboard-layout">
      {/* Sidebar */}
      <aside className={`company-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="company-logo">
            {companyName.substring(0, 2).toUpperCase()}
          </h2>
          <button
            className="close-sidebar-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "×" : "☰"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={`/company/${actualCompanyId}/${item.id}`}
              className={`nav-link ${activeMenu === item.id ? "active" : ""}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {isSidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            {isSidebarOpen ? "🚪 Logout" : "🚪"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="company-main-content">
        <header className="company-header" style={{ position: "relative" }}>
          <div className="header-left">
            <button
              className="toggle-sidebar-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
            <h1>Company Dashboard</h1>
          </div>
          
          <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "25px" }}>
            
            {/* Vetted Company Notifications Bell */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px",
                  borderRadius: "50%",
                  transition: "all 0.2s",
                  backgroundColor: "rgba(0,0,0,0.03)"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.06)"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)"}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    background: "#ef4444",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: "800",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid white"
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Recruiter Notifications dropdown drawer */}
              {showNotifDropdown && (
                <div style={{
                  position: "absolute",
                  right: 0,
                  top: "35px",
                  width: "320px",
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  zIndex: 100,
                  padding: "10px 0",
                  maxHeight: "400px",
                  overflowY: "auto"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 15px",
                    borderBottom: "1px solid #f1f5f9"
                  }}>
                    <span style={{ fontWeight: "700", fontSize: "14px", color: "#1e293b" }}>Notifications</span>
                    <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>{unreadCount} Unread</span>
                  </div>

                  {notifications.length === 0 ? (
                    <p style={{ textAlign: "center", padding: "20px 15px", margin: 0, color: "#64748b", fontSize: "13px" }}>
                      No notifications received yet.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {notifications.map((item) => (
                        <div
                          key={item._id}
                          style={{
                            display: "flex",
                            gap: "12px",
                            padding: "12px 15px",
                            borderBottom: "1px solid #f8fafc",
                            background: item.isRead ? "transparent" : "#f0fdf4",
                            transition: "background 0.2s"
                          }}
                        >
                          <div style={{
                            background: "rgba(16,185,129,0.1)",
                            padding: "8px",
                            borderRadius: "50%",
                            color: "#10b981",
                            display: "flex",
                            alignItems: "center",
                            height: "fit-content"
                          }}>
                            <Briefcase size={14} />
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                              <span style={{ fontWeight: "700", fontSize: "12px", color: "#1e293b" }}>
                                {item.studentId?.username || "Student"}
                              </span>
                              <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                                <Clock size={8} style={{ marginRight: "2px" }} />
                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#475569", lineHeight: "1.4" }}>
                              {item.message}
                            </p>

                            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                              {!item.isRead && (
                                <button
                                  onClick={(e) => handleMarkAsRead(e, item._id)}
                                  style={{
                                    border: "none",
                                    background: "none",
                                    color: "#10b981",
                                    fontSize: "10px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "2px"
                                  }}
                                >
                                  <Check size={10} /> Mark Read
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDeleteNotification(e, item._id)}
                                style={{
                                  border: "none",
                                  background: "none",
                                  color: "#ef4444",
                                  fontSize: "10px",
                                  fontWeight: "700",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "2px"
                                }}
                              >
                                <Trash2 size={10} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <span className="company-name">{companyName}</span>
          </div>
        </header>

        <section className="dashboard-content">{children}</section>
      </main>

      {/* Company Profile Popup */}
      {showProfilePopup && (
        <CompanyProfilePopup
          companyData={companyData}
          loading={loading}
          onClose={() => setShowProfilePopup(false)}
          onEdit={() => {
            setShowProfilePopup(false);
            navigate(`/company/${actualCompanyId}/profile`);
          }}
        />
      )}
    </div>
  );
};

export default CompanyDashboardLayout;
