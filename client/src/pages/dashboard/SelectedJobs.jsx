import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StudentDashboardLayout from "./StudentDashboardLayout";
import { applicationAPI } from "../../utils/studentDashboardAPI";
import { formatDateToDDMMYYYY } from "../../utils/dateFormatter";
import "./JobsList.css";

function SelectedJobs() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSelectedJobs();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm]);

  const fetchSelectedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const studentId = localStorage.getItem("studentId");
      
      if (!studentId) {
        setError("Student ID not found. Please log in.");
        setLoading(false);
        return;
      }

      // Fetch student applications with "Selected" status
      const studentApps = await applicationAPI.getStudentApplicationsByStatus(studentId, "Selected");
      setApplications(studentApps);
    } catch (err) {
      console.error("Error fetching selected jobs:", err);
      setError(err.message || "Failed to fetch selected jobs.");
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => {
        const job = app.jobId;
        const company = app.companyId || job?.companyId;
        const jobTitle = job?.title?.toLowerCase() || "";
        const companyName = company?.name?.toLowerCase() || "";
        const location = job?.location?.toLowerCase() || "";
        
        return jobTitle.includes(term) || companyName.includes(term) || location.includes(term);
      });
    }

    setFilteredApplications(filtered);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Selected":
        return "status shortlisted";
      case "Rejected":
        return "status rejected-status";
      case "Under Review":
        return "status under-review";
      case "Interview Scheduled":
        return "status interview-scheduled";
      default:
        return "status";
    }
  };

  return (
    <StudentDashboardLayout>
      <div>
        <div className="welcome">
          <h1>Selected Jobs</h1>
          <p>View all the jobs where you have been selected</p>
        </div>

        {/* Search Bar */}
        <div className="search-filter-container" style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: "250px",
              padding: "10px 15px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px"
            }}
          />
        </div>

        {loading ? (
          <p>Loading selected jobs...</p>
        ) : error ? (
          <div className="no-data">
            <p>⚠️ {error}</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="no-data">
            <p>{searchTerm ? "No selected jobs match your search." : "You haven't been selected for any jobs yet."}</p>
          </div>
        ) : (
          <div className="jobs-list">
            <p style={{ marginBottom: "15px", color: "#666" }}>
              Showing {filteredApplications.length} selected job(s)
            </p>
            {filteredApplications.map((application) => {
              const job = application.jobId;
              const company = application.companyId || job?.companyId;
              const companyName = company?.name || "Company Name";

              return (
                <div key={application._id} className="job-card">
                  <div className="job-header">
                    <h3>{job?.title || "Role Title"}</h3>
                    <span className={getStatusClass(application.status)}>
                      ✓ {application.status}
                    </span>
                  </div>
                  <p className="company"><strong>Company:</strong> {companyName}</p>
                  <p><strong>Applied On:</strong> {formatDateToDDMMYYYY(application.appliedAt)}</p>
                  <p><strong>Location:</strong> {job?.location || "N/A"}</p>
                  <p><strong>Job Type:</strong> {job?.jobType || "N/A"}</p>
                  <p><strong>Salary:</strong> ₹{job?.salary?.toLocaleString()}</p>
                  <p><strong>Required Skills:</strong> {job?.skillRequired || "N/A"}</p>
                  <p><strong>Minimum CGPA:</strong> {job?.minimumCGPA || "N/A"}</p>
                  <div className="description">
                    <p><strong>Description:</strong> {job?.description || "No description provided."}</p>
                  </div>
                  {application.notes && (
                    <div className="description" style={{ background: "#d4edda", borderLeft: "4px solid #28a745" }}>
                      <p><strong>Company Message:</strong> {application.notes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}

export default SelectedJobs;
