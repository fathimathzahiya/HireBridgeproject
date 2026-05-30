import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobAPI } from "../../utils/companyDashboardAPI";
import { formatDateToDDMMYYYY } from "../../utils/dateFormatter";
import "./SingleJobView.css";

const SingleJobView = () => {
  const { companyId, jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const data = await jobAPI.getSingleJob(jobId);
      setJob(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch job details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="single-job-loading">
        <div className="spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="single-job-error">
        <p>⚠️ {error || "Job not found"}</p>
        <button className="btn-back" onClick={() => navigate(`/company/${companyId}/jobs`)}>
          Back to Jobs
        </button>
      </div>
    );
  }

  const companyName = job.companyId?.name || "Your Company";
  const companyLogo = job.companyId?.companyLogo;

  return (
    <div className="single-job-container">
      <div className="single-job-header-nav">
        <button className="btn-back-nav" onClick={() => navigate(`/company/${companyId}/jobs`)}>
          ← Back to Job Postings
        </button>
      </div>

      <div className="single-job-card">
        {/* Header Block */}
        <div className="job-header-hero">
          <div className="hero-logo-container">
            <img
              src={
                companyLogo
                  ? companyLogo.startsWith("http")
                    ? companyLogo
                    : `http://localhost:5000${companyLogo}`
                  : "https://i.pravatar.cc/100"
              }
              alt={companyName}
              className="company-hero-logo"
            />
          </div>
          <div className="hero-text">
            <span className="badge-job-type">{job.jobType}</span>
            <h1 className="hero-job-title">{job.title}</h1>
            <h2 className="hero-company-name">🏢 {companyName}</h2>
            <div className="hero-meta-row">
              <span>📍 {job.location}</span>
              <span>•</span>
              <span>💰 ₹{job.salary?.toLocaleString()} LPA</span>
              <span>•</span>
              <span className={`status-tag ${job.status.toLowerCase()}`}>{job.status}</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="job-content-grid">
          {/* Main Info */}
          <div className="job-main-details">
            <div className="detail-section">
              <h3>📝 Job Description</h3>
              <p className="description-text">{job.description}</p>
            </div>

            <div className="detail-section">
              <h3>⚡ Required Skills</h3>
              <div className="skills-tags-container">
                {job.skillRequired ? (
                  job.skillRequired.split(",").map((skill, index) => (
                    <span key={index} className="single-skill-tag">
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">N/A</span>
                )}
              </div>
            </div>

            {job.additionalFields && (
              <div className="detail-section">
                <h3>ℹ️ Additional Information</h3>
                <p className="description-text">{job.additionalFields}</p>
              </div>
            )}
          </div>

          {/* Quick Specifications Sidebar */}
          <div className="job-specs-sidebar">
            <div className="specs-card">
              <h3>Key Details</h3>
              
              <div className="spec-item">
                <span className="spec-label">💼 Experience</span>
                <span className="spec-value">{job.experience || "Not specified (Freshers welcome)"}</span>
              </div>

              <div className="spec-item">
                <span className="spec-label">🎓 Min CGPA Eligibility</span>
                <span className="spec-value">{job.minimumCGPA} CGPA</span>
              </div>

              {job.eligibility && (
                <div className="spec-item">
                  <span className="spec-label">📜 Eligibility Criteria</span>
                  <span className="spec-value">{job.eligibility}</span>
                </div>
              )}

              <div className="spec-item">
                <span className="spec-label">📁 Department</span>
                <span className="spec-value">{job.department}</span>
              </div>

              <div className="spec-item">
                <span className="spec-label">👥 Vacancies</span>
                <span className="spec-value">{job.vaccancy} Openings</span>
              </div>

              <div className="spec-item">
                <span className="spec-label">📅 Application Deadline</span>
                <span className="spec-value highlight-deadline">
                  {job.applicationDeadline ? formatDateToDDMMYYYY(job.applicationDeadline) : "No Deadline Specified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleJobView;
