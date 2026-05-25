const express = require("express");
const interviewrouter = express.Router();
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
interviewrouter.post("/interviews", scheduleInterview);
interviewrouter.get("/company/:companyId/interviews", getCompanyInterviews);
interviewrouter.get("/company/:companyId/interviews/:status", getInterviewsByStatus);
interviewrouter.put("/interviews/:interviewId", updateInterviewStatus);

// ===== STUDENT INTERVIEW ROUTES =====
interviewrouter.get("/student/:studentId/interviews", getStudentInterviews);
interviewrouter.get("/student/:studentId/interviews/upcoming", getStudentUpcomingInterviews);
interviewrouter.put("/interviews/:interviewId/cancel", cancelInterview);

module.exports = interviewrouter;