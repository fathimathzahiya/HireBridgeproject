const express = require("express");
const jobrouter = express.Router();
const {
  getAllJobs,
  getSingleJob,
  searchJobs,
  createJob,
  getCompanyJobs,
  updateJob,
  closeJob,
  deleteJob,
  getJobApplicantCount,
} = require("../controllers/jobcontroller");

// ===== STUDENT JOB ROUTES =====
jobrouter.get("/jobs", getAllJobs);
jobrouter.get("/jobs/search", searchJobs);
jobrouter.get("/jobs/:jobId", getSingleJob);

// ===== COMPANY JOB ROUTES =====
jobrouter.post("/jobs", createJob);
jobrouter.get("/company/:companyId/jobs", getCompanyJobs);
jobrouter.put("/jobs/:jobId", updateJob);
jobrouter.put("/jobs/:jobId/close", closeJob);
jobrouter.delete("/jobs/:jobId", deleteJob);
jobrouter.get("/jobs/:jobId/applicant-count", getJobApplicantCount);

module.exports = jobrouter;