// API configuration and utility functions for company dashboard
import axios from "axios";
import { formatDateToDDMMYYYY } from "./dateFormatter";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to inject Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hirebridge_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== COMPANY PROFILE APIs =====
export const companyAPI = {
  getCompanyDashboard: (companyId) =>
    apiClient.get(`/company/${companyId}/dashboard`).then((res) => res.data),

  getSingleCompany: (companyId) =>
    apiClient.get(`/company/${companyId}`).then((res) => res.data),

  updateCompanyProfile: (companyId, data) =>
    apiClient.put(`/company/${companyId}`, data).then((res) => res.data),

  getAllCompanies: () =>
    apiClient.get("/companies").then((res) => res.data),
};

// ===== JOB POSTING APIs =====
export const jobAPI = {
  // Student views
  getAllJobs: () =>
    apiClient.get("/jobs").then((res) => res.data),

  getSingleJob: (jobId) =>
    apiClient.get(`/jobs/${jobId}`).then((res) => res.data),

  searchJobs: (filters) =>
    apiClient.get("/jobs/search", { params: filters }).then((res) => res.data),

  // Company operations
  createJob: (data) =>
    apiClient.post("/jobs", data).then((res) => res.data),

  getCompanyJobs: (companyId) =>
    apiClient.get(`/company/${companyId}/jobs`).then((res) => res.data),

  updateJob: (jobId, data) =>
    apiClient.put(`/jobs/${jobId}`, data).then((res) => res.data),

  closeJob: (jobId) =>
    apiClient.put(`/jobs/${jobId}/close`).then((res) => res.data),

  deleteJob: (jobId) =>
    apiClient.delete(`/jobs/${jobId}`).then((res) => res.data),

  getJobApplicantCount: (jobId) =>
    apiClient.get(`/jobs/${jobId}/applicant-count`).then((res) => res.data),
};

// ===== APPLICATION APIs =====
export const applicationAPI = {
  // Student operations
  applyForJob: (data) =>
    apiClient.post("/applications", data).then((res) => res.data),

  getStudentApplications: (studentId) =>
    apiClient.get(`/student/${studentId}/applications`).then((res) => res.data),

  getStudentApplicationsByStatus: (studentId, status) =>
    apiClient
      .get(`/student/${studentId}/applications/${status}`)
      .then((res) => res.data),

  // Company operations
  getCompanyApplicants: (companyId) =>
    apiClient.get(`/company/${companyId}/applicants`).then((res) => res.data),

  getJobApplicants: (jobId) =>
    apiClient.get(`/job/${jobId}/applicants`).then((res) => res.data),

  getCompanyApplicantsByStatus: (companyId, status) =>
    apiClient
      .get(`/company/${companyId}/applicants/${status}`)
      .then((res) => res.data),

  updateApplicationStatus: (applicationId, data) =>
    apiClient
      .put(`/applications/${applicationId}/status`, data)
      .then((res) => res.data),

  addApplicationNotes: (applicationId, notes) =>
    apiClient
      .put(`/applications/${applicationId}/notes`, { notes })
      .then((res) => res.data),
};

// ===== INTERVIEW APIs =====
export const interviewAPI = {
  // Company operations
  scheduleInterview: (data) =>
    apiClient.post("/interviews", data).then((res) => res.data),

  getCompanyInterviews: (companyId) =>
    apiClient.get(`/company/${companyId}/interviews`).then((res) => res.data),

  getCompanyInterviewsByStatus: (companyId, status) =>
    apiClient
      .get(`/company/${companyId}/interviews/${status}`)
      .then((res) => res.data),

  updateInterviewStatus: (interviewId, data) =>
    apiClient.put(`/interviews/${interviewId}`, data).then((res) => res.data),

  // Student operations
  getStudentInterviews: (studentId) =>
    apiClient.get(`/student/${studentId}/interviews`).then((res) => res.data),

  getStudentUpcomingInterviews: (studentId) =>
    apiClient
      .get(`/student/${studentId}/interviews/upcoming`)
      .then((res) => res.data),

  cancelInterview: (interviewId) =>
    apiClient.put(`/interviews/${interviewId}/cancel`).then((res) => res.data),
};

// ===== UTILITY FUNCTIONS =====

// Filter jobs by various criteria
export const filterJobs = (jobs, filters) => {
  return jobs.filter((job) => {
    if (filters.title && !job.title.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.department && !job.department.toLowerCase().includes(filters.department.toLowerCase())) {
      return false;
    }
    if (filters.jobType && job.jobType !== filters.jobType) {
      return false;
    }
    if (filters.minSalary && job.salary < filters.minSalary) {
      return false;
    }
    if (filters.maxSalary && job.salary > filters.maxSalary) {
      return false;
    }
    return true;
  });
};

// Get application status color
export const getApplicationStatusColor = (status) => {
  const colors = {
    Applied: "#3498db",
    "Under Review": "#f39c12",
    Shortlisted: "#2ecc71",
    "Interview Scheduled": "#9b59b6",
    Selected: "#1abc9c",
    Rejected: "#e74c3c",
  };
  return colors[status] || "#95a5a6";
};

// Get interview status badge
export const getInterviewStatusBadge = (status) => {
  const badges = {
    Scheduled: "warning",
    Completed: "success",
    Cancelled: "danger",
  };
  return badges[status] || "secondary";
};

// Get interview result badge
export const getInterviewResultBadge = (result) => {
  const badges = {
    Pending: "secondary",
    Selected: "success",
    Rejected: "danger",
    "On Hold": "info",
  };
  return badges[result] || "secondary";
};

// Format date time
export const formatDateTime = (date, time) => {
  return `${formatDateToDDMMYYYY(date)} at ${time}`;
};

// Get days until deadline
export const getDaysUntilDeadline = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Check if job is hiring
export const isJobHiring = (job) => {
  return job.status === "Open" && job.vaccancy > 0;
};

// Get application statistics
export const getApplicationStats = (applications) => {
  return {
    total: applications.length,
    applied: applications.filter((a) => a.status === "Applied").length,
    underReview: applications.filter((a) => a.status === "Under Review").length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    interviewScheduled: applications.filter((a) => a.status === "Interview Scheduled").length,
    selected: applications.filter((a) => a.status === "Selected").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };
};

// Sort jobs by date
export const sortJobsByDate = (jobs, order = "desc") => {
  return [...jobs].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
};

// Sort applicants by date
export const sortApplicantsByDate = (applicants, order = "desc") => {
  return [...applicants].sort((a, b) => {
    const dateA = new Date(a.appliedAt);
    const dateB = new Date(b.appliedAt);
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
};

export default {
  companyAPI,
  jobAPI,
  applicationAPI,
  interviewAPI,
};
