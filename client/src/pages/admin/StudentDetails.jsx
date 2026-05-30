import React, { useState, useEffect, useCallback } from "react";
import { X, FileText, Globe } from "lucide-react";
import { adminService } from "../../services/adminService";

export const StudentDetails = ({ student, onClose, onViewResume }) => {
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  const fetchStudentApplications = useCallback(async () => {
    try {
      setLoadingApps(true);
      const data = await adminService.getApplications();
      const filtered = data.filter((app) => (app.studentId?._id || app.studentId) === student._id);
      setApplications(filtered);
    } catch (err) {
      console.error("Error loading application history:", err);
    } finally {
      setLoadingApps(false);
    }
  }, [student._id]);

  useEffect(() => {
    fetchStudentApplications();
  }, [fetchStudentApplications]);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      right: 0,
      width: "500px",
      height: "100vh",
      background: "rgba(30, 41, 59, 0.95)",
      backdropFilter: "blur(20px)",
      borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
      zIndex: 150,
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      padding: "30px",
      boxSizing: "border-box"
    }}>
      {/* Drawer Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        paddingBottom: "15px",
        marginBottom: "20px"
      }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>Student Profile Card</h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#94a3b8",
            display: "flex",
            alignItems: "center",
            padding: "5px",
            borderRadius: "6px"
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Drawer Body Scroll */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "25px", paddingRight: "5px" }}>
        {/* Profile Card Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img
            src={
              student.profileImage?.startsWith("http")
                ? student.profileImage
                : `http://localhost:5000${student.profileImage}`
            }
            alt="student"
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              border: "3px solid #3b82f6",
              objectFit: "cover"
            }}
          />
          <div>
            <h4 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>{student.username}</h4>
            <p style={{ margin: "3px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>{student.email}</p>
            <span style={{
              display: "inline-block",
              marginTop: "6px",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: "700",
              backgroundColor: student.isBlocked ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)",
              color: student.isBlocked ? "#ef4444" : "#10b981"
            }}>
              {student.isBlocked ? "Locked / Suspended" : "Active / Verified"}
            </span>
          </div>
        </div>

        {/* Academic Indices Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          background: "rgba(0,0,0,0.15)",
          borderRadius: "10px",
          padding: "15px"
        }}>
          <div>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Branch Branch</span>
            <p style={{ margin: "3px 0 0 0", fontSize: "15px", fontWeight: "700" }}>{student.department || "General"}</p>
          </div>
          <div>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Academic CGPA</span>
            <p style={{ margin: "3px 0 0 0", fontSize: "15px", fontWeight: "700", color: "#3b82f6" }}>{student.cgpa?.toFixed(2) || "N/A"}</p>
          </div>
        </div>

        {/* Professional Qualifications */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h5 style={{ margin: 0, fontSize: "14px", color: "#cbd5e1", fontWeight: "700" }}>Technical Qualifications</h5>
          <div>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>SKILLS MATRIX</span>
            <p style={{ margin: "3px 0 0 0", fontSize: "13px", color: "#cbd5e1" }}>{student.skills || "None declared."}</p>
          </div>
          <div style={{ marginTop: "5px" }}>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>PROJECT DESCRIPTION</span>
            <p style={{ margin: "3px 0 0 0", fontSize: "13px", color: "#cbd5e1", lineHeight: "1.4" }}>{student.project || "None declared."}</p>
          </div>
        </div>

        {/* Credentials and PDF Streaming actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h5 style={{ margin: 0, fontSize: "14px", color: "#cbd5e1", fontWeight: "700" }}>Documents & External Links</h5>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {student.resume && (
              <button
                onClick={() => onViewResume(student.resume)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#0284c7",
                  border: "none",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600"
                }}
              >
                <FileText size={14} /> Download Secure Resume PDF
              </button>
            )}

            {student.github && (
              <a
                href={student.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#334155",
                  color: "#e2e8f0",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: "600"
                }}
              >
                <Globe size={14} /> GitHub Profile
              </a>
            )}

            {student.linkedin && (
              <a
                href={student.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#0077b5",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: "600"
                }}
              >
                <Globe size={14} /> LinkedIn Network
              </a>
            )}
          </div>
        </div>

        {/* Placement Applications History */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h5 style={{ margin: 0, fontSize: "14px", color: "#cbd5e1", fontWeight: "700" }}>Application & Placement History</h5>
          {loadingApps ? (
            <p style={{ fontSize: "12px", color: "#64748b" }}>Loading application records...</p>
          ) : applications.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>No job applications submitted yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {applications.map((app) => (
                <div
                  key={app._id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    padding: "12px",
                    backgroundColor: "rgba(0,0,0,0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <h6 style={{ margin: 0, fontSize: "13px", fontWeight: "700" }}>{app.jobId?.title || "Role"}</h6>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>🏢 {app.companyId?.name || "Company"}</span>
                  </div>
                  <span style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: "700",
                    backgroundColor:
                      app.status === "Selected"
                        ? "rgba(16, 185, 129, 0.15)"
                        : app.status === "Rejected"
                        ? "rgba(239, 68, 68, 0.15)"
                        : "rgba(59, 130, 246, 0.15)",
                    color:
                      app.status === "Selected"
                        ? "#10b981"
                        : app.status === "Rejected"
                        ? "#ef4444"
                        : "#3b82f6"
                  }}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
