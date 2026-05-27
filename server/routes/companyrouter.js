const express = require("express");
const companyrouter = express.Router();
const { protect, companyOnly } = require("../middleware/authMiddleware");
const upload = require("../config/multer");
const {
  getCompanyDashboard,
  getSingleCompany,
  updateCompanyProfile,
  getAllCompanies,
} = require("../controllers/companycontroller");

// ===== COMPANY PROFILE ROUTES =====
companyrouter.get("/companies", protect, getAllCompanies);
companyrouter.get("/company/:companyId", protect, getSingleCompany);
companyrouter.get("/company/:companyId/dashboard", protect, companyOnly, getCompanyDashboard);
companyrouter.put("/company/:companyId", protect, companyOnly, upload.fields([
  { name: "companyLogo", maxCount: 1 }
]), updateCompanyProfile);

module.exports = companyrouter;