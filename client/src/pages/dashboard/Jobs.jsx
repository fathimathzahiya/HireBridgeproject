import React, { useState, useEffect } from "react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import { jobAPI, studentAPI, applicationAPI } from "../../utils/studentDashboardAPI";
import "./Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Application modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyForm, setApplyForm] = useState({
    phone: "",
    resume: "",
    coverLetter: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (studentId) {
      fetchJobsAndStudentData();
    } else {
      setError("Student ID not found. Please log in.");
      setLoading(false);
    }
  }, [studentId]);

  const fetchJobsAndStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all open jobs
      const allJobs = await jobAPI.getAllJobs();
      
      // Fetch student profile for eligibility checking and modal prefill
      const studentData = await studentAPI.getStudent(studentId);
      setStudent(studentData);

      // Fetch student applications to check already applied jobs
      const studentApps = await applicationAPI.getStudentApplications(studentId);
      setAppliedJobs(studentApps);

      setJobs(allJobs);
    } catch (err) {
      console.error("Error fetching jobs page data:", err);
      setError(err.message || "Failed to load job listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApplyModal = (job) => {
    setSelectedJob(job);
    setApplyForm({
      phone: student?.phoneNumber || "",
      resume: student?.resume ? (student.resume.startsWith("http") ? student.resume : `http://localhost:5000${student.resume}`) : "",
      coverLetter: "",
    });
    setShowApplyModal(true);
  };

  const handleCloseApplyModal = () => {
    setShowApplyModal(false);
    setSelectedJob(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setApplyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      setSubmitting(true);
      await applicationAPI.createApplication({
        studentId,
        jobId: selectedJob._id,
        companyId: selectedJob.companyId?._id || selectedJob.companyId,
        phone: applyForm.phone,
        coverLetter: applyForm.coverLetter,
        resume: applyForm.resume,
      });

      alert("Application submitted successfully!");
      
      // Refresh list to update "Applied" button state
      const studentApps = await applicationAPI.getStudentApplications(studentId);
      setAppliedJobs(studentApps);
      handleCloseApplyModal();
    } catch (err) {
      alert("Application failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isApplied = (jobId) => {
    return appliedJobs.some((app) => (app.jobId?._id || app.jobId) === jobId);
  };

  const isEligible = (minimumCGPA) => {
    if (!student || student.cgpa === undefined || student.cgpa === null) return true; // Default to eligible if student profile has no CGPA
    return student.cgpa >= minimumCGPA;
  };

  return (
    <StudentDashboardLayout>
      <div className="student-jobs-container">
        <div className="welcome">
          <h1>Explore Careers</h1>
          <p>Find and apply for matches matching your qualifications</p>
        </div>

        {loading ? (
          <div className="jobs-loading">
            <div className="spinner"></div>
            <p>Loading available jobs...</p>
          </div>
        ) : error ? (
          <div className="jobs-error">
            <p>⚠️ {error}</p>
            <button className="btn-retry" onClick={fetchJobsAndStudentData}>Retry</button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="no-data">
            <p>No jobs are currently available. Check back later!</p>
          </div>
        ) : (
          <div className="student-jobs-grid">
            {jobs.map((job) => {
              const applied = isApplied(job._id);
              const eligible = isEligible(job.minimumCGPA);
              const companyName = job.companyId?.name || "Company Name";

              return (
                <div key={job._id} className={`student-job-card ${!eligible ? "ineligible-card" : ""}`}>
                  <div className="job-header">
                    <div>
                      <h3 className="job-role">{job.title}</h3>
                      <p className="job-company">🏢 {companyName}</p>
                    </div>
                    {applied ? (
                      <span className="badge badge-success">Applied</span>
                    ) : !eligible ? (
                      <span className="badge badge-danger">Ineligible</span>
                    ) : (
                      <span className="badge badge-info">{job.jobType}</span>
                    )}
                  </div>

                  <div className="job-meta">
                    <p><strong>📍 Location:</strong> {job.location}</p>
                    <p><strong>💰 Salary:</strong> ₹{job.salary?.toLocaleString()} / LPA</p>
                    <p><strong>🎓 Min CGPA Required:</strong> {job.minimumCGPA}</p>
                    <p><strong>⚡ Department:</strong> {job.department}</p>
                  </div>

                  <div className="job-description-preview">
                    <p>{job.description ? job.description.substring(0, 120) + "..." : "No description provided."}</p>
                  </div>

                  <div className="job-skills-tag">
                    <strong>Skills: </strong>
                    {job.skillRequired ? (
                      job.skillRequired.split(",").map((skill, index) => (
                        <span key={index} className="skill-tag">{skill.trim()}</span>
                      ))
                    ) : (
                      "N/A"
                    )}
                  </div>

                  <div className="job-card-actions">
                    {applied ? (
                      <button className="btn-action btn-applied" disabled>
                        ✓ Applied
                      </button>
                    ) : !eligible ? (
                      <button className="btn-action btn-disabled" disabled title={`Requires a minimum CGPA of ${job.minimumCGPA} (Your CGPA: ${student?.cgpa || 'N/A'})`}>
                        Ineligible (Min {job.minimumCGPA} CGPA)
                      </button>
                    ) : (
                      <button className="btn-action btn-apply" onClick={() => handleOpenApplyModal(job)}>
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Apply Modal */}
        {showApplyModal && selectedJob && (
          <div className="modal-overlay" onClick={handleCloseApplyModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Apply for {selectedJob.title}</h2>
                <button className="modal-close" onClick={handleCloseApplyModal}>✕</button>
              </div>
              <p className="modal-sub">at <strong>{selectedJob.companyId?.name || "Company"}</strong></p>

              <form onSubmit={handleApplySubmit} className="modal-form">
                <div className="form-group">
                  <label>Contact Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={applyForm.phone}
                    onChange={handleFormChange}
                    placeholder="Enter your contact number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Resume Link / File URL *</label>
                  <input
                    type="text"
                    name="resume"
                    value={applyForm.resume}
                    onChange={handleFormChange}
                    placeholder="Enter resume URL or Google Drive link"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cover Letter / Notes *</label>
                  <textarea
                    name="coverLetter"
                    value={applyForm.coverLetter}
                    onChange={handleFormChange}
                    placeholder="Tell the recruiter why you are a good fit for this role..."
                    rows="5"
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseApplyModal} disabled={submitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit-app" disabled={submitting}>
                    {submitting ? "Submitting Application..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}

export default Jobs;
