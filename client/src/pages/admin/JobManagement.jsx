import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import {
  Search,
  XCircle,
  Edit,
  Trash2,
  AlertTriangle,
  Briefcase
} from "lucide-react";

export const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cgpaFilter, setCgpaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Edit State
  const [editingJob, setEditingJob] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    salary: "",
    vaccancy: "",
    minimumCGPA: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load job listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseJob = async (id) => {
    if (window.confirm("Are you sure you want to close this job posting? Students will no longer be able to apply.")) {
      try {
        await adminService.closeJob(id);
        toast.success("Job posting closed successfully.");
        fetchJobs();
      } catch (err) {
        console.error(err);
        toast.error("Failed to close job posting.");
      }
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this job posting? This action cannot be undone.")) {
      try {
        await adminService.deleteJob(id);
        toast.success("Job posting successfully deleted.");
        fetchJobs();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete job posting.");
      }
    }
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setEditFormData({
      title: job.title || "",
      salary: job.salary || "",
      vaccancy: job.vaccancy || "",
      minimumCGPA: job.minimumCGPA || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateJob(editingJob._id, editFormData);
      toast.success("Job posting details updated successfully!");
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update job details.");
    }
  };

  // Filter listings
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.companyId?.name && job.companyId.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCgpa = !cgpaFilter || parseFloat(job.minimumCGPA) <= parseFloat(cgpaFilter);
    const matchesStatus = statusFilter === "All" ? true : job.status === statusFilter;

    return matchesSearch && matchesCgpa && matchesStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Job Management</h2>
          <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>Monitor active job postings, adjust requirements, and close open rounds.</p>
        </div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "8px 16px", borderRadius: "8px" }}>
          Total: {filteredJobs.length} Jobs
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
            placeholder="Search jobs by role, location, company name..."
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

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", flex: "3 1 400px" }}>
          <select
            value={cgpaFilter}
            onChange={(e) => setCgpaFilter(e.target.value)}
            style={{ flex: "1 1 130px", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.6)", color: "white", cursor: "pointer", fontSize: "13px" }}
          >
            <option value="">CGPA Requirement</option>
            <option value="6">Under 6.0 CGPA</option>
            <option value="7">Under 7.0 CGPA</option>
            <option value="8">Under 8.0 CGPA</option>
            <option value="9">Under 9.0 CGPA</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ flex: "1 1 130px", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.6)", color: "white", cursor: "pointer", fontSize: "13px" }}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open listings</option>
            <option value="Closed">Closed listings</option>
          </select>

          {(searchQuery || cgpaFilter || statusFilter !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCgpaFilter("");
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

      {/* Main Jobs grid data table */}
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        overflowX: "auto"
      }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading job postings...</p>
        ) : filteredJobs.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No matching job postings found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.1)" }}>
                <th style={{ padding: "16px 20px" }}>Job Role Title</th>
                <th style={{ padding: "16px 20px" }}>Company Recruiter</th>
                <th style={{ padding: "16px 20px" }}>Salary Package</th>
                <th style={{ padding: "16px 20px" }}>Location</th>
                <th style={{ padding: "16px 20px" }}>Min CGPA</th>
                <th style={{ padding: "16px 20px" }}>Vacancies</th>
                <th style={{ padding: "16px 20px" }}>Status</th>
                <th style={{ padding: "16px 20px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }} className="table-row-hover">
                  <td style={{ padding: "16px 20px", fontWeight: "600" }}>{job.title}</td>
                  <td style={{ padding: "16px 20px", color: "#cbd5e1" }}>{job.companyId?.name || "N/A"}</td>
                  <td style={{ padding: "16px 20px" }}>₹{job.salary?.toLocaleString()} / LPA</td>
                  <td style={{ padding: "16px 20px", color: "#cbd5e1" }}>{job.location}</td>
                  <td style={{ padding: "16px 20px", fontWeight: "700", color: "#f59e0b" }}>{job.minimumCGPA} CGPA</td>
                  <td style={{ padding: "16px 20px", fontWeight: "700", textAlign: "center" }}>{job.vaccancy}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "700",
                      backgroundColor: job.status === "Open" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      color: job.status === "Open" ? "#10b981" : "#ef4444"
                    }}>
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleEditClick(job)}
                        style={{ border: "none", background: "rgba(245,158,11,0.1)", color: "#f59e0b", padding: "6px", borderRadius: "6px", cursor: "pointer" }}
                        title="Edit Job Details"
                      >
                        <Edit size={14} />
                      </button>

                      {job.status === "Open" && (
                        <button
                          onClick={() => handleCloseJob(job._id)}
                          style={{ border: "none", background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "6px", borderRadius: "6px", cursor: "pointer" }}
                          title="Close Job Posting"
                        >
                          <XCircle size={14} />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        style={{ border: "none", background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "6px", borderRadius: "6px", cursor: "pointer" }}
                        title="Delete Job"
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

      {/* QUICK EDIT JOB POSTINGS MODAL */}
      {editingJob && (
        <div className="modal-overlay" onClick={() => setEditingJob(null)} style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px", padding: "30px", width: "420px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "17px", fontWeight: "700" }}>Quick Edit Job Posting</h3>
            <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>JOB ROLE TITLE</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "white", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>ANNUAL SALARY PACKAGE (₹)</label>
                <input
                  type="number"
                  required
                  value={editFormData.salary}
                  onChange={(e) => setEditFormData({ ...editFormData, salary: parseInt(e.target.value) })}
                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "white", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>VACANCIES</label>
                  <input
                    type="number"
                    required
                    value={editFormData.vaccancy}
                    onChange={(e) => setEditFormData({ ...editFormData, vaccancy: parseInt(e.target.value) })}
                    style={{ padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "white", outline: "none" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>MIN CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editFormData.minimumCGPA}
                    onChange={(e) => setEditFormData({ ...editFormData, minimumCGPA: parseFloat(e.target.value) })}
                    style={{ padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "white", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  style={{ padding: "10px 15px", border: "none", background: "#334155", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 15px", border: "none", background: "#f59e0b", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
