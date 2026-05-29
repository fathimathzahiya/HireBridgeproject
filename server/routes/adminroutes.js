const express = require("express");
const adminrouter = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  loginAdmin,
  getAdminProfile,
  updateAdminSettings,
  getAllStudents,
  getStudentById,
  updateStudent,
  blockStudent,
  deleteStudent,
  getAllCompanies,
  approveCompany,
  blockCompany,
  deleteCompany,
  getAllJobs,
  updateJob,
  closeJob,
  deleteJob,
  getAllApplications,
  deleteApplication,
  getAllInterviews,
  completeInterview,
  sendAnnouncement,
  deleteNotification,
  getAnalyticsStats,
} = require("../controllers/admincontroller");

// ===== PUBLIC AUTH ROUTE =====
adminrouter.post("/login", loginAdmin);

// ===== PROTECTED ADMIN PROFILE ROUTE =====
adminrouter.get("/profile", protect, adminOnly, getAdminProfile);
adminrouter.put("/profile/update", protect, adminOnly, updateAdminSettings);

// ===== STUDENT MANAGEMENT =====
adminrouter.get("/students", protect, adminOnly, getAllStudents);
adminrouter.get("/students/:id", protect, adminOnly, getStudentById);
adminrouter.put("/students/:id", protect, adminOnly, updateStudent);
adminrouter.delete("/students/:id", protect, adminOnly, deleteStudent);
adminrouter.patch("/students/block/:id", protect, adminOnly, blockStudent);

// ===== COMPANY MANAGEMENT =====
adminrouter.get("/companies", protect, adminOnly, getAllCompanies);
adminrouter.patch("/companies/approve/:id", protect, adminOnly, approveCompany);
adminrouter.patch("/companies/block/:id", protect, adminOnly, blockCompany);
adminrouter.delete("/companies/:id", protect, adminOnly, deleteCompany);

// ===== JOB MANAGEMENT =====
adminrouter.get("/jobs", protect, adminOnly, getAllJobs);
adminrouter.put("/jobs/:id", protect, adminOnly, updateJob);
adminrouter.delete("/jobs/:id", protect, adminOnly, deleteJob);
adminrouter.patch("/jobs/close/:id", protect, adminOnly, closeJob);

// ===== APPLICATION MANAGEMENT =====
adminrouter.get("/applications", protect, adminOnly, getAllApplications);
adminrouter.delete("/applications/:id", protect, adminOnly, deleteApplication);

// ===== INTERVIEW MANAGEMENT =====
adminrouter.get("/interviews", protect, adminOnly, getAllInterviews);
adminrouter.patch("/interviews/complete/:id", protect, adminOnly, completeInterview);

// ===== BULLETINS & NOTIFICATIONS =====
adminrouter.post("/notifications/send", protect, adminOnly, sendAnnouncement);
adminrouter.delete("/notifications/:id", protect, adminOnly, deleteNotification);

// ===== ANALYTICS =====
adminrouter.get("/analytics", protect, adminOnly, getAnalyticsStats);

module.exports = adminrouter;
