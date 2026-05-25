import React, { useState, useEffect } from "react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import "./JobsList.css";

function RejectedJobs() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRejectedJobs();
  }, []);

  const fetchRejectedJobs = async () => {
    try {
      setLoading(true);
      const studentId = localStorage.getItem("studentId");

      // Fetch all applications
      const applicationsRes = await fetch(`http://localhost:5000/api/application/getapplication`);
      const allApplications = await applicationsRes.json();

      // Filter rejected applications (you may need to add a status field to application model)
      // For now, we'll show applications that exist but have no interviews and are old
      const interviewsRes = await fetch(`http://localhost:5000/api/interview/getinterview`);
      const interviews = await interviewsRes.json();

      const applicationIdsWithInterviews = interviews
        .filter(int => int.studentId === studentId)
        .map(int => int.applicationId);

      // Rejected = applications without interviews (placeholder logic)
      const studentApplications = allApplications.filter(app => 
        app.studentId === studentId && !applicationIdsWithInterviews.includes(app._id)
      ).slice(0, 5); // Show first 5 as rejected for demo

      // Fetch all jobs
      const jobsRes = await fetch(`http://localhost:5000/api/job/getjob`);
      const allJobs = await jobsRes.json();

      // Combine applications with job details
      const rejectedJobsData = studentApplications.map(app => {
        const jobDetails = allJobs.find(job => job._id === app.jobId);
        return {
          ...app,
          jobDetails,
        };
      });

      setApplications(rejectedJobsData);
    } catch (error) {
      console.error("Error fetching rejected jobs:", error);
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
        ) : applications.length === 0 ? (
          <div className="no-data">
            <p>No rejected applications.</p>
          </div>
        ) : (
          <div className="jobs-list">
            {applications.map((application) => (
              <div key={application._id} className="job-card rejected">
                <div className="job-header">
                  <h3>{application.jobDetails?.title}</h3>
                  <span className="status rejected-status">Rejected</span>
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
                  <button className="btn-secondary">View Feedback</button>
                  <button className="btn-primary">Apply Again</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}

export default RejectedJobs;
