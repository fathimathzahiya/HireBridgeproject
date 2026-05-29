import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StudentDashboardLayout from "./StudentDashboardLayout";
import { jobAPI, studentAPI, applicationAPI } from "../../utils/studentDashboardAPI";
import { formatDateToDDMMYYYY } from "../../utils/dateFormatter";
import "./Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Interactive detail/apply modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyFormInModal, setShowApplyFormInModal] = useState(false);
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

  const handleOpenDetailsModal = (job) => {
    setSelectedJob(job);
    setApplyForm({
      phone: student?.phoneNumber || "",
      resume: student?.resume
        ? student.resume.startsWith("http")
          ? student.resume
          : `http://localhost:5000${student.resume}`
        : "",
      coverLetter: "",
    });
    setShowDetailsModal(true);
    setShowApplyFormInModal(false);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedJob(null);
    setShowApplyFormInModal(false);
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

    // Direct CGPA eligibility check
    if (student && student.cgpa !== undefined && student.cgpa !== null && student.cgpa < selectedJob.minimumCGPA) {
      toast.error("You are not eligible for this job based on CGPA requirements.");
      return;
    }

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

      toast.success("Application submitted successfully!");
      
      // Refresh list to update "Applied" button state
      const studentApps = await applicationAPI.getStudentApplications(studentId);
      setAppliedJobs(studentApps);
      handleCloseDetailsModal();
    } catch (err) {
      toast.error("Application failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isApplied = (jobId) => {
    return appliedJobs.some((app) => (app.jobId?._id || app.jobId) === jobId);
  };

  const isEligible = (minimumCGPA) => {
    if (!student || student.cgpa === undefined || student.cgpa === null) return true;
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
                <div 
                  key={job._id} 
                  className={`student-job-card ${!eligible ? "ineligible-card" : ""}`}
                  onClick={() => handleOpenDetailsModal(job)}
                  style={{ cursor: "pointer" }}
                >
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
                      <button 
                        className="btn-action btn-applied" 
                        disabled 
                        onClick={(e) => e.stopPropagation()}
                      >
                        ✓ Applied
                      </button>
                    ) : !eligible ? (
                      <button 
                        className="btn-action btn-disabled" 
                        disabled 
                        onClick={(e) => e.stopPropagation()}
                        title={`Requires a minimum CGPA of ${job.minimumCGPA} (Your CGPA: ${student?.cgpa || 'N/A'})`}
                      >
                        Ineligible (Min {job.minimumCGPA} CGPA)
                      </button>
                    ) : (
                      <button 
                        className="btn-action btn-apply"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetailsModal(job);
                        }}
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* COMBINED DETAILED & APPLY MODAL */}
        {showDetailsModal && selectedJob && (
          <div className="modal-overlay" onClick={handleCloseDetailsModal}>
            <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={handleCloseDetailsModal}>✕</button>

              {!showApplyFormInModal ? (
                /* SECTION 1: DETAILED VIEW */
                <div className="job-popup-details">
                  <div className="popup-header-hero">
                    <span className="badge badge-info">{selectedJob.jobType}</span>
                    <h2>{selectedJob.title}</h2>
                    <p className="popup-company-sub">🏢 {selectedJob.companyId?.name || "Company"}</p>
                  </div>

                  <div className="popup-details-scroller">
                    <div className="popup-spec-grid">
                      <div className="spec-tile">
                        <span className="tile-lbl">💰 Salary Package</span>
                        <span className="tile-val">₹{selectedJob.salary?.toLocaleString()} LPA</span>
                      </div>
                      <div className="spec-tile">
                        <span className="tile-lbl">📍 Location</span>
                        <span className="tile-val">{selectedJob.location}</span>
                      </div>
                      <div className="spec-tile">
                        <span className="tile-lbl">🎓 Min CGPA</span>
                        <span className="tile-val">{selectedJob.minimumCGPA} CGPA</span>
                      </div>
                      <div className="spec-tile">
                        <span className="tile-lbl">💼 Experience</span>
                        <span className="tile-val">{selectedJob.experience || "Freshers allowed"}</span>
                      </div>
                      <div className="spec-tile">
                        <span className="tile-lbl">👥 Vacancies</span>
                        <span className="tile-val">{selectedJob.vaccancy || "N/A"} Openings</span>
                      </div>
                      <div className="spec-tile">
                        <span className="tile-lbl">📅 Deadline</span>
                        <span className="tile-val highlight-dead">
                          {selectedJob.applicationDeadline ? formatDateToDDMMYYYY(selectedJob.applicationDeadline) : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="popup-block-sec">
                      <h3>⚡ Skills Required</h3>
                      <div className="popup-skills-wrap">
                        {selectedJob.skillRequired ? (
                          selectedJob.skillRequired.split(",").map((s, i) => (
                            <span key={i} className="skill-tag-pop">{s.trim()}</span>
                          ))
                        ) : (
                          <span>N/A</span>
                        )}
                      </div>
                    </div>

                    {selectedJob.eligibility && (
                      <div className="popup-block-sec">
                        <h3>📜 Eligibility Criteria</h3>
                        <p className="popup-text-content">{selectedJob.eligibility}</p>
                      </div>
                    )}

                    <div className="popup-block-sec">
                      <h3>📝 Full Job Description</h3>
                      <p className="popup-text-content">{selectedJob.description}</p>
                    </div>

                    {selectedJob.additionalFields && (
                      <div className="popup-block-sec">
                        <h3>ℹ️ Additional Information</h3>
                        <p className="popup-text-content">{selectedJob.additionalFields}</p>
                      </div>
                    )}
                  </div>

                  <div className="popup-footer-actions">
                    {isApplied(selectedJob._id) ? (
                      <button className="btn-action btn-applied" disabled>
                        ✓ Applied Successfully
                      </button>
                    ) : !isEligible(selectedJob.minimumCGPA) ? (
                      <button className="btn-action btn-disabled" disabled>
                        Ineligible (Requires min {selectedJob.minimumCGPA} CGPA)
                      </button>
                    ) : (
                      <button 
                        className="btn-action btn-apply" 
                        onClick={() => setShowApplyFormInModal(true)}
                      >
                        Apply for this Job Round
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* SECTION 2: APPLY FORM round inside same modal overlay */
                <div className="job-popup-apply-form">
                  <div className="popup-header-hero">
                    <h2>Submit Job Application</h2>
                    <p className="popup-company-sub">for {selectedJob.title} at <strong>{selectedJob.companyId?.name}</strong></p>
                  </div>

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
                        rows="4"
                        required
                      />
                    </div>

                    <div className="modal-actions-popup">
                      <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={() => setShowApplyFormInModal(false)} 
                        disabled={submitting}
                      >
                        ← Back to Details
                      </button>
                      <button 
                        type="submit" 
                        className="btn-submit-app" 
                        disabled={submitting}
                      >
                        {submitting ? "Submitting Application..." : "Submit Application"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}

export default Jobs;
