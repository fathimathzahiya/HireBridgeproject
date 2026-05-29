import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import {
  Search,
  Calendar,
  Check,
  XCircle,
  Video,
  Clock,
  Briefcase
} from "lucide-react";

export const AdminInterviewManagement = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const data = await adminService.getInterviews();
      setInterviews(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch platform interviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualComplete = async (id) => {
    try {
      await adminService.completeInterview(id);
      toast.success("Interview marked as Completed successfully.");
      fetchInterviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete interview.");
    }
  };

  // Filter interviews
  const filteredInterviews = interviews.filter((item) => {
    const matchesSearch =
      (item.studentId?.username && item.studentId.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.companyId?.name && item.companyId.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.jobId?.title && item.jobId.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "All" ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Interview Management</h2>
          <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>Audit corporate meetings schedules, platform link details, and final candidate evaluation results.</p>
        </div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#8b5cf6", background: "rgba(139,92,246,0.1)", padding: "8px 16px", borderRadius: "8px" }}>
          Total: {filteredInterviews.length} Interviews
        </div>
      </div>

      {/* Advanced search filters */}
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
            placeholder="Search interviews by student, recruiter company, or role..."
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

        {/* Filter dropdown */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", flex: "3 1 400px" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ flex: "1 1 150px", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.6)", color: "white", cursor: "pointer", fontSize: "13px" }}
          >
            <option value="All">All Scheduled Stages</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
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

      {/* Main Interviews Grid list */}
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        overflowX: "auto"
      }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading platform interviews...</p>
        ) : filteredInterviews.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No matching interview records found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.1)" }}>
                <th style={{ padding: "16px 20px" }}>Student Candidate</th>
                <th style={{ padding: "16px 20px" }}>Job Role Title</th>
                <th style={{ padding: "16px 20px" }}>Company Recruiter</th>
                <th style={{ padding: "16px 20px" }}>Interview Date & Time</th>
                <th style={{ padding: "16px 20px" }}>Meeting Link</th>
                <th style={{ padding: "16px 20px" }}>Meeting Status</th>
                <th style={{ padding: "16px 20px" }}>Evaluation Result</th>
                <th style={{ padding: "16px 20px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterviews.map((item) => (
                <tr key={item._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }} className="table-row-hover">
                  <td style={{ padding: "16px 20px", fontWeight: "600" }}>{item.studentId?.username || "Deleted Student"}</td>
                  <td style={{ padding: "16px 20px", color: "#cbd5e1" }}>{item.jobId?.title || "Deleted Job"}</td>
                  <td style={{ padding: "16px 20px" }}>{item.companyId?.name || "Deleted Company"}</td>
                  <td style={{ padding: "16px 20px", color: "#cbd5e1" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={13} style={{ color: "#64748b" }} />
                      <span>{new Date(item.date).toLocaleDateString()} at {item.time}</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    {item.googleMeetLink ? (
                      <a
                        href={item.googleMeetLink.startsWith("http") ? item.googleMeetLink : `https://${item.googleMeetLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "6px", color: "#3b82f6", textDecoration: "none" }}
                      >
                        <Video size={14} /> Join Meeting
                      </a>
                    ) : "N/A"}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "700",
                      backgroundColor:
                        item.status === "Completed"
                          ? "rgba(16, 185, 129, 0.1)"
                          : item.status === "Cancelled"
                          ? "rgba(239, 68, 68, 0.1)"
                          : "rgba(245, 158, 11, 0.1)",
                      color:
                        item.status === "Completed"
                          ? "#10b981"
                          : item.status === "Cancelled"
                          ? "#ef4444"
                          : "#f59e0b"
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "700",
                      backgroundColor:
                        item.result === "Selected"
                          ? "rgba(16, 185, 129, 0.15)"
                          : item.result === "Rejected"
                          ? "rgba(239, 68, 68, 0.15)"
                          : "rgba(148, 163, 184, 0.15)",
                      color:
                        item.result === "Selected"
                          ? "#10b981"
                          : item.result === "Rejected"
                          ? "#ef4444"
                          : "#cbd5e1"
                    }}>{item.result}</span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    {item.status === "Scheduled" && (
                      <button
                        onClick={() => handleManualComplete(item._id)}
                        style={{
                          border: "none",
                          background: "rgba(16,185,129,0.1)",
                          color: "#10b981",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "11px",
                          fontWeight: "700",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <Check size={12} /> Mark Completed
                      </button>
                    )}
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

export default AdminInterviewManagement;
