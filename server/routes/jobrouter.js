const express = require("express");
const jobrouter = express.Router();
const { protect, companyOnly } = require("../middleware/authMiddleware");
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
jobrouter.get("/jobs", protect, getAllJobs);
jobrouter.get("/jobs/search", protect, searchJobs);
jobrouter.get("/jobs/:jobId", protect, getSingleJob);

// ===== COMPANY JOB ROUTES =====
jobrouter.post("/jobs", protect, companyOnly, createJob);
jobrouter.get("/company/:companyId/jobs", protect, companyOnly, getCompanyJobs);
jobrouter.put("/jobs/:jobId", protect, companyOnly, updateJob);
jobrouter.put("/jobs/:jobId/close", protect, companyOnly, closeJob);
jobrouter.delete("/jobs/:jobId", protect, companyOnly, deleteJob);
jobrouter.get("/jobs/:jobId/applicant-count", protect, companyOnly, getJobApplicantCount);

module.exports = jobrouter;