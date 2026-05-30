import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  Calendar,
  Award,
  TrendingUp
} from "lucide-react";

export const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load platform analytics.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flex: 1, height: "80vh", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "15px", color: "#64748b" }}>Retrieving platform analytics...</p>
      </div>
    );
  }

  const { stats } = data || {};

  const cardData = [
    { label: "Total Students", value: stats?.totalStudents || 0, icon: Users, color: "#3b82f6" },
    { label: "Vetted Companies", value: stats?.totalCompanies || 0, icon: Building2, color: "#10b981" },
    { label: "Active Jobs", value: stats?.totalJobs || 0, icon: Briefcase, color: "#f59e0b" },
    { label: "Total Applications", value: stats?.totalApplications || 0, icon: FileText, color: "#ec4899" },
    { label: "Interviews Scheduled", value: stats?.totalInterviews || 0, icon: Calendar, color: "#8b5cf6" },
    { label: "Selected Students", value: stats?.selectedStudents || 0, icon: Award, color: "#10b981" },
    { label: "Placement Success Ratio", value: `${stats?.successRatio || 0}%`, icon: TrendingUp, color: "#3b82f6" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Dashboard Overview</h2>
        <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>Monitor college placements and recruiting pipelines in real-time.</p>
      </div>

      {/* Analytics KPI grid cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "20px"
      }}>
        {cardData.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.05)";
              }}
            >
              <div>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {card.label}
                </span>
                <h3 style={{ margin: "5px 0 0 0", fontSize: "28px", fontWeight: "800" }}>{card.value}</h3>
              </div>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: `${card.color}15`,
                color: card.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default AdminOverview;
