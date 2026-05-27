import React, { useState, useEffect } from "react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import { applicationAPI } from "../../utils/studentDashboardAPI";
import { formatDateToDDMMYYYY } from "../../utils/dateFormatter";
import "./JobsList.css";

function RejectedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRejectedJobs();
  }, []);

  const fetchRejectedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        setError("Student ID not found. Please log in.");
        setLoading(false);
        return;
      }

      // Fetch all student applications
      const studentApps = await applicationAPI.getStudentApplications(studentId);
      
      // Filter applications that are Rejected
      const rejectedApps = studentApps.filter((app) => app.status === "Rejected");

      setApplications(rejectedApps);
    } catch (err) {
      console.error("Error fetching rejected jobs:", err);
      setError(err.message || "Failed to fetch rejected jobs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentDashboardLayout>
      <div>
        <div className="welcome">
          <h1>Rejected Jobs</h1>
          <p>Applications that didn't move forward</p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="no-data">
            <p>⚠️ {error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="no-data">
            <p>No rejected applications.</p>
          </div>
        ) : (
          <div className="jobs-list">
            {applications.map((application) => {
              const job = application.jobId;
              const company = application.companyId || job?.companyId;
              const companyName = company?.name || "Company Name";

              return (
                <div key={application._id} className="job-card rejected">
                  <div className="job-header">
                    <h3>{job?.title || "Role Title"}</h3>
                    <span className="status rejected-status">Rejected</span>
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
                  <div className="job-actions">
                    <button className="btn-secondary" style={{ cursor: "not-allowed", opacity: 0.6 }} disabled>
                      Feedback Recorded
                    </button>
                    <button className="btn-primary" style={{ cursor: "not-allowed", opacity: 0.6 }} disabled>
                      Reapply Locked
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

export default RejectedJobs;
