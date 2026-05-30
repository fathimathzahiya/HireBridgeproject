import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StudentDashboardLayout from "./StudentDashboardLayout";
import { applicationAPI } from "../../utils/studentDashboardAPI";
import { formatDateToDDMMYYYY } from "../../utils/dateFormatter";
import "./JobsList.css";

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    filterAndSearchApplications();
  }, [applications, searchTerm, selectedFilter]);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const studentId = localStorage.getItem("studentId");
      
      if (!studentId) {
        setError("Student ID not found. Please log in.");
        setLoading(false);
        return;
      }

      // Fetch student applications
      const studentApps = await applicationAPI.getStudentApplications(studentId);
      setApplications(studentApps);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
      setError(err.message || "Failed to fetch applied jobs.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearchApplications = () => {
    let filtered = applications;

    // Apply status filter
    if (selectedFilter !== "All") {
      filtered = filtered.filter(app => app.status === selectedFilter);
    }

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

  // Helper function to render status color
  const getStatusClass = (status) => {
    switch (status) {
      case "Selected":
        return "status shortlisted"; // Reuse green color
      case "Rejected":
        return "status rejected-status"; // Red color
      case "Under Review":
        return "status under-review"; // Orange
      case "Interview Scheduled":
        return "status interview-scheduled"; // Purple
      default:
        return "status";
    }
  };

  return (
    <StudentDashboardLayout>
      <div>
        <div className="welcome">
          <h1>Applied Jobs</h1>
          <p>View all the jobs you have applied to</p>
        </div>

        {/* Search and Filter Section */}
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
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            style={{
              padding: "10px 15px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="All">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <p>Loading applied jobs...</p>
        ) : error ? (
          <div className="no-data">
            <p>⚠️ {error}</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="no-data">
            <p>{searchTerm || selectedFilter !== "All" ? "No jobs match your search or filter." : "You haven't applied to any jobs yet."}</p>
          </div>
        ) : (
          <div className="jobs-list">
            <p style={{ marginBottom: "15px", color: "#666" }}>
              Showing {filteredApplications.length} of {applications.length} applications
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
                      {application.status}
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
                    <div className="description" style={{ background: "#fffbeb", borderLeft: "4px solid #f59e0b" }}>
                      <p><strong>Recruiter Feedback:</strong> {application.notes}</p>
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

export default AppliedJobs;

