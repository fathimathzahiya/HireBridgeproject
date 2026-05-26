import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { companyAPI } from "../../utils/companyDashboardAPI";
import "./CompanyDashboardOverview.css";

const CompanyDashboardOverview = () => {
  const { companyId: urlCompanyId } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get companyId from URL or localStorage
  const companyId = urlCompanyId || localStorage.getItem('companyId');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching dashboard for company ID:', companyId);
        
        if (!companyId) {
          setError("Company ID not found");
          setLoading(false);
          return;
        }
        
        const data = await companyAPI.getCompanyDashboard(companyId);
        console.log('Dashboard data received:', data);
        
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err.response?.data?.error || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    // Fetch data when component mounts or when companyId changes
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

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to={`/company/${companyId}/jobs`} className="action-btn primary">
            <span>📝</span>
            Post New Job
          </Link>
          <Link to={`/company/${companyId}/applicants`} className="action-btn secondary">
            <span>👥</span>
            View Applicants
          </Link>
          <Link to={`/company/${companyId}/interviews`} className="action-btn tertiary">
            <span>📅</span>
            Schedule Interview
          </Link>
          <Link to={`/company/${companyId}/profile`} className="action-btn quaternary">
            <span>⚙️</span>
            Edit Profile
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CompanyDashboardOverview;
