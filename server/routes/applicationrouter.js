const express = require("express");
const applicationrouter = express.Router();
const { protect, studentOnly, companyOnly } = require("../middleware/authMiddleware");
const {
  applyForJob,
  getStudentApplications,
  getStudentApplicationsByStatus,
  getCompanyApplicants,
  getJobApplicants,
  getCompanyApplicantsByStatus,
  updateApplicationStatus,
  addApplicationNotes,
} = require("../controllers/applicationcontroller");

// ===== STUDENT APPLICATION ROUTES =====
applicationrouter.post("/applications", protect, studentOnly, applyForJob);
applicationrouter.get("/student/:studentId/applications", protect, studentOnly, getStudentApplications);
applicationrouter.get("/student/:studentId/applications/:status", protect, studentOnly, getStudentApplicationsByStatus);

// ===== COMPANY APPLICATION ROUTES =====
applicationrouter.get("/company/:companyId/applicants", protect, companyOnly, getCompanyApplicants);
applicationrouter.get("/job/:jobId/applicants", protect, companyOnly, getJobApplicants);
applicationrouter.get("/company/:companyId/applicants/:status", protect, companyOnly, getCompanyApplicantsByStatus);
applicationrouter.put("/applications/:applicationId/status", protect, companyOnly, updateApplicationStatus);
applicationrouter.put("/applications/:applicationId/notes", protect, companyOnly, addApplicationNotes);

module.exports = applicationrouter;