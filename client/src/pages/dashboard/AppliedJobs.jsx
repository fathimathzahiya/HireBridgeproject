import React, { useState, useEffect } from "react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import { applicationAPI } from "../../utils/studentDashboardAPI";
import "./JobsList.css";

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

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

  // Helper function to render status color
  const getStatusClass = (status) => {
    switch (status) {
      case "Selected":
        return "status shortlisted"; // Reuse green color
      case "Rejected":
        return "status rejected-status"; // Red color
      case "Under Review":
      case "Interview Scheduled":
        return "status"; // Orange / default theme
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

        {loading ? (
          <p>Loading applied jobs...</p>
        ) : error ? (
          <div className="no-data">
            <p>⚠️ {error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="no-data">
            <p>You haven't applied to any jobs yet.</p>
          </div>
        ) : (
          <div className="jobs-list">
            {applications.map((application) => {
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
                  <div className="job-actions">
                    <button className="btn-primary">View Details</button>
                    <button className="btn-secondary" style={{ cursor: "not-allowed", opacity: 0.6 }} disabled>
                      Withdrawal Locked
                    </button>
                  </div>
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

