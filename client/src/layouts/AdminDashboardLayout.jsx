import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { adminService } from "../services/adminService";
import { toast } from "react-toastify";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileSpreadsheet,
  Calendar,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  ChevronDown,
  Trash2,
  Check
} from "lucide-react";

export const AdminDashboardLayout = ({ children }) => {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("admin_theme") === "dark";
  });
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, path: "/admin/overview" },
    { id: "students", label: "Students", icon: Users, path: "/admin/students" },
    { id: "companies", label: "Companies", icon: Building2, path: "/admin/companies" },
    { id: "jobs", label: "Jobs", icon: Briefcase, path: "/admin/jobs" },
    { id: "applications", label: "Applications", icon: FileSpreadsheet, path: "/admin/applications" },
    { id: "interviews", label: "Interviews", icon: Calendar, path: "/admin/interviews" },
    { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("admin_theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("admin_theme", "light");
    }
  }, [darkMode]);

  const isActiveMenu = (path) => {
    return location.pathname === path;
  };

  const fetchNotifications = async () => {
    try {
      const data = await adminService.getAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Polling every minute
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await adminService.markNotificationAsRead(id);
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await adminService.deleteNotification(id);
      toast.success("Notification deleted");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to jobs or students based on query or just trigger general alert
      navigate(`/admin/jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: darkMode ? "#0f172a" : "#f1f5f9",
      color: darkMode ? "#f8fafc" : "#1e293b",
      fontFamily: "'Inter', sans-serif",
      transition: "background-color 0.3s, color 0.3s"
    }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: sidebarOpen ? "260px" : "80px",
        background: darkMode ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(16px)",
        borderRight: darkMode ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "fixed",
        height: "100vh",
        zIndex: 50,
      }}>
        <div style={{
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "space-between" : "center",
          borderBottom: darkMode ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.05)"
        }}>
          {sidebarOpen ? (
            <h1 style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>HireBridge Admin</h1>
          ) : (
            <span style={{ fontSize: "20px", fontWeight: "800", color: "#3b82f6" }}>HB</span>
          )}
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: darkMode ? "#94a3b8" : "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px",
              borderRadius: "6px"
            }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav style={{
          flex: 1,
          padding: "20px 10px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          overflowY: "auto"
        }}>
          {menuItems.map((item) => {
            const active = isActiveMenu(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px",
                  borderRadius: "8px",
                  color: active 
                    ? "#ffffff" 
                    : (darkMode ? "#94a3b8" : "#64748b"),
                  backgroundColor: active 
                    ? "#3b82f6" 
                    : "transparent",
                  textDecoration: "none",
                  fontWeight: active ? "600" : "500",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  justifyContent: sidebarOpen ? "flex-start" : "center"
                }}
                onMouseOver={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)";
                    e.currentTarget.style.color = darkMode ? "#f8fafc" : "#1e293b";
                  }
                }}
                onMouseOut={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = darkMode ? "#94a3b8" : "#64748b";
                  }
                }}
              >
                <Icon size={18} style={{ marginRight: sidebarOpen ? "12px" : "0" }} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={{
          padding: "20px 10px",
          borderTop: darkMode ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.05)"
        }}>
          <button
            onClick={logout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: "12px",
              borderRadius: "8px",
              color: "#ef4444",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.2s ease",
              justifyContent: sidebarOpen ? "flex-start" : "center"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.05)"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <LogOut size={18} style={{ marginRight: sidebarOpen ? "12px" : "0" }} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel Content Container */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? "260px" : "80px",
        transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}>
        {/* Top Navbar */}
        <header style={{
          height: "70px",
          background: darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: darkMode ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          position: "sticky",
          top: 0,
          zIndex: 40
        }}>
          {/* Left spacer to keep alignment */}
          <div style={{ display: "flex", flex: 1 }} />

          {/* Right widgets */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>


            {/* Notification system */}
            <div style={{ position: "relative" }}>
              <div 
                style={{ cursor: "pointer", position: "relative", padding: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
              >
                <Bell size={20} style={{ color: darkMode ? "#94a3b8" : "#64748b" }} />
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    background: "#ef4444",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: "bold",
                    width: "16px",
                    height: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%"
                  }}>{unreadCount}</span>
                )}
              </div>

              {notificationDropdownOpen && (
                <div style={{
                  position: "absolute",
                  top: "45px",
                  right: "0",
                  width: "320px",
                  maxHeight: "400px",
                  overflowY: "auto",
                  backgroundColor: darkMode ? "#1e293b" : "white",
                  border: darkMode ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  padding: "0",
                  zIndex: 100
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: darkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>Notifications</h4>
                    {unreadCount > 0 && <span style={{ fontSize: "11px", background: "#3b82f6", color: "white", padding: "2px 8px", borderRadius: "10px" }}>{unreadCount} New</span>}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                      No notifications available.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {notifications.map((notif) => (
                        <div key={notif._id} style={{
                          padding: "12px 16px",
                          borderBottom: darkMode ? "1px solid rgba(255,255,255,0.02)" : "1px solid #f1f5f9",
                          background: notif.isRead ? "transparent" : (darkMode ? "rgba(59, 130, 246, 0.05)" : "rgba(59, 130, 246, 0.05)"),
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "10px",
                          transition: "background 0.2s"
                        }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: darkMode ? "#f8fafc" : "#1e293b", fontWeight: notif.isRead ? "400" : "600" }}>{notif.message}</p>
                            <span style={{ fontSize: "11px", color: "#94a3b8" }}>{new Date(notif.createdAt).toLocaleString()}</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            {!notif.isRead && (
                              <button onClick={(e) => handleMarkAsRead(notif._id, e)} title="Mark as read" style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", padding: "2px" }}>
                                <Check size={14} />
                              </button>
                            )}
                            <button onClick={(e) => handleDeleteNotification(notif._id, e)} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "2px" }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Inner views rendering */}
        <main style={{
          flex: 1,
          padding: "30px",
          overflowY: "auto"
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};
