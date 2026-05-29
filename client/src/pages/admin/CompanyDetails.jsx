import React from "react";
import { X, Globe, Phone, MapPin, Mail, Calendar, Briefcase } from "lucide-react";

export const CompanyDetails = ({ company, onClose, jobsCount, jobsData }) => {
  const companyJobs = jobsData.filter((job) => (job.companyId?._id || job.companyId) === company._id);

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
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        paddingBottom: "15px",
        marginBottom: "20px"
      }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>Corporate Profile Card</h3>
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

      {/* Body Scroll */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "25px", paddingRight: "5px" }}>
        {/* Profile Card Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img
            src={
              company.companyLogo?.startsWith("http")
                ? company.companyLogo
                : `http://localhost:5000${company.companyLogo}`
            }
            alt="company logo"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "12px",
              border: "2px solid #10b981",
              objectFit: "cover"
            }}
          />
          <div>
            <h4 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>{company.name}</h4>
            <a
              href={company.website?.startsWith("http") ? company.website : `https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "4px", margin: "3px 0 0 0", color: "#3b82f6", fontSize: "13px", textDecoration: "none" }}
            >
              <Globe size={13} /> {company.website || "No website"}
            </a>
            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              <span style={{
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: "700",
                backgroundColor: company.isApproved ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                color: company.isApproved ? "#10b981" : "#f59e0b"
              }}>
                {company.isApproved ? "Approved Recruiter" : "Pending Approval"}
              </span>
              {company.isBlocked && (
                <span style={{
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: "700",
                  backgroundColor: "rgba(239,68,68,0.15)",
                  color: "#ef4444"
                }}>
                  Blocked
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Corporate stats summary */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          background: "rgba(0,0,0,0.15)",
          borderRadius: "10px",
          padding: "15px"
        }}>
          <div>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Recruiter Location</span>
            <p style={{ margin: "3px 0 0 0", fontSize: "14px", fontWeight: "700" }}>{company.location || "Not Specified"}</p>
          </div>
          <div>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Active Postings</span>
            <p style={{ margin: "3px 0 0 0", fontSize: "14px", fontWeight: "700", color: "#10b981" }}>{jobsCount} Job openings</p>
          </div>
        </div>

        {/* HR Managers Credentials */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h5 style={{ margin: 0, fontSize: "14px", color: "#cbd5e1", fontWeight: "700" }}>HR Contact Information</h5>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#cbd5e1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Mail size={15} style={{ color: "#64748b" }} />
              <span><strong>Name:</strong> {company.HRName}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Mail size={15} style={{ color: "#64748b" }} />
              <span><strong>HR Email:</strong> {company.HREmail || company.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Phone size={15} style={{ color: "#64748b" }} />
              <span><strong>HR Phone:</strong> {company.phoneNumber || "N/A"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <MapPin size={15} style={{ color: "#64748b" }} />
              <span><strong>Location:</strong> {company.location || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Corporate Overview */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h5 style={{ margin: 0, fontSize: "14px", color: "#cbd5e1", fontWeight: "700" }}>About the Company</h5>
          <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1", lineHeight: "1.4" }}>
            {company.aboutCompany || company.description || "No description provided."}
          </p>
        </div>

        {/* List of active jobs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h5 style={{ margin: 0, fontSize: "14px", color: "#cbd5e1", fontWeight: "700" }}>Active Job Postings</h5>
          {companyJobs.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>No active job listings posted.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {companyJobs.map((job) => (
                <div
                  key={job._id}
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
                    <h6 style={{ margin: 0, fontSize: "13px", fontWeight: "700" }}>{job.title}</h6>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>📍 {job.location} | 💰 ₹{job.salary?.toLocaleString()}</span>
                  </div>
                  <span style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: "700",
                    backgroundColor: job.status === "Open" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                    color: job.status === "Open" ? "#10b981" : "#ef4444"
                  }}>
                    {job.status}
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

export default CompanyDetails;
