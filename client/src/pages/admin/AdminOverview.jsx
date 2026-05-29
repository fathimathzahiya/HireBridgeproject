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
  CheckCircle,
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

  const { stats, charts, recentActivity } = data || {};

  const cardData = [
    { label: "Total Students", value: stats?.totalStudents || 0, icon: Users, color: "#3b82f6" },
    { label: "Vetted Companies", value: stats?.totalCompanies || 0, icon: Building2, color: "#10b981" },
    { label: "Active Jobs", value: stats?.totalJobs || 0, icon: Briefcase, color: "#f59e0b" },
    { label: "Total Applications", value: stats?.totalApplications || 0, icon: FileText, color: "#ec4899" },
    { label: "Interviews Scheduled", value: stats?.totalInterviews || 0, icon: Calendar, color: "#8b5cf6" },
    { label: "Selected Students", value: stats?.selectedStudents || 0, icon: Award, color: "#10b981" },
    { label: "Placement Success Ratio", value: `${stats?.successRatio || 0}%`, icon: TrendingUp, color: "#3b82f6" },
    { label: "Active Recruiters", value: stats?.activeRecruiters || 0, icon: CheckCircle, color: "#f59e0b" },
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

      {/* Charts Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
        gap: "20px"
      }}>
        {/* Department Placement Ratios Bar Chart */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          padding: "25px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Department-wise Placements</h4>
            <p style={{ margin: "2px 0 0 0", color: "#64748b", fontSize: "12px" }}>Placed vs total registered students by branch</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {charts?.departmentPlacements?.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#64748b", textAlign: "center", padding: "40px" }}>No placement data registered.</p>
            ) : (
              charts?.departmentPlacements?.map((dept, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ fontWeight: "600" }}>{dept.department}</span>
                    <span style={{ color: "#64748b" }}>{dept.placed} Placed / {dept.total} Registered ({dept.percentage}%)</span>
                  </div>
                  {/* Custom progress bar */}
                  <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.1)", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{
                      width: `${dept.percentage}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                      borderRadius: "10px",
                      transition: "width 1s ease"
                    }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Monthly Applications Line Chart */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          padding: "25px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Application Trends</h4>
            <p style={{ margin: "2px 0 0 0", color: "#64748b", fontSize: "12px" }}>Monthly student application volumes</p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", height: "200px" }}>
            {/* Custom SVG Line Chart */}
            <svg viewBox="0 0 500 200" style={{ width: "100%", height: "100%" }}>
              {/* Background grid lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.1)" />

              {/* Line charts points path */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="4"
                points="80,160 160,135 240,110 320,60 400,20"
              />

              <circle cx="80" cy="160" r="5" fill="#3b82f6" />
              <circle cx="160" cy="135" r="5" fill="#3b82f6" />
              <circle cx="240" cy="110" r="5" fill="#3b82f6" />
              <circle cx="320" cy="60" r="5" fill="#3b82f6" />
              <circle cx="400" cy="20" r="5" fill="#3b82f6" />

              {/* X axis labels */}
              <text x="80" y="190" fill="#64748b" fontSize="12" textAnchor="middle">Jan</text>
              <text x="160" y="190" fill="#64748b" fontSize="12" textAnchor="middle">Feb</text>
              <text x="240" y="190" fill="#64748b" fontSize="12" textAnchor="middle">Mar</text>
              <text x="320" y="190" fill="#64748b" fontSize="12" textAnchor="middle">Apr</text>
              <text x="400" y="190" fill="#64748b" fontSize="12" textAnchor="middle">May</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Corporate Hiring Shares & Recent Activities */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "20px"
      }}>
        {/* Recruiter Corporate hiring share stats */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          padding: "25px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Hiring Company Statistics</h4>
            <p style={{ margin: "2px 0 0 0", color: "#64748b", fontSize: "12px" }}>Top 5 recruiters by application count</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {charts?.companyHiringStats?.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#64748b", textAlign: "center", padding: "40px" }}>No hiring company statistics available.</p>
            ) : (
              charts?.companyHiringStats?.map((comp, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      color: "#3b82f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: "700"
                    }}>{idx + 1}</span>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>{comp.company}</span>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#3b82f6" }}>{comp.applications} Applications</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          padding: "25px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Recent Activities</h4>
            <p style={{ margin: "2px 0 0 0", color: "#64748b", fontSize: "12px" }}>Chronological list of platform events</p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxHeight: "260px",
            overflowY: "auto"
          }}>
            {recentActivity?.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#64748b", textAlign: "center", padding: "40px" }}>No recent events logged.</p>
            ) : (
              recentActivity?.map((act, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "8px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(255,255,255,0.01)"
                }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: act.type === "student" ? "#3b82f6" : act.type === "company" ? "#10b981" : "#f59e0b",
                    marginTop: "6px"
                  }}></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "13px", color: "#e2e8f0" }}>{act.text}</p>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>{new Date(act.time).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
