const express = require("express");
const interviewrouter = express.Router();
const { protect, studentOnly, companyOnly } = require("../middleware/authMiddleware");
const {
  scheduleInterview,
  getCompanyInterviews,
  getInterviewsByStatus,
  updateInterviewStatus,
  getStudentInterviews,
  getStudentUpcomingInterviews,
  cancelInterview,
} = require("../controllers/interviewcontroller");

// ===== COMPANY INTERVIEW ROUTES =====
interviewrouter.post("/interviews", protect, companyOnly, scheduleInterview);
interviewrouter.get("/company/:companyId/interviews", protect, companyOnly, getCompanyInterviews);
interviewrouter.get("/company/:companyId/interviews/:status", protect, companyOnly, getInterviewsByStatus);
interviewrouter.put("/interviews/:interviewId", protect, companyOnly, updateInterviewStatus);

// ===== STUDENT INTERVIEW ROUTES =====
interviewrouter.get("/student/:studentId/interviews", protect, studentOnly, getStudentInterviews);
interviewrouter.get("/student/:studentId/interviews/upcoming", protect, studentOnly, getStudentUpcomingInterviews);
interviewrouter.put("/interviews/:interviewId/cancel", protect, cancelInterview);

module.exports = interviewrouter;