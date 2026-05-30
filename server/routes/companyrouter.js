const express = require("express");
const companyrouter = express.Router();
const { protect, companyOnly } = require("../middleware/authMiddleware");
const upload = require("../config/multer");
const companyUpload = require("../config/companyMulter");
const {
  getCompanyDashboard,
  getSingleCompany,
  updateCompanyProfile,
  updateCompanyProfilePhoto,
  getAllCompanies,
  getCompanyNotifications,
  markCompanyNotificationAsRead,
  deleteCompanyNotification,
} = require("../controllers/companycontroller");

// ===== COMPANY PROFILE ROUTES =====
companyrouter.get("/companies", protect, getAllCompanies);
companyrouter.get("/company/:companyId", protect, getSingleCompany);
companyrouter.get("/company/:companyId/dashboard", protect, companyOnly, getCompanyDashboard);
companyrouter.put("/company/:companyId", protect, companyOnly, upload.fields([
  { name: "companyLogo", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 }
]), updateCompanyProfile);
companyrouter.put("/company/update-profile-photo", protect, companyOnly, companyUpload.single("profilePhoto"), updateCompanyProfilePhoto);

// ===== COMPANY NOTIFICATION SYSTEM =====
companyrouter.get("/company/notifications", protect, companyOnly, getCompanyNotifications);
companyrouter.patch("/company/notifications/read/:id", protect, companyOnly, markCompanyNotificationAsRead);
companyrouter.delete("/company/notifications/:id", protect, companyOnly, deleteCompanyNotification);

module.exports = companyrouter;