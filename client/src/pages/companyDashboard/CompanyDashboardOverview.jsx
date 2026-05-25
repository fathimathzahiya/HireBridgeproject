import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { companyAPI } from "../../utils/companyDashboardAPI";
import "./CompanyDashboardOverview.css";

const CompanyDashboardOverview = () => {
  const { companyId } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await companyAPI.getCompanyDashboard(companyId);
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchDashboardData();
    }
  }, [companyId]);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const stats = dashboardData?.stats || {};
  const company = dashboardData?.company || {};

  const statCards = [
    {
      title: "Active Job Posts",
      value: stats.openJobs || 0,
      icon: "💼",
      color: "#3498db",
    },
    {
      title: "Total Applicants",
      value: stats.totalApplicants || 0,
      icon: "👥",
      color: "#2ecc71",
    },
    {
      title: "Shortlisted Candidates",
      value: stats.shortlistedApplicants || 0,
      icon: "⭐",
      color: "#f39c12",
    },
    {
      title: "Interviews Scheduled",
      value: stats.interviewsScheduled || 0,
      icon: "📅",
      color: "#9b59b6",
    },
  ];

  return (
    <div className="company-dashboard-overview">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h2>Welcome, {company.name}! 👋</h2>
          <p>Here's an overview of your recruitment activities</p>
        </div>
        {company.companyLogo && (
          <img src={company.companyLogo} alt={company.name} className="company-logo-img" />
        )}
      </section>

      {/* Stats Cards */}
      <section className="stats-section">
        <div className="stats-grid">
          {statCards.map((card, index) => (
            <div key={index} className="stat-card" style={{ borderLeftColor: card.color }}>
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-content">
                <h3>{card.title}</h3>
                <p className="stat-value">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Company Info */}
      <section className="company-info-section">
        <div className="info-card">
          <h3>Company Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Company Name</span>
              <span className="info-value">{company.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{company.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Location</span>
              <span className="info-value">{company.location}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Industry</span>
              <span className="info-value">{company.industry || "Not specified"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Company Size</span>
              <span className="info-value">{company.companySize || "Not specified"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Website</span>
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="info-value">
                {company.website}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <a href={`/company/${companyId}/jobs`} className="action-btn primary">
            <span>📝</span>
            Post New Job
          </a>
          <a href={`/company/${companyId}/applicants`} className="action-btn secondary">
            <span>👥</span>
            View Applicants
          </a>
          <a href={`/company/${companyId}/interviews`} className="action-btn tertiary">
            <span>📅</span>
            Schedule Interview
          </a>
          <a href={`/company/${companyId}/profile`} className="action-btn quaternary">
            <span>⚙️</span>
            Edit Profile
          </a>
        </div>
      </section>
    </div>
  );
};

export default CompanyDashboardOverview;
