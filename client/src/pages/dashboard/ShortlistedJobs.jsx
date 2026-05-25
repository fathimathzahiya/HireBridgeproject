import React, { useState, useEffect } from "react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import "./JobsList.css";

function ShortlistedJobs() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShortlistedJobs();
  }, []);

  const fetchShortlistedJobs = async () => {
    try {
      setLoading(true);
      const studentId = localStorage.getItem("studentId");

      // Fetch all applications
      const applicationsRes = await fetch(`http://localhost:5000/api/application/getapplication`);
      const allApplications = await applicationsRes.json();

      // Filter shortlisted applications (you may need to add a status field to application model)
      // For now, we'll filter by applications that have associated interviews
      const interviewsRes = await fetch(`http://localhost:5000/api/interview/getinterview`);
      const interviews = await interviewsRes.json();

      const shortlistedApplicationIds = interviews
        .filter(int => int.studentId === studentId)
        .map(int => int.applicationId);

      const studentApplications = allApplications.filter(app => 
        app.studentId === studentId && shortlistedApplicationIds.includes(app._id)
      );

      // Fetch all jobs
      const jobsRes = await fetch(`http://localhost:5000/api/job/getjob`);
      const allJobs = await jobsRes.json();

      // Combine applications with job details
      const shortlistedJobsData = studentApplications.map(app => {
        const jobDetails = allJobs.find(job => job._id === app.jobId);
        return {
          ...app,
          jobDetails,
        };
      });

      setApplications(shortlistedJobsData);
    } catch (error) {
      console.error("Error fetching shortlisted jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentDashboardLayout>
      <div>
        <div className="welcome">
          <h1>Shortlisted Jobs</h1>
          <p>Jobs you've been shortlisted for</p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : applications.length === 0 ? (
          <div className="no-data">
            <p>You haven't been shortlisted for any jobs yet.</p>
          </div>
        ) : (
          <div className="jobs-list">
            {applications.map((application) => (
              <div key={application._id} className="job-card">
                <div className="job-header">
                  <h3>{application.jobDetails?.title}</h3>
                  <span className="status shortlisted">Shortlisted</span>
                </div>
                <p className="company"><strong>Company:</strong> Company Name</p>
                <p><strong>Location:</strong> {application.jobDetails?.location}</p>
                <p><strong>Job Type:</strong> {application.jobDetails?.jobType}</p>
                <p><strong>Salary:</strong> ${application.jobDetails?.salary}</p>
                <p><strong>Required Skills:</strong> {application.jobDetails?.skillRequired}</p>
                <p><strong>Minimum CGPA:</strong> {application.jobDetails?.minimumCGPA}</p>
                <div className="description">
                  <p><strong>Description:</strong> {application.jobDetails?.description}</p>
                </div>
                <div className="job-actions">
                  <button className="btn-primary">View Details</button>
                  <button className="btn-secondary">Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}

export default ShortlistedJobs;
