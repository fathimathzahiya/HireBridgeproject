import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./CompanyDashboardLayout.css";

const CompanyDashboardLayout = ({ children }) => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("overview");
  const [companyName, setCompanyName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Get company name from localStorage or props
    const storedCompanyName = localStorage.getItem("companyName") || "Company";
    setCompanyName(storedCompanyName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("companyId");
    localStorage.removeItem("companyName");
    localStorage.removeItem("companyEmail");
    navigate("/login");
  };

  const menuItems = [
    { id: "overview", label: "Dashboard Overview", icon: "📊" },
    { id: "jobs", label: "Job Postings", icon: "💼" },
    { id: "applicants", label: "Applicants", icon: "👥" },
    { id: "interviews", label: "Interviews", icon: "📅" },
    { id: "profile", label: "Company Profile", icon: "🏢" },
  ];

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
              to={`/company/${companyId}/${item.id}`}
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
        <header className="company-header">
          <div className="header-left">
            <button
              className="toggle-sidebar-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
            <h1>Company Dashboard</h1>
          </div>
          <div className="header-right">
            <span className="company-name">{companyName}</span>
            <button className="header-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className="dashboard-content">{children}</section>
      </main>
    </div>
  );
};

export default CompanyDashboardLayout;
