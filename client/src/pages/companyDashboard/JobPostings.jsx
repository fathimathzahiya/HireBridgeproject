import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jobAPI } from "../../utils/companyDashboardAPI";
import "./JobPostings.css";

const JobPostings = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cgpaFilter, setCgpaFilter] = useState("");
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
    experience: "",
    eligibility: "",
    additionalFields: "",
  });

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        toast.success("Job updated successfully!");
      } else {
        await jobAPI.createJob({
          ...formData,
          companyId,
        });
        toast.success("Job posted successfully!");
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
        experience: "",
        eligibility: "",
        additionalFields: "",
      });
      setEditingJobId(null);
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      toast.error("Error saving job: " + err.message);
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
      applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split("T")[0] : "",
      experience: job.experience || "",
      eligibility: job.eligibility || "",
      additionalFields: job.additionalFields || "",
    });
    setEditingJobId(job._id);
    setShowForm(true);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await jobAPI.deleteJob(jobId);
        toast.success("Job deleted successfully!");
        fetchJobs();
      } catch (err) {
        toast.error("Error deleting job: " + err.message);
      }
    }
  };

  const handleCloseJob = async (jobId) => {
    if (window.confirm("Are you sure you want to close this job posting?")) {
      try {
        await jobAPI.closeJob(jobId);
        toast.success("Job closed successfully!");
        fetchJobs();
      } catch (err) {
        toast.error("Error closing job: " + err.message);
      }
    }
  };

  if (loading && !showForm) {
    return <div className="loading">Loading job postings...</div>;
  }

  // Extract unique filter options dynamically from jobs data
  const uniqueLocations = [...new Set(jobs.map((job) => job.location))].filter(Boolean);
  const uniqueRoles = [...new Set(jobs.map((job) => job.title))].filter(Boolean);
  const uniqueStatuses = [...new Set(jobs.map((job) => job.status))].filter(Boolean);

  // Compute filtered jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.skillRequired && job.skillRequired.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = !roleFilter || job.title.toLowerCase() === roleFilter.toLowerCase();
    const matchesLocation = !locationFilter || job.location.toLowerCase() === locationFilter.toLowerCase();
    const matchesStatus = !statusFilter || job.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCgpa = !cgpaFilter || parseFloat(job.minimumCGPA) <= parseFloat(cgpaFilter);

    return matchesSearch && matchesRole && matchesLocation && matchesStatus && matchesCgpa;
  });

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
                experience: "",
                eligibility: "",
                additionalFields: "",
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

            <div className="form-row">
              <div className="form-group">
                <label>Experience Required</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., Freshers, 2+ years"
                />
              </div>

              <div className="form-group">
                <label>Eligibility Criteria</label>
                <input
                  type="text"
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleInputChange}
                  placeholder="e.g., B.Tech CSE/IT with no active backlogs"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Additional Information</label>
              <textarea
                name="additionalFields"
                value={formData.additionalFields}
                onChange={handleInputChange}
                placeholder="Any other details, terms, criteria..."
                rows="3"
              />
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

      {!showForm && (
        <>
          {/* Advanced Search & Filtering UI Panel */}
          <div className="filter-search-container" style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginBottom: "25px",
            padding: "20px",
            backgroundColor: "#f8fafc",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            alignItems: "center"
          }}>
            {/* Search Input */}
            <div style={{ flex: "2 1 300px", position: "relative" }}>
              <input
                type="text"
                placeholder="🔍 Search jobs by title, description, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>

            {/* Filter Dropdowns */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              flex: "3 1 450px"
            }}>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  flex: "1 1 120px",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "white",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                <option value="">All Roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={{
                  flex: "1 1 120px",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "white",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  flex: "1 1 120px",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "white",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={cgpaFilter}
                onChange={(e) => setCgpaFilter(e.target.value)}
                style={{
                  flex: "1 1 120px",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "white",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                <option value="">Min CGPA Eligibility</option>
                <option value="6">6.0 CGPA & Under</option>
                <option value="7">7.0 CGPA & Under</option>
                <option value="8">8.0 CGPA & Under</option>
                <option value="9">9.0 CGPA & Under</option>
              </select>

              {(searchQuery || roleFilter || locationFilter || statusFilter || cgpaFilter) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter("");
                    setLocationFilter("");
                    setStatusFilter("");
                    setCgpaFilter("");
                  }}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    transition: "background-color 0.2s"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#dc2626"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#ef4444"}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="jobs-grid">
            {filteredJobs.length === 0 ? (
              <div className="no-jobs">
                <p>No matching job postings found.</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="job-card"
                  onClick={() => navigate(`/company/${companyId}/jobs/${job._id}`)}
                  style={{ cursor: "pointer" }}
                >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(job);
                      }}
                    >
                      Edit
                    </button>
                    {job.status === "Open" && (
                      <button
                        className="btn-close"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseJob(job._id);
                        }}
                      >
                        Close
                      </button>
                    )}
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(job._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default JobPostings;
