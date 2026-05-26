import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jobAPI } from "../../utils/companyDashboardAPI";
import "./JobPostings.css";

const JobPostings = () => {
  const { companyId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillRequired: "",
    salary: "",
    location: "",
    jobType: "Full-time",
    minimumCGPA: "",
    department: "",
    vaccancy: "",
    applicationDeadline: "",
  });

  useEffect(() => {
    fetchJobs();
  }, [companyId]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobAPI.getCompanyJobs(companyId);
      setJobs(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch jobs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJobId) {
        await jobAPI.updateJob(editingJobId, formData);
        alert("Job updated successfully!");
      } else {
        await jobAPI.createJob({
          ...formData,
          companyId,
        });
        alert("Job posted successfully!");
      }
      setFormData({
        title: "",
        description: "",
        skillRequired: "",
        salary: "",
        location: "",
        jobType: "Full-time",
        minimumCGPA: "",
        department: "",
        vaccancy: "",
        applicationDeadline: "",
      });
      setEditingJobId(null);
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      alert("Error saving job: " + err.message);
    }
  };

  const handleEdit = (job) => {
    setFormData({
      title: job.title,
      description: job.description,
      skillRequired: job.skillRequired,
      salary: job.salary,
      location: job.location,
      jobType: job.jobType,
      minimumCGPA: job.minimumCGPA,
      department: job.department,
      vaccancy: job.vaccancy,
      applicationDeadline: job.applicationDeadline || "",
    });
    setEditingJobId(job._id);
    setShowForm(true);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await jobAPI.deleteJob(jobId);
        alert("Job deleted successfully!");
        fetchJobs();
      } catch (err) {
        alert("Error deleting job: " + err.message);
      }
    }
  };

  const handleCloseJob = async (jobId) => {
    if (window.confirm("Are you sure you want to close this job posting?")) {
      try {
        await jobAPI.closeJob(jobId);
        alert("Job closed successfully!");
        fetchJobs();
      } catch (err) {
        alert("Error closing job: " + err.message);
      }
    }
  };

  if (loading && !showForm) {
    return <div className="loading">Loading job postings...</div>;
  }

  return (
    <div className="job-postings-container">
      <div className="job-postings-header">
        <h2>Job Postings</h2>
        {!showForm && (
          <button
            className="btn-post-new-job"
            onClick={() => {
              setShowForm(true);
              setEditingJobId(null);
              setFormData({
                title: "",
                description: "",
                skillRequired: "",
                salary: "",
                location: "",
                jobType: "Full-time",
                minimumCGPA: "",
                department: "",
                vaccancy: "",
                applicationDeadline: "",
              });
            }}
          >
            + Post New Job
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="job-form-container">
          <form onSubmit={handleSubmit} className="job-form">
            <h3>{editingJobId ? "Edit Job" : "Create New Job"}</h3>

            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Senior Developer"
                required
              />
            </div>

            <div className="form-group">
              <label>Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the job role and responsibilities"
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Skills Required *</label>
                <input
                  type="text"
                  name="skillRequired"
                  value={formData.skillRequired}
                  onChange={handleInputChange}
                  placeholder="e.g., JavaScript, React, Node.js"
                  required
                />
              </div>

              <div className="form-group">
                <label>Salary (Annual) *</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g., 500000"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Mumbai, India"
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Type *</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Minimum CGPA *</label>
                <input
                  type="number"
                  step="0.01"
                  name="minimumCGPA"
                  value={formData.minimumCGPA}
                  onChange={handleInputChange}
                  placeholder="e.g., 7.0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Department *</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g., CSE, ECE"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vacancies *</label>
                <input
                  type="number"
                  name="vaccancy"
                  value={formData.vaccancy}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  required
                />
              </div>

              <div className="form-group">
                <label>Application Deadline</label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-actions-row">
              <button type="submit" className="btn-submit">
                {editingJobId ? "Update Job" : "Post Job"}
              </button>
              <button
                type="button"
                className="btn-cancel-form"
                onClick={() => {
                  setShowForm(false);
                  setEditingJobId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="jobs-grid">
        {jobs.length === 0 ? (
          <div className="no-jobs">
            <p>No job postings yet. Create your first job posting!</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className={`job-status ${job.status.toLowerCase()}`}>
                  {job.status}
                </span>
              </div>

              <div className="job-details">
                <p>
                  <strong>Salary:</strong> ₹{job.salary?.toLocaleString()}
                </p>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Job Type:</strong> {job.jobType}
                </p>
                <p>
                  <strong>Department:</strong> {job.department}
                </p>
                <p>
                  <strong>Vacancies:</strong> {job.vaccancy}
                </p>
                <p>
                  <strong>Min CGPA:</strong> {job.minimumCGPA}
                </p>
              </div>

              <div className="job-description">
                <p>{job.description.substring(0, 150)}...</p>
              </div>

              <div className="job-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(job)}
                >
                  Edit
                </button>
                {job.status === "Open" && (
                  <button
                    className="btn-close"
                    onClick={() => handleCloseJob(job._id)}
                  >
                    Close
                  </button>
                )}
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(job._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobPostings;
