import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import {
  Search,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAppTimeline, setSelectedAppTimeline] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await adminService.getApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load applications list.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job application? This action will completely remove the student's entry.")) {
      try {
        await adminService.deleteApplication(id);
        toast.success("Job application removed successfully.");
        if (selectedAppTimeline?._id === id) setSelectedAppTimeline(null);
        fetchApplications();
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove application.");
      }
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const styles = {
      Applied: { bg: "rgba(59,130,246,0.1)", fg: "#3b82f6" },
      "Under Review": { bg: "rgba(245,158,11,0.1)", fg: "#f59e0b" },
      Shortlisted: { bg: "rgba(139,92,246,0.1)", fg: "#8b5cf6" },
      "Interview Scheduled": { bg: "rgba(99,102,241,0.1)", fg: "#6366f1" },
      Selected: { bg: "rgba(16,185,129,0.1)", fg: "#10b981" },
      Rejected: { bg: "rgba(239,68,68,0.1)", fg: "#ef4444" },
    };
    const style = styles[status] || { bg: "rgba(148,163,184,0.1)", fg: "#94a3b8" };
    return (
      <span style={{
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: "700",
        backgroundColor: style.bg,
        color: style.fg
      }}>{status}</span>
    );
  };

  // Render Horizontal Timeline Tracker
  const renderTimeline = (app) => {
    const milestones = ["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected"];
    const isRejected = app.status === "Rejected";
    
    // Find index of current status
    let currentIdx = milestones.indexOf(app.status);
    if (isRejected) currentIdx = 4; // Render rejected at the end of path

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        padding: "20px",
        background: "rgba(0,0,0,0.15)",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div>
            <h5 style={{ margin: 0, fontSize: "14px", fontWeight: "700" }}>Application Progress Tracker</h5>
            <p style={{ margin: "2px 0 0 0", color: "#64748b", fontSize: "11px" }}>Candidate: {app.studentId?.username} (CGPA: {app.studentId?.cgpa?.toFixed(2)})</p>
          </div>
          <button 
            onClick={() => setSelectedAppTimeline(null)}
            style={{ border: "none", background: "none", color: "#94a3b8", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
          >
            Hide Tracker
          </button>
        </div>

        {/* Timeline Horizontal Line container */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          padding: "10px 0"
        }}>
          {milestones.map((milestone, idx) => {
            const completed = idx <= currentIdx && !(isRejected && idx === 4);
            const active = idx === currentIdx && !isRejected;
            const stepName = (isRejected && idx === 4) ? "Rejected" : milestone;

            return (
              <React.Fragment key={idx}>
                {/* Node element */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  zIndex: 2,
                  width: "80px",
                  textAlign: "center"
                }}>
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: active 
                      ? "#3b82f6" 
                      : completed 
                      ? "#10b981" 
                      : isRejected && idx === 4 
                      ? "#ef4444" 
                      : "rgba(255,255,255,0.1)",
                    border: "2px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "700",
                    fontSize: "11px",
                    boxShadow: active ? "0 0 10px #3b82f6" : "none",
                    transition: "all 0.3s ease"
                  }}>
                    {active ? <Clock size={14} /> : (completed ? <CheckCircle size={14} /> : (isRejected && idx === 4 ? <XCircle size={14} /> : idx + 1))}
                  </div>
                  <span style={{
                    marginTop: "8px",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: active ? "#3b82f6" : (completed ? "#10b981" : (isRejected && idx === 4 ? "#ef4444" : "#64748b"))
                  }}>
                    {stepName}
                  </span>
                </div>

                {/* Horizontal progress path connector */}
                {idx < 4 && (
                  <div style={{
                    flex: 1,
                    height: "3px",
                    backgroundColor: idx < currentIdx ? "#10b981" : "rgba(255,255,255,0.1)",
                    margin: "0 -10px",
                    transform: "translateY(-10px)",
                    zIndex: 1
                  }}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // Filter applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      (app.studentId?.username && app.studentId.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.jobId?.title && app.jobId.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.companyId?.name && app.companyId.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "All" ? true : app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Application Management</h2>
          <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>Monitor applicant funnels, track student progress, and audit placement timelines.</p>
        </div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#ec4899", background: "rgba(236,72,153,0.1)", padding: "8px 16px", borderRadius: "8px" }}>
          Total: {filteredApps.length} Applications
        </div>
      </div>

      {/* Timeline tracker view */}
      {selectedAppTimeline && renderTimeline(selectedAppTimeline)}

      {/* Advanced search and filter controls */}
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        alignItems: "center"
      }}>
        {/* Search */}
        <div style={{ flex: "2 1 250px", position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search applications by student, company, or job role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 15px 10px 40px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(0,0,0,0.1)",
              color: "white",
              outline: "none",
              fontSize: "14px"
            }}
          />
        </div>

        {/* Filter select dropdown */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", flex: "3 1 400px" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ flex: "1 1 150px", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.6)", color: "white", cursor: "pointer", fontSize: "13px" }}
          >
            <option value="All">All Application Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>

          {(searchQuery || statusFilter !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
              }}
              style={{
                padding: "10px 15px",
                backgroundColor: "#ef4444",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Applications Table Grid */}
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        overflowX: "auto"
      }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading applications...</p>
        ) : filteredApps.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No matching application records found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.1)" }}>
                <th style={{ padding: "16px 20px" }}>Student Candidate</th>
                <th style={{ padding: "16px 20px" }}>Job Role Title</th>
                <th style={{ padding: "16px 20px" }}>Company Recruiter</th>
                <th style={{ padding: "16px 20px" }}>Academic CGPA</th>
                <th style={{ padding: "16px 20px" }}>Applied Date</th>
                <th style={{ padding: "16px 20px" }}>Current Status</th>
                <th style={{ padding: "16px 20px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }} className="table-row-hover">
                  <td style={{ padding: "16px 20px", fontWeight: "600" }}>{app.studentId?.username || "Deleted Student"}</td>
                  <td style={{ padding: "16px 20px", color: "#cbd5e1" }}>{app.jobId?.title || "Deleted Job"}</td>
                  <td style={{ padding: "16px 20px" }}>{app.companyId?.name || "Deleted Company"}</td>
                  <td style={{ padding: "16px 20px", fontWeight: "700" }}>{app.studentId?.cgpa?.toFixed(2) || "N/A"}</td>
                  <td style={{ padding: "16px 20px", color: "#94a3b8" }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td style={{ padding: "16px 20px" }}>{getStatusBadge(app.status)}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setSelectedAppTimeline(app)}
                        style={{ border: "none", background: "rgba(59,130,246,0.1)", color: "#3b82f6", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}
                      >
                        Track Progress
                      </button>

                      <button
                        onClick={() => handleDelete(app._id)}
                        style={{ border: "none", background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "6px", borderRadius: "6px", cursor: "pointer" }}
                        title="Remove Application record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ApplicationManagement;
