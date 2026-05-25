const express = require("express");
const applicationrouter = express.Router();
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
applicationrouter.post("/applications", applyForJob);
applicationrouter.get("/student/:studentId/applications", getStudentApplications);
applicationrouter.get("/student/:studentId/applications/:status", getStudentApplicationsByStatus);

// ===== COMPANY APPLICATION ROUTES =====
applicationrouter.get("/company/:companyId/applicants", getCompanyApplicants);
applicationrouter.get("/job/:jobId/applicants", getJobApplicants);
applicationrouter.get("/company/:companyId/applicants/:status", getCompanyApplicantsByStatus);
applicationrouter.put("/applications/:applicationId/status", updateApplicationStatus);
applicationrouter.put("/applications/:applicationId/notes", addApplicationNotes);

module.exports = applicationrouter;